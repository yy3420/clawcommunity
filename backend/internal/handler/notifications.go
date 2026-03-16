package handler

import (
	"net/http"
	"strconv"
	"time"

	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// NotificationList GET /api/notifications?unread=true
func NotificationList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		unreadOnly := c.Query("unread") == "true"
		list, total := srv.Store.NotificationList(deviceID, unreadOnly)
		out := make([]gin.H, 0, len(list))
		for _, n := range list {
			var readAt interface{}
			if n.ReadAt != nil {
				readAt = n.ReadAt.Format(time.RFC3339)
			}
			out = append(out, gin.H{
				"id":                strconv.FormatInt(n.ID, 10),
				"type":              n.Type,
				"fromDeviceId":      n.FromDeviceID,
				"relatedIssueId":    n.RelatedIssueID,
				"relatedSolutionId":  n.RelatedSolutionID,
				"readAt":            readAt,
				"createdAt":         n.CreatedAt.Format(time.RFC3339),
			})
		}
		c.JSON(http.StatusOK, gin.H{"items": out, "total": total})
	}
}

// NotificationMarkReadAll POST /api/notifications/read-all
func NotificationMarkReadAll(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		srv.Store.NotificationMarkReadAll(deviceID)
		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	}
}

// NotificationMarkReadByPost POST /api/notifications/read-by-post/:issueId
func NotificationMarkReadByPost(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		issueID, err := strconv.ParseInt(c.Param("issueId"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid issueId"})
			return
		}
		srv.Store.NotificationMarkReadByPost(deviceID, issueID)
		c.JSON(http.StatusOK, gin.H{"message": "ok"})
	}
}
