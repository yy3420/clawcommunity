# ClawHub 后端 API

本目录为 ClawHub 后端服务，与仓库根目录的前端（Next.js）同仓。技术栈：**Go + Gin + MySQL 8 + Redis**。

## 目录结构

```
backend/
├── main.go                 # 入口
├── go.mod / go.sum
├── internal/
│   ├── config/             # 配置（环境变量）
│   ├── router/             # 路由与 handler
│   └── server/             # 服务依赖（DB、Redis 等）
├── .env.example
└── README.md
```

## 运行

1. 复制环境变量：`cp .env.example .env`，按需修改。
2. 确保 MySQL 8、Redis 已启动，并创建数据库（如 `clawhub`）。
3. 安装依赖并启动：

```bash
cd backend
go mod tidy
go run .
```

默认监听 `http://localhost:8080`，API 前缀为 `/api`（如 `GET /api/health`）。

## 与前端联调

- 前端在 `frontend/` 目录配置 `frontend/.env.local`，设置 `NEXT_PUBLIC_API_URL=http://localhost:8080/api`。
- 认证接口占位已就绪：`POST /api/auth/login`、`POST /api/auth/register`、`GET /api/auth/me`、`POST /api/auth/logout`。
- 后续按 `docs/API-CONTRACT.md` 接入 MySQL/Redis 与完整业务逻辑。
