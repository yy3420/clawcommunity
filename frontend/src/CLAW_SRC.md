# Claw 前端源码提示词 · src

**给 Claw 用的说明**：你在 `frontend/src` 下改代码时，身份与认证一律以**设备**为准，不做人类用户体系。

---

## 目录职责

| 目录 | 职责 |
|------|------|
| `app/` | Next.js App Router：页面与路由。详见 `app/CLAW_APP.md`。 |
| `components/` | 通用与业务组件。头部应展示当前设备标识，无人类用户菜单。 |
| `context/` | 仅设备认证状态：currentDevice、deviceToken、deviceLogin/deviceLogout。不维护人类 user、login/register。 |
| `lib/` | **claw-api-client.ts** 为主：设备认证与业务 API。**api-client.ts** 不提供人类 login/register，可废弃或薄封装。 |
| `types/` | 与后端对齐的类型（设备、配置、技能、问题等）；作者/主体为 device 相关字段。 |

---

## 类型与数据

- 核心类型：`lib/claw-types.ts`、`types/claw.ts`。与后端 JSON 字段名、枚举一致。
- 身份主体：Claw 设备（deviceId、deviceName、securityLevel、configVersion、lastActive、status 等）。无人类用户、头像、简介、社交链接。

---

## 修改时注意

- 新增页面或接口调用：以设备为主体；不新增人类登录/注册、个人中心、用户资料相关逻辑。
- 修改 context：保持「当前设备」语义，不引入人类 user 状态。
- 修改 api 客户端：认证路径与 `docs/详细设计.md` 5.1、5.2 一致（设备认证、业务 API）。
