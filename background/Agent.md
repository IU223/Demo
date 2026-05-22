# AGENTS.md

> 本文档为 AI 编码助手提供项目上下文参考。基于代码库静态分析生成。

---

## 1. 技术栈

### 前端 (`fronted_demo`)

| 技术 | 版本 | 说明 |
|------|------|------|
| Angular | ^17.3.0 | 核心框架，使用 **standalone 组件**（无 NgModule） |
| TypeScript | \~5.4.2 | 开发语言 |
| NG-ZORRO (ng-zorro-antd) | ^17.4.1 | UI 组件库（Ant Design Angular 版） |
| ECharts | ^6.0.0 | 图表库（原生 `echarts.init` 方式使用） |
| ngx-echarts | ^17.2.0 | ECharts Angular 封装（仅用于 `forRoot` 注册，组件内使用原生 API） |
| RxJS | \~7.8.0 | 响应式编程 |
| SCSS | — | 样式预处理器 |
| Zone.js | \~0.14.3 | Angular 变更检测 |
| Karma + Jasmine | Karma \~6.4 / Jasmine \~5.1 | 单元测试 |

### 后端 (`backend_demo`)

| 技术 | 版本 | 说明 |
|------|------|------|
| LoopBack 4 | @loopback/core ^7.0.10 | 核心 REST 框架 |
| TypeScript | \~5.2.2 | 开发语言 |
| Node.js | 20 / 22 / 24 | 运行时 |
| PostgreSQL | — | 生产数据库（通过 `loopback-connector-postgresql` ^7.2.3） |
| bcryptjs | ^3.0.3 | 密码哈希 |
| jsonwebtoken | ^9.0.3 | JWT 签发与验证 |
| Mocha | — | 测试框架（通过 `@loopback/testlab`） |

---

## 2. 项目结构

### 前端

```
fronted_demo/src/app/
├── common/                  # 布局组件
│   └── default/             #   主布局（侧边栏 + 顶栏 + router-outlet）
├── guards/                  # 路由守卫
│   └── auth.guard.ts        #   基于 localStorage token 的登录态检查
├── interceptors/            # HTTP 拦截器
│   └── jwt.interceptor.ts   #   自动附加 Bearer token，401 自动跳转登录
├── models/                  # TypeScript 接口/类型定义
│   ├── employee.ts          #   Employee, EmployeeFilter, SelectOption, RoleOption
│   └── role.ts              #   RoleDetail, PageAuthField, PagePermRow
├── pages/                   # 页面级组件（按功能模块划分）
│   ├── login/               #   登录页（含忘记密码弹框）
│   ├── welcome/             #   首页仪表盘（ECharts 图表）
│   ├── report/              #   报表页（员工 CRUD + 表格）
│   └── permissions/         #   权限管理页（角色 CRUD + 位掩码权限）
├── services/                # 业务服务层
│   ├── auth.service.ts      #   登录/登出/JWT解析/修改密码
│   ├── employee.service.ts  #   员工 CRUD + 分析接口
│   └── permission.service.ts #  角色 CRUD + 位运算权限判断
├── app.component.ts         # 根组件（仅包含 router-outlet）
├── app.config.ts            # 应用全局配置（providers 注册）
├── app.routes.ts            # 路由定义
└── icons-provider.ts        # NG-ZORRO 图标注册
```

### 后端

```
backend_demo/src/
├── controllers/             # REST 控制器（处理 HTTP 请求）
│   ├── auth.controller.ts   #   /login, /change-password, /forgot-password, /hash-password
│   ├── employee.controller.ts #  /employees CRUD
│   ├── department.controller.ts # /departments CRUD
│   ├── plant.controller.ts  #   /plants CRUD
│   ├── region.controller.ts #   /regions CRUD
│   ├── role.controller.ts   #   /roles CRUD（含超管鉴权）
│   └── ping.controller.ts   #   /ping 健康检查
├── datasources/             # 数据源配置
│   └── demo.datasource.ts   #   PostgreSQL 连接配置
├── interceptors/            # 全局拦截器
│   └── auth.interceptor.ts  #   JWT 认证拦截（白名单放行 + currentUser 挂载）
├── models/                  # 数据模型（LoopBack Entity）
│   ├── employee.model.ts
│   ├── department.model.ts
│   ├── plant.model.ts
│   ├── region.model.ts
│   └── role.model.ts
├── repositories/            # 数据访问层（DefaultCrudRepository）
├── services/                # 工具服务
│   ├── hash.service.ts      #   bcrypt 哈希与比对
│   └── jwt.service.ts       #   JWT 签发与验证
├── application.ts           # LoopBack 应用入口（Mixin 注册）
├── sequence.ts              # MiddlewareSequence（默认）
├── migrate.ts               # 数据库 schema 迁移脚本
└── migrate-passwords.ts     # 一次性密码哈希迁移脚本
```

