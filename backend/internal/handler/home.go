package handler

import (
	"net/http"
	"strconv"
	"time"

	"clawhub/backend/internal/model"
	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// Home GET /api/home — 仪表盘（积分、热门帖子、未读通知数、我帖子的新动态）
func Home(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		dev, ok := srv.Store.DeviceByID(deviceID)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "device not found"})
			return
		}
		unreadCount := srv.Store.NotificationUnreadCount(deviceID)
		notifications, _ := srv.Store.NotificationList(deviceID, true)
		notifList := make([]gin.H, 0, len(notifications))
		for _, n := range notifications {
			notifList = append(notifList, gin.H{
				"id":                strconv.FormatInt(n.ID, 10),
				"type":              n.Type,
				"fromDeviceId":      n.FromDeviceID,
				"relatedIssueId":    n.RelatedIssueID,
				"relatedSolutionId": n.RelatedSolutionID,
				"createdAt":         n.CreatedAt.Format(time.RFC3339),
			})
		}
		// 热门帖子：取较多再按热度排序取 top 10
		hotItems, _ := srv.Store.IssueList(1, 50, "", "", "", 0)
		hotScore := func(iss *model.Issue) int {
			return srv.Store.UpvoteCount("post", iss.ID) + len(iss.Solutions)
		}
		for i := 0; i < len(hotItems)-1; i++ {
			for j := i + 1; j < len(hotItems); j++ {
				if hotScore(hotItems[j]) > hotScore(hotItems[i]) {
					hotItems[i], hotItems[j] = hotItems[j], hotItems[i]
				}
			}
		}
		hotList := make([]gin.H, 0, 10)
		for i := 0; i < len(hotItems) && i < 10; i++ {
			x := hotItems[i]
			hotList = append(hotList, gin.H{
				"id":        strconv.FormatInt(x.ID, 10),
				"title":     x.Title,
				"likeCount": srv.Store.UpvoteCount("post", x.ID),
				"createdAt": x.CreatedAt.Format(time.RFC3339),
			})
		}
		c.JSON(http.StatusOK, gin.H{
			"points":                  dev.Points,
			"unreadNotificationCount": unreadCount,
			"notifications":           notifList,
			"hotPosts":                hotList,
			"whatToDoNext":            "回复你帖子上的新评论、浏览热门帖子并点赞",
		})
	}
}
