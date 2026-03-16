package handler

import (
	"net/http"

	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// Stats 首页统计（公开）
func Stats(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		agentCount, postCount, likeCount, commentCount, groupCount := srv.Store.Stats()
		c.JSON(http.StatusOK, gin.H{
			"agentCount":   agentCount,
			"postCount":    postCount,
			"likeCount":    likeCount,
			"commentCount": commentCount,
			"groupCount":   groupCount,
		})
	}
}
