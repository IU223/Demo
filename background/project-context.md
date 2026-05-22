```markdown
# 项目上下文摘要

> 供 AI 编码助手在后续对话中快速理解项目全貌。
> 最后更新：2026-05-22

---

## 项目概述

**人员分析系统（fronted_demo + backend_demo）**：一个基于 Angular 17 + LoopBack 4 + PostgreSQL 的企业员工管理与数据分析平台，支持员工 CRUD、仪表盘可视化、基于位掩码的 RBAC 权限管理。

---

## 核心业务模型与实体关系

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Region     │ 1───N │    Plant     │       │  Department  │
│ region_id PK │       │ plant_id  PK │       │ dept_id   PK │
│ region_name  │       │ plant_name   │       │ dept_code    │
│ longitude    │       │ site         │       │ dept_desc    │
│ latitude     │       │              │       │ dept_desc_a  │
│ region_name_cn│      └──────────────┘       └──────────────┘
└──────────────┘              │                      │
                              │ (plant_name)         │ (dept_desc)
                              ▼                      ▼
                       ┌─────────────────────────────────────┐
                       │            Employee                  │
                       │ employee_id   PK (string)            │
                       │ password      (bcrypt hash)          │
                       │ name / name_a                        │
                       │ Sex           (boolean: true=男)     │
                       │ dept_desc     → Department.dept_desc │
                       │ plant_name    → Plant.plant_name     │
                       │ region_name   → Region.region_name   │
                       │ role_id       → Role.role_id (FK逻辑)│
                       │ hire_date / resin_date               │
                       │ status        (true=在职, false=离职)│
                       │ hasaccess     (boolean)              │
                       └─────────────┬───────────────────────┘
                                     │ role_id
                                     ▼
                       ┌──────────────────────────┐
                       │          Role             │
                       │ role_id        PK (number)│
                       │ role_name                 │
                       │ description               │
                       │ home_page_auth   (bitmask)│
                       │ report_page_auth (bitmask)│
                       │ auth_page_auth   (bitmask)│
                       │ is_super_admin   (boolean)│
                       └──────────────────────────┘
```

### 关系说明

- **Employee ↔ Role**：多对一（`employee.role_id → role.role_id`），逻辑外键，无数据库级约束
- **Employee ↔ Department/Plant/Region**：通过 `dept_desc`、`plant_name`、`region_name` 字符串字段关联（非外键），属于**冗余存储**
- **Region ↔ Plant**：一对多（同一地区下有多个厂别），前端通过 `GET /plants?region_name=XX` 联动查询

### 权限位掩码编码

```
READ   = 1  (0001)
CREATE = 2  (0010)
DELETE = 4  (0100)
UPDATE = 8  (1000)
```

每个页面权限字段（`home_page_auth`、`report_page_auth`、`auth_page_auth`）存储一个 0–15 的整数，通过按位与（`&`）判断权限。

---

## 功能模块列表

### 前端模块

| 模块 | 路径 | 职责 |
|------|------|------|
| **登录** | `pages/login/` | 用户名密码登录、忘记密码（无验证直接重置）、登录后按权限跳转首个有权页面 |
| **主布局** | `common/default/` | 侧边栏（按权限显隐菜单）、顶栏（用户头像下拉）、个人资料编辑弹框、修改密码弹框、`<router-outlet>` 子路由承载 |
| **首页仪表盘** | `pages/welcome/` | 在职/离职统计卡片（含同比/环比）、入职离职趋势折线图、厂别人数排行榜、世界地图散点图（地区分布）、部门饼图（按编码前3位归类）、性别环形图 |
| **报表** | `pages/report/` | 员工列表（分页 + 筛选：时间/地区/厂别/关键词）、新增员工（支持批量分页录入）、编辑员工、查看员工详情（只读弹框）、批量软删除 |
| **权限管理** | `pages/permissions/` | 超管：角色列表切换、角色 CRUD、位掩码权限配置表格；普通用户：只读查看自身角色权限 |

### 后端模块

