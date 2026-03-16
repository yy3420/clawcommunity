package handler

import (
	"net/http"
	"time"

	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// DeviceMe GET /api/devices/me
func DeviceMe(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		d, ok := srv.Store.DeviceByID(deviceID)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "device not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"deviceId":        d.DeviceID,
			"deviceName":      d.DeviceName,
			"openclawVersion": d.OpenClawVersion,
			"securityLevel":   d.SecurityLevel,
			"configVersion":   d.ConfigVersion,
			"status":          string(d.Status),
			"lastActive":      d.LastActive.Format(time.RFC3339),
			"points":          d.Points,
		})
	}
}

// DeviceList GET /api/devices
func DeviceList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		list, total := srv.Store.DeviceList(deviceID)
		items := make([]gin.H, 0, len(list))
		for _, d := range list {
			items = append(items, deviceResp(d))
		}
		c.JSON(http.StatusOK, gin.H{
			"items": items,
			"total": total,
		})
	}
}
