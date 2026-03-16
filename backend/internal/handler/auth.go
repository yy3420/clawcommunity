package handler

import (
	"net/http"
	"time"

	"clawhub/backend/internal/model"
	"clawhub/backend/internal/middleware"
	"clawhub/backend/internal/server"
	"github.com/gin-gonic/gin"
)

// deviceResp 返回给前端的设备对象（与需求 9.2 对齐）
func deviceResp(d *model.Device) gin.H {
	return gin.H{
		"deviceId":       d.DeviceID,
		"deviceName":     d.DeviceName,
		"openclawVersion": d.OpenClawVersion,
		"securityLevel":  d.SecurityLevel,
		"configVersion":  d.ConfigVersion,
		"status":         string(d.Status),
		"lastActive":     d.LastActive.Format(time.RFC3339),
		"points":         d.Points,
	}
}

// DeviceRegister 设备注册（预注册）
func DeviceRegister(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			DeviceID      string `json:"deviceId"`
			DeviceName    string `json:"deviceName"`
			SecurityToken string `json:"securityToken"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		d, pending, err := srv.Auth.Register(body.DeviceID, body.DeviceName, body.SecurityToken)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"device":            deviceResp(d),
			"pendingActivation": pending,
		})
	}
}

// DeviceActivateChallenge 获取激活题目
func DeviceActivateChallenge(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.Query("deviceId")
		securityToken := c.Query("securityToken")
		if deviceID == "" || securityToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "deviceId and securityToken required"})
			return
		}
		ch, err := srv.Auth.GetActivateChallenge(deviceID, securityToken)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"challengeId": ch.ChallengeID,
			"question":    ch.Question,
		})
	}
}

// DeviceActivate 提交激活答案
func DeviceActivate(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			ChallengeID   string `json:"challengeId"`
			Answer        string `json:"answer"`
			DeviceID      string `json:"deviceId"`
			SecurityToken string `json:"securityToken"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		if body.DeviceID == "" || body.SecurityToken == "" {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "deviceId and securityToken required"})
			return
		}
		d, err := srv.Auth.Activate(body.ChallengeID, body.Answer, body.DeviceID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
			return
		}
		_, tokenStr, err := srv.Auth.Login(d.DeviceID, d.DeviceName, d.SecurityTokenHash)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to issue token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"device": deviceResp(d),
			"token":  tokenStr,
		})
	}
}

// DeviceLogin 已激活设备登录
func DeviceLogin(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			DeviceID      string `json:"deviceId"`
			DeviceName    string `json:"deviceName"`
			SecurityToken string `json:"securityToken"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		d, tokenStr, err := srv.Auth.Login(body.DeviceID, body.DeviceName, body.SecurityToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"device": deviceResp(d),
			"token":  tokenStr,
		})
		_ = d
	}
}

// Logout 设备登出
func Logout(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		jti, _ := c.Get(string(middleware.JTIKey))
		expire, _ := c.Get(string(middleware.ExpireKey))
		if jti != nil && expire != nil {
			srv.Auth.Logout(jti.(string), expire.(time.Time))
		}
		c.Status(http.StatusNoContent)
	}
}

// Me 当前设备信息
func Me(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID, _ := c.Get(string(middleware.DeviceIDKey))
		d, err := srv.Auth.Me(deviceID.(string))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, deviceResp(d))
	}
}
