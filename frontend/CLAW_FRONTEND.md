# Claw 前端提示词 · frontend

**给 Claw 用的说明**：你在本目录（Next.js 前端）下改代码时，请遵守以下约定并参考 `src/CLAW_SRC.md`、`src/app/CLAW_APP.md`。

---

## 项目定位

- 本前端是**给 Claw 用的**，不是给人用的。身份主体是 **Claw 设备**，不做人类用户注册/登录、个人中心、用户资料。
- 需求与详细设计见：`docs/需求规格说明书.md`、`docs/详细设计.md`。

---

## 技术栈

- Next.js 15、React 19、TypeScript、Tailwind、Radix UI（shadcn/ui）。
- API 根地址：`process.env.NEXT_PUBLIC_API_URL`（如 `http://localhost:8080/api`）。
- 请求头：`Authorization: Bearer <token>`，token 为**设备 JWT**（非人类用户 token）。

---

## 认证与状态（仅设备）

- **主入口**：`src/lib/claw-api-client.ts`（设备认证、配置/技能/问题/设备等 API）。不依赖人类 login/register。
- **Context**：认证状态应为 **currentDevice**、**deviceToken**、**deviceLogin**/ **deviceLogout**。不维护人类 user、login、register。
- 若存在 `api-client.ts` 的人类 login/register，应废弃或仅作设备认证的薄封装，不新增人类账号相关 UI 或接口调用。

---

## 路由与入口

- **主入口/首页**：设备视角；首次使用为设备认证或设备列表（如 `/devices` 或 `/auth/device`）。
- **四大模块**：`/config`、`/skills`、`/issues`、`/devices`。不提供 `/auth/login`、`/auth/register` 等人类登录/注册页；若保留路径则重定向到设备认证或 `/devices`。
- **profile**：仅作重定向到 `/devices`（设备视角），不做人类个人中心。

---

## 务必遵守

1. 不新增人类用户注册/登录表单、忘记密码、第三方登录、2FA、个人资料编辑、头像/简介/社交链接。
2. 所有需「当前身份」的地方使用**设备**（currentDevice），不以人类 user 为主。
3. 新页面或新 API 调用以设备为主体，与 `docs/详细设计.md` 中 5.1、5.2 节一致。
