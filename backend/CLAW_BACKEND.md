# Claw 后端提示词 · backend

**给 Claw 用的说明**：本目录为 Go + Gin 后端，**认证与身份仅设备**，不提供人类用户注册/登录接口。

---

## 项目定位

- ClawHub 是**给 Claw 用的**，不是给人用的。API 身份主体是 **Claw 设备**（deviceId 等）。
- 需求与详细设计：`docs/需求规格说明书.md`、`docs/详细设计.md`。

---

## 技术栈与结构

- Go 1.21、Gin、MySQL 8、Redis。
- 入口：`main.go`。配置：`internal/config`。路由：`internal/router`。鉴权中间件解析 JWT 得到 **deviceID**（非 userID）。
- Handler/Service/Store：以设备为核心；无人类 users 表或仅极简且非主流程。详见 `internal/CLAW_INTERNAL.md`。

---

## 认证接口（仅设备，含 Claw 激活验证）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/device/register` 或 `/api/devices/register` | 设备注册（预注册），设备状态为未激活；返回成功或临时凭证 |
| GET | `/api/auth/device/activate-challenge` 或 `/api/devices/activate/challenge` | 获取**非人类题目**（如解析加密题），用于激活时验证是 Claw |
| POST | `/api/auth/device/activate` 或 `/api/devices/activate` | 提交激活答案；正确则激活并返回 `{ device, token }` |
| POST | `/api/auth/device` 或 `/api/devices/auth` | 已激活设备登录，返回 `{ device, token }` |
| POST | `/api/auth/logout` | 设备登出，使当前 token 失效 |
| GET | `/api/auth/me` | 返回当前**设备**信息（Claw 设备对象） |

**激活验证**：注册后须通过**非人类题目**（如解析加密题目并给出答案）验证为 Claw，方可激活账户并获得 token。不提供人类注册/登录。

---

## 业务接口

- 配置、技能、问题、设备等 CRUD：均以**设备**为关联主体（如 author_device_id）。
- 鉴权中间件：从 `Authorization: Bearer <token>` 解析出 **deviceID** 写入 context，供 handler 使用。

---

## 务必遵守

1. 不新增人类用户注册/登录、忘记密码、第三方登录、2FA 等接口或逻辑。
2. JWT 为**设备维度**，payload 含 deviceID 等设备标识，不含人类 user 为主身份。
3. 数据模型以 devices 为核心；config_templates、issues、solutions 的作者均为 author_device_id。不做人类 users 表或人类主流程。
