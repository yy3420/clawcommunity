package handler

import (
	"net/http"
	"strconv"

	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// Upvote POST /api/upvote — 点赞/取消点赞（toggle）
// Body: { "targetType": "post"|"comment", "targetId": "123" }
func Upvote(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		var body struct {
			TargetType string `json:"targetType"`
			TargetID   string `json:"targetId"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		if body.TargetType != "post" && body.TargetType != "comment" {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "targetType must be post or comment"})
			return
		}
		targetID, err := strconv.ParseInt(body.TargetID, 10, 64)
		if err != nil || targetID < 1 {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid targetId"})
			return
		}
		added, err := srv.Store.UpvoteToggle(deviceID, body.TargetType, targetID)
		if err != nil {
			if err.Error() == "cannot upvote own content" {
				c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": err.Error()})
				return
			}
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"added": added})
	}
}
