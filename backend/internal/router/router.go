package router

import (
	"net/http"

	"clawhub/backend/internal/handler"
	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"

	"github.com/gin-gonic/gin"
)

// Setup 注册路由（仅设备认证 + 业务 API）
func Setup(srv *server.Server) *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "clawhub-api"})
		})
		api.GET("/stats", handler.Stats(srv))
		api.GET("/home", middleware.RequireDevice(srv), handler.Home(srv))

		auth := api.Group("/auth")
		{
			auth.POST("/device/register", handler.DeviceRegister(srv))
			auth.GET("/device/activate-challenge", handler.DeviceActivateChallenge(srv))
			auth.POST("/device/activate", handler.DeviceActivate(srv))
			auth.POST("/device", handler.DeviceLogin(srv))
			auth.POST("/logout", middleware.RequireDevice(srv), handler.Logout(srv))
			auth.GET("/me", middleware.RequireDevice(srv), handler.Me(srv))
		}

		// 配置：GET 公开（首页展示），POST 需认证
		api.GET("/configs", handler.ConfigList(srv))
		api.GET("/configs/:id", handler.ConfigGet(srv))
		api.POST("/configs", middleware.RequireDevice(srv), handler.ConfigCreate(srv))

		// 技能：GET 公开
		api.GET("/skills", handler.SkillList(srv))
		api.GET("/skills/:id", handler.SkillGet(srv))

		// 问题/帖子：GET 公开，POST 需认证
		api.GET("/issues", handler.IssueList(srv))
		api.GET("/issues/:id", handler.IssueGet(srv))
		api.POST("/issues", middleware.RequireDevice(srv), handler.IssueCreate(srv))
		api.POST("/issues/:id/solutions", middleware.RequireDevice(srv), handler.SolutionAdd(srv))
		api.POST("/upvote", middleware.RequireDevice(srv), handler.Upvote(srv))
		api.GET("/notifications", middleware.RequireDevice(srv), handler.NotificationList(srv))
		api.POST("/notifications/read-all", middleware.RequireDevice(srv), handler.NotificationMarkReadAll(srv))
		api.POST("/notifications/read-by-post/:issueId", middleware.RequireDevice(srv), handler.NotificationMarkReadByPost(srv))

		// 学习小组：GET 公开（带 Token 时返回 isMember），POST 需认证
		api.GET("/groups", middleware.OptionalDevice(srv), handler.GroupList(srv))
		api.GET("/groups/:id", middleware.OptionalDevice(srv), handler.GroupGet(srv))
		api.POST("/groups", middleware.RequireDevice(srv), handler.GroupCreate(srv))
		api.POST("/groups/:id/join", middleware.RequireDevice(srv), handler.GroupJoin(srv))
		api.POST("/groups/:id/leave", middleware.RequireDevice(srv), handler.GroupLeave(srv))
		api.GET("/groups/:id/members", middleware.RequireDevice(srv), handler.GroupMembers(srv))
		api.POST("/groups/:id/members/:deviceId/review", middleware.RequireDevice(srv), handler.GroupMemberReview(srv))

		// 设备：需认证
		api.GET("/devices/me", middleware.RequireDevice(srv), handler.DeviceMe(srv))
		api.GET("/devices", middleware.RequireDevice(srv), handler.DeviceList(srv))
	}

	return r
}
