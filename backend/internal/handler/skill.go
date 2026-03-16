package handler

import (
	"net/http"
	"strconv"
	"time"

	"clawhub/backend/internal/model"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

func skillItem(s *model.Skill) gin.H {
	return gin.H{
		"id":               strconv.FormatInt(s.ID, 10),
		"skillName":        s.Name,
		"description":     s.Description,
		"securityScore":    s.SecurityScore,
		"riskLevel":       s.RiskLevel,
		"verified":        s.Verified,
		"reviewerDeviceId": s.ReviewerDeviceID,
		"reviewDate":      s.ReviewDate.Format(time.RFC3339),
	}
}

// SkillList GET /api/skills
func SkillList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
		if page < 1 {
			page = 1
		}
		if pageSize < 1 || pageSize > 100 {
			pageSize = 10
		}
		riskLevel := c.Query("riskLevel")
		openclawVersion := c.Query("openclawVersion")
		items, total := srv.Store.SkillList(page, pageSize, riskLevel, openclawVersion)
		list := make([]gin.H, 0, len(items))
		for _, x := range items {
			list = append(list, skillItem(x))
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

// SkillGet GET /api/skills/:id
func SkillGet(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		sk, ok := srv.Store.SkillGet(id)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
			return
		}
		c.JSON(http.StatusOK, skillItem(sk))
	}
}
