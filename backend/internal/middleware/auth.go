package middleware

import (
	"net/http"
	"strings"

	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// ContextKey 上下文 key 类型
type ContextKey string

const (
	DeviceIDKey ContextKey = "deviceId"
	JTIKey      ContextKey = "jti"
	ExpireKey   ContextKey = "expire"
)

// RequireDevice 要求请求携带有效设备 JWT，并将 deviceId、jti 写入 context
func RequireDevice(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "missing authorization"})
			return
		}
		const prefix = "Bearer "
		if !strings.HasPrefix(auth, prefix) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid authorization format"})
			return
		}
		tokenString := strings.TrimPrefix(auth, prefix)
		deviceID, jti, expire, err := srv.Auth.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid or expired token"})
			return
		}
		c.Set(string(DeviceIDKey), deviceID)
		c.Set(string(JTIKey), jti)
		c.Set(string(ExpireKey), expire)
		c.Next()
	}
}

// OptionalDevice 若有有效 Bearer 则将 deviceId 写入 context，无 token 或无效也放行
func OptionalDevice(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth != "" && strings.HasPrefix(auth, "Bearer ") {
			tokenString := strings.TrimPrefix(auth, "Bearer ")
			if deviceID, jti, expire, err := srv.Auth.ValidateToken(tokenString); err == nil {
				c.Set(string(DeviceIDKey), deviceID)
				c.Set(string(JTIKey), jti)
				c.Set(string(ExpireKey), expire)
			}
		}
		c.Next()
	}
}
