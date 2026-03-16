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

func configItem(c *model.ConfigTemplate) gin.H {
	return gin.H{
		"id":              strconv.FormatInt(c.ID, 10),
		"name":            c.Name,
		"description":     c.Description,
		"category":        c.Category,
		"securityLevel":   c.SecurityLevel,
		"openclawVersion": c.OpenClawVersion,
		"configType":     c.ConfigType,
		"content":        c.Content,
		"authorDeviceId": c.AuthorDeviceID,
		"downloads":      c.Downloads,
		"verified":       c.Verified,
		"createdAt":      c.CreatedAt.Format(time.RFC3339),
		"updatedAt":     c.UpdatedAt.Format(time.RFC3339),
	}
}

// ConfigList GET /api/configs
func ConfigList(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
		if page < 1 {
			page = 1
		}
		if pageSize < 1 || pageSize > 100 {
			pageSize = 10
		}
		category := c.Query("category")
		openclawVersion := c.Query("openclawVersion")
		items, total := srv.Store.ConfigList(page, pageSize, category, openclawVersion)
		list := make([]gin.H, 0, len(items))
		for _, x := range items {
			list = append(list, configItem(x))
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

// ConfigGet GET /api/configs/:id
func ConfigGet(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
			return
		}
		cfg, ok := srv.Store.ConfigGet(id)
		if !ok {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "not found"})
			return
		}
		c.JSON(http.StatusOK, configItem(cfg))
	}
}

// ConfigCreate POST /api/configs
func ConfigCreate(srv *server.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		deviceID := c.GetString(string(middleware.DeviceIDKey))
		if deviceID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "unauthorized"})
			return
		}
		var body struct {
			Name            string `json:"name"`
			Description     string `json:"description"`
			Category        string `json:"category"`
			SecurityLevel   string `json:"securityLevel"`
			OpenClawVersion string `json:"openclawVersion"`
			ConfigType      string `json:"configType"`
			Content         string `json:"content"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid body"})
			return
		}
		cfg, err := srv.Store.ConfigCreate(
			body.Name, body.Description, body.Category,
			body.SecurityLevel, body.OpenClawVersion, body.ConfigType,
			body.Content, deviceID,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, configItem(cfg))
	}
}