---

## 3. 编码规范

### 命名约定

| 类别 | 规则 | 示例 |
|------|------|------|
| **文件名** | 小写 + kebab-case + 后缀 | `auth.guard.ts`, `employee.service.ts`, `role.model.ts` |
| **组件** | PascalCase class + `Component` 后缀 | `LoginComponent`, `DefaultComponent` |
| **服务** | PascalCase class + `Service` 后缀 | `AuthService`, `EmployeeService` |
| **拦截器** | camelCase 导出函数（前端） / PascalCase Provider（后端） | `jwtInterceptor` / `AuthInterceptor` |
| **接口/类型** | PascalCase | `Employee`, `RoleDetail`, `JwtPayload` |
| **常量** | PascalCase 对象 或 UPPER_SNAKE_CASE | `Permission.READ`, `SALT_ROUNDS`, `JWT_SECRET` |
| **数据库字段/API 字段** | snake_case | `employee_id`, `role_name`, `hire_date`, `is_super_admin` |
| **组件属性** | camelCase | `isCollapsed`, `selectedRoleId`, `pageIndex` |

### 代码风格

- **缩进**：2 空格（前后端统一）
- **引号**：后端使用单引号（ESLint + Prettier 配置）；前端同样主用单引号
- **分号**：必须（TypeScript 默认要求）
- **模板**：前端 HTML 模板中属性使用双引号
- **样式前缀**：Angular 组件选择器前缀为 `app`（如 `app-root`, `app-login`）
- **后端 Lint**：继承 `@loopback/eslint-config`，使用 Prettier 格式化

### Angular 特殊规范

- **所有组件均为 standalone**：使用 `standalone: true`，在 `imports` 数组中直接导入依赖模块
- **模板中使用 `*ngIf` / `*ngFor`**：依赖 `CommonModule`（非新版 `@if` 语法）
- **表单**：使用 Reactive Forms（`FormBuilder` + `FormGroup`），非 Template-driven Forms
- **HTTP**：使用功能型拦截器 `HttpInterceptorFn`（Angular 17 风格），非类式拦截器

---

## 4. 架构模式

### 前端：分层组件化架构

```
Pages (视图层)
  ↓ 调用
Services (服务层 — 封装 HTTP 通信 + 业务逻辑)
  ↓ 通过
HttpClient + JWT Interceptor (通信层)
  ↓ 请求
后端 REST API
```

- **路由结构**：扁平化路由 + `DefaultComponent` 作为布局容器（子路由嵌套）
- **权限控制**：**位掩码模式**（`READ=1, CREATE=2, DELETE=4, UPDATE=8`），前端通过 `PermissionService.hasPermission()` 按位与判断
- **认证流程**：登录 → 存储 `auth_token` 和 `user_info` 到 `localStorage` → JWT 拦截器自动附加 → `AuthGuard` 守卫路由
- **超级管理员**：`is_super_admin` 字段存储在角色表和 JWT 中，前端通过 `AuthService.isSuperAdmin()` 判断

### 后端：LoopBack 4 标准分层

```
Controllers (路由 + 请求处理)
  ↓ 注入
Repositories (数据访问 — DefaultCrudRepository)
  ↓ 连接
DataSource (PostgreSQL)
```

- **全局拦截器**：`AuthInterceptor` 作为全局拦截器（`asGlobalInterceptor`），负责 JWT 校验并将 `currentUser` 挂载到 `request` 对象
- **鉴权分层**：Controller 层通过 `(req as any).currentUser` 获取当前用户，按需调用 `assertSuperAdmin()` 进行超管校验
- **密码安全**：bcrypt 哈希（10 轮 salt），所有写操作（create/update）自动哈希密码字段

---

## 5. 依赖管理

| 维度 | 前端 | 后端 |
|------|------|------|
| **包管理器** | npm | npm |
| **Lock 文件** | package-lock.json | package-lock.json |
| **构建工具** | `@angular-devkit/build-angular` | `@loopback/build`（lb-tsc） |
| **关键依赖** | `@angular/core`, `ng-zorro-antd`, `echarts`, `rxjs` | `@loopback/core`, `@loopback/rest`, `bcryptjs`, `jsonwebtoken`, `loopback-connector-postgresql` |

### 关键脚本

```bash
# 前端
npm start        # ng serve (开发服务器)
npm run build    # ng build (生产构建)
npm test         # ng test (Karma 单测)

# 后端
npm start        # 预编译 + node 启动（prestart → rebuild）
npm run build    # lb-tsc 编译
npm run migrate  # 数据库 schema 迁移
npm run migrate:passwords  # 一次性密码哈希迁移
npm test         # Mocha 测试
```

