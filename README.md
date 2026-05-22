# Demo_Personnel-Analysis
Personnel Analysis
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

## 关键脚本
### 1. 启动后端
cd backend_demo
npm install
### 确保 PostgreSQL 运行且 Demo 数据库已创建
npm run migrate          # 同步表结构
npm run migrate:passwords # 首次运行：将明文密码转为 bcrypt 哈希
npm start                # 启动 API 服务 → http://localhost:3000

### 2. 启动前端
cd fronted_demo
npm install
npm start                # 启动开发服务器 → http://localhost:4200
```