package handler

import (
	"net/http"
	"strconv"
	"time"

	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/model"
	"clawhub/backend/internal/server"
	"clawhub/backend/internal/store"
	"github.com/gin-gonic/gin"
)

func groupItem(g *model.StudyGroup, deviceID string, srv *server.Server) gin.H {
	out := gin.H{
		"id":            g.ID,
		"name":          g.Name,
		"description":   g.Description,
		"cover":         g.Cover,
		"memberCount":   g.MemberCount,
		"topic":         g.Topic,
		"ownerDeviceId": g.OwnerDeviceID,
		"joinMode":      g.JoinMode,
		"createdAt":     g.CreatedAt.Format(time.RFC3339),
		"updatedAt":     g.UpdatedAt.Format(time.RFC3339),
	}
	if deviceID != "" {
		status := srv.Store.GroupMemberStatus(g.ID, deviceID)
		out["isMember"] = status != ""
		out["memberStatus"] = status
	}
	return out
}

// GroupList GET /api/groups（允许未认证，首页展示；带认证时返回 isMember/memberStatus）
func GroupList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
		if page < 1 {
			page = 1
		}
		if pageSize < 1 || pageSize > 100 {
			pageSize = 10
		}
		deviceID, _ := c.Get(string(middleware.DeviceIDKey))
		did := ""
		if id, ok := deviceID.(string); ok {
			did = id
		}
		items, total := srv.Store.GroupList(page, pageSize)
		list := make([]gin.H, 0, len(items))
		for _, g := range items {
			list = append(list, groupItem(g, did, srv))
		}
		totalPages := (total + pageSize - 1) / pageSize
		c.JSON(http.StatusOK, gin.H{
			"items": list, "total": total, "page": page, "pageSize": pageSize, "totalPages": totalPages,
		})
	}
}

// GroupGet GET /api/groups/:id（带认证时返回 isMember/memberStatus）
func GroupGet(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		g, ok := srv.Store.GroupGet(id)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
			return
		}
		deviceID, _ := c.Get(string(middleware.DeviceIDKey))
		did := ""
		if idVal, ok := deviceID.(string); ok {
			did = idVal
		}
		c.JSON(http.StatusOK, groupItem(g, did, srv))
	}
}

// GroupCreate POST /api/groups（需认证）
func GroupCreate(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		var body struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Topic       string `json:"topic"`
			JoinMode    string `json:"joinMode"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		g, err := srv.Store.GroupCreate(deviceID, body.Name, body.Description, body.Topic, body.JoinMode)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, groupItem(g, deviceID, srv))
	}
}

// GroupJoin POST /api/groups/:id/join（需认证）
func GroupJoin(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		status, err := srv.Store.GroupJoin(id, deviceID)
		if err != nil {
			if err.Error() == "already member or pending" {
				c.JSON(http.StatusConflict, gin.H{"code": 409, "message": err.Error()})
				return
			}
			if err == store.ErrNotFound {
				c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		msg := "已加入小组"
		if status == "pending" {
			msg = "申请已提交，等待版主审批"
		}
		c.JSON(http.StatusOK, gin.H{"status": status, "message": msg})
	}
}

// GroupLeave POST /api/groups/:id/leave（需认证）
func GroupLeave(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		err = srv.Store.GroupLeave(id, deviceID)
		if err != nil {
			if err.Error() == "owner cannot leave" {
				c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": err.Error()})
				return
			}
			if err == store.ErrNotFound {
				c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
				return
			}
			if err.Error() == "not a member" {
				c.JSON(http.StatusConflict, gin.H{"code": 409, "message": err.Error()})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "已退出小组"})
	}
}

// GroupMembers GET /api/groups/:id/members?status=active|pending（需认证；pending 仅版主可查）
func GroupMembers(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		status := c.DefaultQuery("status", "active")
		if status == "pending" {
			g, ok := srv.Store.GroupGet(id)
			if !ok || g.OwnerDeviceID != deviceID {
				c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "only owner can list pending members"})
				return
			}
		}
		list, err := srv.Store.GroupMembersList(id, status)
		if err != nil {
			if err == store.ErrNotFound {
				c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		out := make([]gin.H, 0, len(list))
		for _, m := range list {
			out = append(out, gin.H{
				"groupId":   m.GroupID,
				"deviceId": m.DeviceID,
				"status":    m.Status,
				"createdAt": m.CreatedAt.Format(time.RFC3339),
			})
		}
		c.JSON(http.StatusOK, gin.H{"items": out})
	}
}

// GroupMemberReview POST /api/groups/:id/members/:deviceId/review（需认证，仅版主）
func GroupMemberReview(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		ownerID := c.GetString(string(middleware.DeviceIDKey))
		groupID, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		targetDeviceID := c.Param("deviceId")
		if targetDeviceID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "missing deviceId"})
			return
		}
		var body struct {
			Action string `json:"action"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		err = srv.Store.GroupMemberReview(groupID, ownerID, targetDeviceID, body.Action)
		if err != nil {
			if err.Error() == "only owner can review" {
				c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": err.Error()})
				return
			}
			if err == store.ErrNotFound {
				c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
				return
			}
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		msg := "已批准加入"
		if body.Action == "reject" {
			msg = "已拒绝申请"
		}
		c.JSON(http.StatusOK, gin.H{"message": msg})
	}
}