---

## 6. 数据库

| 维度 | 详情 |
|------|------|
| **数据库类型** | PostgreSQL（生产） |
| **ORM** | LoopBack 4 `DefaultCrudRepository`（基于 `juggler`） |
| **连接配置** | `src/datasources/demo.datasource.ts`（host=localhost, port=5432, db=Demo, user=postgres） |
| **迁移方式** | `npm run migrate`（LoopBack `migrateSchema`，支持 `--rebuild` 重建表） |
| **数据模型** | 使用 LoopBack `@model()` + `@property()` 装饰器定义 |
| **数据源名称** | `Demo`（注入 key: `datasources.Demo`） |

### 主要数据表

| 模型 | 主键 | 主键类型 | 说明 |
|------|------|----------|------|
| `Employee` | `employee_id` | `string` | 员工表（核心业务表） |
| `Department` | `dept_id` | `number` | 部门表 |
| `Plant` | `plant_id` | `number` | 厂别表 |
| `Region` | `region_id` | `number` | 地区表（含经纬度） |
| `Role` | `role_id` | `number` | 角色表（含位掩码权限字段 + `is_super_admin`） |

### 权限字段编码规则

角色表中 `home_page_auth`, `report_page_auth`, `auth_page_auth` 使用 **4 位二进制位掩码**：

```
位 0 (1) = READ     查看
位 1 (2) = CREATE   新增
位 2 (4) = DELETE   删除
位 3 (8) = UPDATE   修改
```

示例：`report_page_auth = 15`（二进制 `1111`）= 拥有全部 CRUD 权限

---

## 7. API 规范

### 风格

- **RESTful**（LoopBack 4 标准 CRUD 端点）
- **基础 URL**：`http://localhost:3000`
- **OpenAPI 文档**：`/openapi.json`，可通过 `/explorer` 查看 Swagger UI

### 认证

| 维度 | 详情 |
|------|------|
| **方式** | JWT Bearer Token |
| **Header** | `Authorization: Bearer <token>` |
| **有效期** | 8 小时 |
| **密钥** | 硬编码 `YOUR_SUPER_SECRET_KEY_CHANGE_ME`（⚠️ 需改为环境变量） |
| **白名单路径** | `/login`, `/ping`, `/explorer`, `/hash-password`, `/openapi.json`, `/forgot-password` |

