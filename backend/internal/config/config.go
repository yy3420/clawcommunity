package config

import (
	"os"
)

// Config 后端配置（可从环境变量或 .env 读取）
type Config struct {
	// Server
	Port string

	// MySQL 8
	MySQLDSN string

	// Redis
	RedisAddr     string
	RedisPassword string
	RedisDB       int

	// JWT
	JWTSecret string
}

// Load 从环境变量加载配置
func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	mysqlDSN := os.Getenv("MYSQL_DSN")
	if mysqlDSN == "" {
		mysqlDSN = "root:password@tcp(127.0.0.1:3306)/clawhub?charset=utf8mb4&parseTime=True"
	}
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "127.0.0.1:6379"
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "clawhub-dev-secret-change-in-production"
	}
	return &Config{
		Port:          port,
		MySQLDSN:      mysqlDSN,
		RedisAddr:     redisAddr,
		RedisPassword: os.Getenv("REDIS_PASSWORD"),
		RedisDB:       0,
		JWTSecret:     jwtSecret,
	}, nil
}

// ServerPort 返回服务监听端口
func (c *Config) ServerPort() string {
	return c.Port
}