| 模块 | 路径 | 职责 |
|------|------|------|
| **AuthController** | `controllers/auth.controller.ts` | `/login`（bcrypt 比对 + JWT 签发）、`/change-password`（JWT 认证）、`/forgot-password`（公开）、`/hash-password`（工具） |
| **EmployeeController** | `controllers/employee.controller.ts` | `/employees` 标准 CRUD，创建/更新时自动 bcrypt 哈希密码 |
| **RoleController** | `controllers/role.controller.ts` | `/roles` CRUD，写操作需超管权限，含防自锁逻辑（不可取消唯一超管）、删除前检查员工绑定 |
| **DepartmentController** | `controllers/department.controller.ts` | `/departments` 标准 CRUD |
| **PlantController** | `controllers/plant.controller.ts` | `/plants` 标准 CRUD，支持 `region_name` 查询参数 |
| **RegionController** | `controllers/region.controller.ts` | `/regions` 标准 CRUD |
| **AuthInterceptor** | `interceptors/auth.interceptor.ts` | 全局拦截器：JWT 校验 + 白名单放行 + `currentUser` 挂载 |
| **HashService** | `services/hash.service.ts` | bcrypt 哈希与比对（SALT_ROUNDS=10） |
| **JwtService** | `services/jwt.service.ts` | JWT 签发与验证（8h 过期） |

---

## 关键文件与入口点

### 路由配置

**前端路由** — `fronted_demo/src/app/app.routes.ts`

```
/                   → 重定向到 /login
/login              → LoginComponent（公开）
/default            → DefaultComponent（AuthGuard 守卫）
  /default/welcome    → WelcomeComponent
  /default/report     → ReportComponent
  /default/permissions → PermissionsComponent
```

- `AuthGuard`（`guards/auth.guard.ts`）：检查 `localStorage` 中是否有 `auth_token`
- 登录后根据角色权限动态跳转到第一个有 READ 权限的页面

### 状态管理

**无集中式状态管理**（无 NgRx/Akita）。状态分散在：

| 状态位置 | 内容 |
|---------|------|
| `localStorage.auth_token` | JWT 字符串 |
| `localStorage.user_info` | `{ employee_id, name, role_id, is_super_admin }` JSON |
| 各组件实例属性 | 表单数据、表格数据、筛选条件、分页状态 |
| `AuthService` | 封装 `localStorage` 读写 + JWT 解码 |
| `PermissionService` | 权限位运算 + 角色缓存查询 |

### 数据库模型定义

| 文件 | 模型 | 主键 |
|------|------|------|
| `backend_demo/src/models/employee.model.ts` | Employee | `employee_id` (string) |
| `backend_demo/src/models/department.model.ts` | Department | `dept_id` (number) |
| `backend_demo/src/models/plant.model.ts` | Plant | `plant_id` (number) |
| `backend_demo/src/models/region.model.ts` | Region | `region_id` (number) |
| `backend_demo/src/models/role.model.ts` | Role | `role_id` (number) |

### 应用入口

| 入口 | 文件 | 说明 |
|------|------|------|
| 前端 Bootstrap | `fronted_demo/src/main.ts` | `bootstrapApplication(AppComponent, appConfig)` |
| 前端全局配置 | `fronted_demo/src/app/app.config.ts` | providers 注册（Router、HttpClient、JWT 拦截器、ECharts、NG-ZORRO i18n） |
| 后端应用类 | `backend_demo/src/application.ts` | `BackendDemoApplication`（BootMixin + RepositoryMixin + ServiceMixin） |
| 后端启动 | `backend_demo/src/index.ts` | `main()` → boot → start（默认端口 3000） |
| 数据库迁移 | `backend_demo/src/migrate.ts` | `npm run migrate`（支持 `--rebuild`） |
| 密码迁移 | `backend_demo/src/migrate-passwords.ts` | 一次性将明文密码转为 bcrypt 哈希 |

---

## 公共组件 / 工具函数 / 中间件

### 前端

| 名称 | 路径 | 用途 |
|------|------|------|
| **DefaultComponent** | `common/default/` | 全局布局容器（侧边栏 + 顶栏 + router-outlet + 个人资料弹框 + 修改密码弹框） |
| **jwtInterceptor** | `interceptors/jwt.interceptor.ts` | HTTP 拦截器函数：自动附加 `Authorization: Bearer` 头，401 自动清 token 并跳转登录 |
| **AuthGuard** | `guards/auth.guard.ts` | 路由守卫：检查 `localStorage.auth_token` 存在性 |
| **AuthService** | `services/auth.service.ts` | 登录/登出/JWT 解码/修改密码/忘记密码/`isSuperAdmin()` |
| **EmployeeService** | `services/employee.service.ts` | 员工 CRUD + 下拉选项加载（地区/厂别/部门/角色）+ 分析数据查询 |
| **PermissionService** | `services/permission.service.ts` | 位掩码权限判断（`hasPermission`/`encodePermissions`/`decodePermissions`）+ 角色 CRUD |
| **Employee 接口** | `models/employee.ts` | `Employee`、`EmployeeFilter`、`EmployeeResponse`、`SelectOption`、`RoleOption` |
| **Role 接口** | `models/role.ts` | `RoleDetail`、`PageAuthField`、`PagePermRow` |
| **icons-provider** | `icons-provider.ts` | NG-ZORRO 图标集中注册 |