### 主要端点

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/login` | 登录 | 公开 |
| POST | `/forgot-password` | 忘记密码 | 公开 |
| POST | `/change-password` | 修改密码 | JWT |
| GET | `/employees` | 员工列表（支持 LoopBack filter） | JWT |
| GET | `/employees/count` | 员工计数（支持 where） | JWT |
| POST | `/employees` | 新增员工 | JWT |
| PATCH | `/employees/{id}` | 更新员工 | JWT |
| PATCH | `/employees` | 批量更新（如批量软删除） | JWT |
| DELETE | `/employees/{id}` | 删除员工 | JWT |
| GET/POST/PATCH/DELETE | `/roles/**` | 角色 CRUD | JWT + 写操作需超管 |
| GET | `/departments` | 部门列表 | JWT |
| GET | `/plants` | 厂别列表（支持 `region_name` 查询参数） | JWT |
| GET | `/regions` | 地区列表 | JWT |

### 查询过滤格式（LoopBack 4 标准）

```json
// GET /employees?filter=...
{
  "where": { "status": true, "region_name": "CN" },
  "skip": 0,
  "limit": 10,
  "order": ["hire_date DESC"]
}

// GET /employees/count?where=...
{ "employee_id": { "like": "%keyword%" } }
```

### 响应格式

- **成功**：直接返回数据（数组或对象），LoopBack 4 默认格式
- **计数**：`{ "count": number }`
- **错误**：`{ "error": { "statusCode": number, "message": string } }`
- **软删除**：通过 `PATCH /employees?where=...` 设置 `{ "status": false, "resin_date": <now> }` 实现

---

## 8. 测试约定

### 前端

| 维度 | 详情 |
|------|------|
| **框架** | Jasmine + Karma |
| **文件命名** | `*.component.spec.ts` / `*.service.spec.ts`（与被测文件同目录） |
| **当前状态** | 仅有自动生成的骨架测试（`should create` / `should be created`），**覆盖率极低** |
| **运行命令** | `npm test` / `ng test` |

### 后端

| 维度 | 详情 |
|------|------|
| **框架** | Mocha + `@loopback/testlab` |
| **目录** | `src/__tests__/acceptance/` |
| **当前状态** | 仅有 `ping` 和 `home-page` 的验收测试 |
| **运行命令** | `npm test`（先 rebuild 再运行 `lb-mocha`） |
| **配置** | `.mocharc.json`：`exit: true`, `recursive: true` |

### ⚠️ 注意

当前项目测试覆盖率很低，大部分组件和服务缺少有意义的单元测试。新增功能时应补充测试。

---

## 9. 常见陷阱

### 🔴 安全相关

1. **JWT 密钥硬编码**：`jwt.service.ts` 中 `JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_CHANGE_ME'`，生产环境必须改为环境变量
2. **数据库密码硬编码**：`demo.datasource.ts` 中 PostgreSQL 密码 `123456`，需改为环境变量
3. **忘记密码无验证**：`/forgot-password` 端点无需任何身份验证即可重置任意用户密码，存在严重安全风险

### 🟠 前端陷阱

4. **`localStorage` 依赖**：认证信息（`auth_token`, `user_info`）存储在 `localStorage`，SSR 场景下会报错
5. **权限判断基于前端缓存**：`user_info` 中的 `is_super_admin` 和 `role_id` 存储在 `localStorage`，可被用户篡改；后端 `RoleController` 有独立校验，但 **前端菜单显隐可被绕过**
6. **`environment.development.ts` 被显式导入**：多处服务直接 `import { environment } from '../../environments/environment.development'`，而非 `environment.ts`。Angular 的 `fileReplacements` 仅在构建时替换 `environment.ts`，**直接导入 development 文件会导致生产构建仍使用开发配置**
7. **ECharts 全量导入**：`import * as echarts from 'echarts'` 会打包全部图表类型（约 800KB+），建议按需导入
8. **`getAllForAnalysis` 无分页**：`limit: 100000`，数据量大时会严重影响性能和内存
9. **`viewForm` 中的 `region_name` 字段被注释掉**：查看详情时地区字段未展示，但 `modalAreaOptions` 仍被加载
10. **弹框中 `nz-select` 的 `disabled` 状态依赖 NG-ZORRO 内部样式**：大量使用 `::ng-deep` 和 `!important` 覆盖，升级 NG-ZORRO 版本后可能样式失效

### 🟠 后端陷阱

11. **`role_id` 手动自增**：`RoleController.create()` 通过查询最大值 +1 分配 `role_id`，并发创建时可能出现主键冲突（应改用数据库自增或序列）
12. **软删除 vs 硬删除不一致**：员工使用软删除（`status: false`），但 `DELETE /employees/{id}` 仍为硬删除。`deleteEmployees` 前端方法调用的是 `PATCH`（软删除），但后端 `del` 路由是硬删除
13. **密码字段暴露**：`GET /employees` 和 `GET /employees/{id}` 返回结果包含 `password` 字段（虽然是哈希值），应在 Controller 或 Model 层排除
14. **`AuthInterceptor` 白名单**：使用 `startsWith` 匹配，`/login-xxx` 等路径也会被放行
15. **`currentUser` 挂载方式**：通过 `(req as any).currentUser` 进行类型断言，缺乏类型安全

### 🟡 代码质量

16. **`console.log` 散落**：前后端均有大量调试日志（`console.log`, `console.error`），生产环境应移除或使用统一日志框架
17. **`any` 类型泛滥**：前端多处使用 `any`（如 `const emp: any = employee`），削弱 TypeScript 类型保护
18. **`toPromise()` 已废弃**：`permissions.component.ts` 中使用了 `toPromise()`（RxJS 7 中已标记废弃），应改用 `firstValueFrom()` 或 `lastValueFrom()`
19. **前端项目名拼写**：目录名为 `fronted_demo`（少了一个 `n`），应为 `frontend_demo`
20. **`HttpClientModule` 重复导入**：`LoginComponent` 中导入了 `HttpClientModule`，但全局已通过 `provideHttpClient()` 提供，会导致拦截器失效的隐患

---

## 附录：环境变量清单（推荐配置）

```env
# 后端
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<secure-password>
DB_NAME=Demo
JWT_SECRET=<random-256-bit-key>
JWT_EXPIRES_IN=8h
PORT=3000

# 前端
API_URL=http://localhost:3000   # → environment.ts
```

---

## 附录：权限位掩码速查表

```
值   二进制   含义
0    0000     无权限
1    0001     READ
2    0010     CREATE
3    0011     READ + CREATE
4    0100     DELETE
5    0101     READ + DELETE
8    1000     UPDATE
9    1001     READ + UPDATE
15   1111     全部权限 (READ + CREATE + DELETE + UPDATE)
```

---

\*本文件由 AI 基于代码库静态分析自动生成，最后更新: 2026-05-22\*