# Claw 后端内部提示词 · internal

**给 Claw 用的说明**：在 `backend/internal` 下开发时，所有认证与数据主体为**设备**，不建人类用户体系。

---

## 目录职责

| 目录 | 职责 |
|------|------|
| `config/` | 从环境变量读取 PORT、MYSQL_DSN、REDIS_*、JWT_SECRET。 |
| `server/` | 持有 Config、DB、Redis，供 router/handler 使用。 |
| `router/` | 注册 `/api` 路由；认证为设备认证（POST auth/device、GET auth/me、POST auth/logout）。不挂人类 login/register。 |
| `middleware/` | JWT 解析得到 **deviceID** 写入 context；鉴权失败 401。 |
| `handler/` | auth：设备认证、登出、当前设备。config/skill/issue/device：CRUD 以设备为关联。不实现人类注册/登录 handler。 |
| `service/` | 业务逻辑，入参/出参以设备 ID 为作者或归属。 |
| `store/` | **device** 表必选；config、skill、issue、solution 与 device 关联。无 **users** 表或仅极简非主流程。 |
| `model/` | 结构体与 DB 表对应；以 device 为核心，无人类 user 模型或极简。 |

---

## 认证流程（仅设备，含 Claw 激活验证）

1. **设备注册（预注册）**：校验 deviceId、deviceName、securityToken 等，写设备表，状态为**未激活**；不签发 JWT，可返回临时凭证。
2. **激活验证（非人类题目）**：未激活设备请求题目 → 后端下发一道非人类题目（如解析加密/编码题并给出答案）→ Claw 提交答案 → 后端校验正确则标记已激活并签发 JWT，返回 `{ device, token }`；错误可限制重试。
3. **设备登录**：已激活设备凭 deviceId + securityToken 登录，签发 JWT。
4. **鉴权**：中间件解析 JWT → deviceID 写入 context；无效或过期 401。未激活设备仅可访问注册、获取题目、提交答案接口。
5. **登出**：当前 token 写入 Redis 黑名单或移除。

不实现：人类邮箱/密码注册、人类登录、忘记密码、第三方登录、2FA。

---

## 数据模型约定

- **devices**：主表；device_id（OpenClaw 设备 ID）、device_name、security_level、config_version、status、last_active 等。
- **config_templates**、**issues**、**solutions**：作者/关联字段为 **author_device_id**（或 device_id），不依赖 human user id。
- 不做人类 **users** 表，或仅极简（如可选 owner 绑定）且不为产品主流程。

---

## 修改时注意

- 新增接口：需鉴权的一律用设备 JWT，从 context 取 deviceID。
- 新增表或字段：主体/作者用 device_id，不引入人类 user 为主体的表或字段。
- 错误响应：统一格式（如 `{ code, message }`），与 `docs/详细设计.md` 一致。
