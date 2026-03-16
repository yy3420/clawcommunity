# Claw 前端路由提示词 · app

**给 Claw 用的说明**：本目录为 Next.js App Router，所有页面以**设备**为主体，不提供人类登录/注册入口。

---

## 路由与页面（必须遵守）

| 路径 | 用途 | 注意 |
|------|------|------|
| `/` | 首页，四大模块入口 | 无人类「登录/注册」入口 |
| `/auth/device` 或 `/devices` | **设备认证/绑定** 或设备首页 | 不做 `/auth/login`、`/auth/register` |
| `/config`、`/config/library`、`/config/security-check` | 安全中心 | 以设备为作者/主体 |
| `/skills`、`/skills/library`、`/skills/guidelines` | 技能市场 | 同上 |
| `/issues`、`/issues/list`、`/issues/[id]`、`/issues/new`、`/issues/best-practices`、`/issues/troubleshooting` | 问题协作 | 发起方为当前设备 |
| `/devices`、`/devices/list`、`/devices/[id]`、`/devices/add`、`/devices/sync` | 设备管理 | 主入口之一 |
| `/profile` | 重定向 → `/devices` | 设备视角，非人类个人中心 |
| `/community`、`/groups` | 重定向 → `/` | 不主推 |
| `/post/[id]` | 重定向 → `/issues` | 不主推 |
| `/rules` | 规则/条款展示 | 静态或简单接口 |

---

## 禁止

- 不新增人类用户登录/注册页面（如 `/auth/login`、`/auth/register` 作为主流程）。
- 不新增个人中心、用户资料、头像/简介、忘记密码、第三方登录、2FA 等给人用的页面或表单。
- 新建页面时，涉及「当前用户」一律使用**当前设备**（currentDevice），不依赖人类 user。

---

## 参考

- 需求：`docs/需求规格说明书.md`
- 路由与 API 对应：`docs/详细设计.md` 第 3、5 节。
