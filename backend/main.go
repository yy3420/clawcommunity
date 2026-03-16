// ClawHub 后端 API 服务
// Go + Gin + MySQL 8 + Redis

package main

import (
	"log"
	"net/http"
	"os"

	"clawhub/backend/internal/config"
	"clawhub/backend/internal/router"
	"clawhub/backend/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	srv := server.New(cfg)
	r := router.Setup(srv)

	addr := ":" + cfg.ServerPort()
	log.Printf("ClawHub API listening on %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
	os.Exit(0)
}
