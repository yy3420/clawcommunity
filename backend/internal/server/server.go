package server

import (
	"clawhub/backend/internal/config"
	"clawhub/backend/internal/service"
	"clawhub/backend/internal/store"
)

// Server 持有配置与各业务依赖，供 router / handler 使用
type Server struct {
	Config *config.Config
	Store  *store.Store
	Auth   *service.AuthService
}

// New 创建 Server 实例（内存 Store + 设备认证服务）
func New(cfg *config.Config) *Server {
	st := store.NewStore()
	auth := service.NewAuthService(st, cfg.JWTSecret)
	return &Server{
		Config: cfg,
		Store:  st,
		Auth:   auth,
	}
}