### 后端

| 名称 | 路径 | 用途 |
|------|------|------|
| **AuthInterceptor** | `interceptors/auth.interceptor.ts` | 全局拦截器（`asGlobalInterceptor`）：JWT 校验、白名单放行、`currentUser` 挂载到 `request` |
| **hashPassword / comparePassword** | `services/hash.service.ts` | bcrypt 哈希与比对（导出为纯函数） |
| **generateToken / verifyToken** | `services/jwt.service.ts` | JWT 签发与验证（导出为纯函数） |
| **MySequence** | `sequence.ts` | 继承 `MiddlewareSequence`（默认中间件序列） |
| **CurrentUserProfile** | `interceptors/auth.interceptor.ts` | 接口类型 `{ employee_id, name?, role_id?, is_super_admin? }` |
| **5 个 Repository** | `repositories/\*.repository.ts` | 均继承 `DefaultCrudRepository`，注入 `datasources.Demo` |

---

## 环境配置

### 前端

```
fronted_demo/src/environments/
├── environment.ts              # 生产环境（当前为空对象 {}）
└── environment.development.ts  # 开发环境
```

```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

> ⚠️ **已知问题**：多个 Service 直接 `import` 的是 `environment.development.ts` 而非 `environment.ts`，导致 Angular 的 `fileReplacements` 机制在生产构建时不生效。

### 后端

**无 `.env` 文件**，所有配置硬编码在源码中：

| 配置项 | 位置 | 当前值 |
|--------|------|--------|
| DB Host | `datasources/demo.datasource.ts` | `localhost` |
| DB Port | 同上 | `5432` |
| DB User | 同上 | `postgres` |
| DB Password | 同上 | `123456` |
| DB Name | 同上 | `Demo` |
| JWT Secret | `services/jwt.service.ts` | `YOUR_SUPER_SECRET_KEY_CHANGE_ME` |
| JWT Expiry | 同上 | `8h` |
| Server Port | `src/index.ts` | `process.env.PORT ?? 3000` |
| Server Host | 同上 | `process.env.HOST ?? '127.0.0.1'` |
| Bcrypt Salt Rounds | `services/hash.service.ts` | `10` |

### 推荐的 `.env` 结构（尚未实现）

```env
# 后端 backend_demo/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<secure-password>
DB_NAME=Demo
JWT_SECRET=<random-256-bit-key>
JWT_EXPIRES_IN=8h
PORT=3000
HOST=0.0.0.0
BCRYPT_SALT_ROUNDS=10

# 前端通过 environment.ts 配置
# API_URL=http://localhost:3000
```

---

## 数据流概览

```
用户操作 (浏览器)
    │
    ▼
Angular Component (页面组件)
    │  调用
    ▼
Angular Service (AuthService / EmployeeService / PermissionService)
    │  HttpClient.get/post/patch/delete
    ▼
JWT Interceptor (自动附加 Bearer token)
    │
    ▼
LoopBack 4 REST API (http://localhost:3000)
    │
    ▼
AuthInterceptor (全局拦截器: JWT 校验 → currentUser 挂载)
    │
    ▼
Controller (路由处理 + 业务逻辑 + 鉴权检查)
    │  注入
    ▼
Repository (DefaultCrudRepository)
    │  juggler ORM
    ▼
PostgreSQL (数据库: Demo)
```

---

## 快速启动

```bash
# 1. 启动后端
cd backend_demo
npm install
# 确保 PostgreSQL 运行且 Demo 数据库已创建
npm run migrate          # 同步表结构
npm run migrate:passwords # 首次运行：将明文密码转为 bcrypt 哈希
npm start                # 启动 API 服务 → http://localhost:3000

# 2. 启动前端
cd fronted_demo
npm install
npm start                # 启动开发服务器 → http://localhost:4200
```

---

*本文件基于项目源码静态分析生成，供 AI 编码助手作为上下文参考。*
```

---

以上内容即为 `ai/docs/project-context.md` 的完整内容。文档涵盖了：

1. **一句话项目描述** — 企业员工管理与数据分析平台
2. **实体关系图** — 5 个核心模型的关联方式（含 ASCII 图示）
3. **功能模块清单** — 前端 5 个模块 + 后端 9 个模块，各自职责明确
4. **关键入口点** — 路由配置、状态管理方式、数据库模型文件、应用启动入口
5. **公共组件/工具/中间件** — 前端 9 项 + 后端 6 项，含路径和用途
6. **环境配置** — 当前硬编码现状 + 推荐 `.env` 结构
7. **数据流概览** + **快速启动指南**