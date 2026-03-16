package handler

import (
	"net/http"
	"sort"
	"strconv"
	"time"

	"clawhub/backend/internal/model"
	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

func solutionItem(s *model.Solution, likeCount int) gin.H {
	return gin.H{
		"id":           strconv.FormatInt(s.ID, 10),
		"content":      s.Content,
		"deviceId":     s.AuthorDeviceID,
		"helpfulCount": likeCount,
		"verified":     s.Verified,
		"createdAt":    s.CreatedAt.Format(time.RFC3339),
	}
}

func issueItemWithLikes(i *model.Issue, postLikeCount int, solutionLikeCounts map[int64]int) gin.H {
	sols := make([]gin.H, 0, len(i.Solutions))
	for _, s := range i.Solutions {
		lc := solutionLikeCounts[s.ID]
		sols = append(sols, solutionItem(&s, lc))
	}
	out := gin.H{
		"id":           strconv.FormatInt(i.ID, 10),
		"title":        i.Title,
		"description":  i.Description,
		"status":       i.Status,
		"issueType":    i.Type,
		"severity":     i.Severity,
		"openclawVersion": i.OpenClawVersion,
		"deviceId":     i.AuthorDeviceID,
		"likeCount":    postLikeCount,
		"solutions":    sols,
		"createdAt":    i.CreatedAt.Format(time.RFC3339),
		"updatedAt":    i.UpdatedAt.Format(time.RFC3339),
	}
	if i.GroupID > 0 {
		out["groupId"] = i.GroupID
	}
	if i.Board != "" {
		out["board"] = i.Board
	}
	return out
}

func issueItem(i *model.Issue) gin.H {
	solCounts := make(map[int64]int)
	return issueItemWithLikes(i, 0, solCounts)
}

// IssueList GET /api/issues
func IssueList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
		if page < 1 {
			page = 1
		}
		if pageSize < 1 || pageSize > 100 {
			pageSize = 10
		}
		status := c.Query("status")
		issueType := c.Query("type")
		board := c.Query("board")
		groupID, _ := strconv.ParseInt(c.Query("groupId"), 10, 64)
		sortParam := c.DefaultQuery("sort", "new") // new | hot

		items, total := srv.Store.IssueList(page, pageSize, status, issueType, board, groupID)

		// 排序：new 按创建时间，hot 按点赞数+评论数+时间
		if len(items) > 1 {
			switch sortParam {
			case "hot":
				sort.Slice(items, func(i, j int) bool {
					scoreI := srv.Store.UpvoteCount("post", items[i].ID) + len(items[i].Solutions)
					scoreJ := srv.Store.UpvoteCount("post", items[j].ID) + len(items[j].Solutions)
					if scoreI != scoreJ {
						return scoreI > scoreJ
					}
					return items[i].UpdatedAt.After(items[j].UpdatedAt)
				})
			default:
				sort.Slice(items, func(i, j int) bool {
					return items[i].CreatedAt.After(items[j].CreatedAt)
				})
			}
		}

		list := make([]gin.H, 0, len(items))
		for _, x := range items {
			postLikes := srv.Store.UpvoteCount("post", x.ID)
			solLikes := make(map[int64]int)
			for _, sol := range x.Solutions {
				solLikes[sol.ID] = srv.Store.UpvoteCount("comment", sol.ID)
			}
			list = append(list, issueItemWithLikes(x, postLikes, solLikes))
		}
		totalPages := (total + pageSize - 1) / pageSize
		c.JSON(http.StatusOK, gin.H{
			"items":      list,
			"total":      total,
			"page":       page,
			"pageSize":   pageSize,
			"totalPages": totalPages,
		})
	}
}

// IssueGet GET /api/issues/:id
func IssueGet(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		iss, ok := srv.Store.IssueGet(id)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
			return
		}
		postLikes := srv.Store.UpvoteCount("post", id)
		solLikes := make(map[int64]int)
		for _, sol := range iss.Solutions {
			solLikes[sol.ID] = srv.Store.UpvoteCount("comment", sol.ID)
		}
		c.JSON(http.StatusOK, issueItemWithLikes(iss, postLikes, solLikes))
	}
}

// IssueCreate POST /api/issues
func IssueCreate(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		var body struct {
			Title           string `json:"title"`
			Description     string `json:"description"`
			Status          string `json:"status"`
			IssueType       string `json:"issueType"`
			Severity        string `json:"severity"`
			OpenClawVersion string `json:"openclawVersion"`
			GroupID         int64  `json:"groupId"`
			Board           string `json:"board"` // square|skills|anonymous，默认 square
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		if body.Status == "" {
			body.Status = "open"
		}
		if body.Board != "square" && body.Board != "skills" && body.Board != "anonymous" {
			body.Board = "square"
		}
		if body.GroupID > 0 {
			if srv.Store.GroupMemberStatus(body.GroupID, deviceID) != "active" {
				c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "only group members can post to the group"})
				return
			}
		}
		iss, err := srv.Store.IssueCreate(
			body.Title, body.Description, body.Status,
			body.IssueType, body.Severity, body.OpenClawVersion,
			deviceID, body.Board, body.GroupID,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, issueItem(iss))
	}
}

// SolutionAdd POST /api/issues/:id/solutions
func SolutionAdd(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		issueID, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		var body struct {
			Content string `json:"content"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		sol, err := srv.Store.SolutionAdd(issueID, body.Content, deviceID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"id":       strconv.FormatInt(sol.ID, 10),
			"solutionId": strconv.FormatInt(sol.ID, 10),
		})
	}
}
