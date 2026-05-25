# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personnel Analysis application — a full-stack system for managing employees, departments, roles/permissions, and audit logging.

- **Backend**: `backend_demo/` — LoopBack 4 REST API (TypeScript, PostgreSQL)
- **Frontend**: `fronted_demo/` — Angular 17 standalone components (NG-ZORRO Ant Design, ECharts)
- **Database**: PostgreSQL, datasource config in `backend_demo/src/datasources/demo.datasource.ts`

## Common Commands

### Backend (`backend_demo/`)

```sh
npm start              # Rebuild + start server at http://localhost:3000
npm run build          # Incremental TypeScript build (lb-tsc)
npm run rebuild        # Clean + full build
npm run migrate        # Sync database schemas for models
npm run migrate:passwords  # Convert plain-text passwords to bcrypt hashes (first-time setup)
npm test               # Rebuild + run Mocha tests from dist/__tests__
npm run lint           # ESLint + Prettier check
npm run lint:fix       # Auto-fix lint/format issues
npm run openapi-spec   # Generate OpenAPI spec
```

### Frontend (`fronted_demo/`)

```sh
npm start              # ng serve → http://localhost:4200
npm run build          # Production build
npm test               # Karma + Jasmine unit tests
```

### Full setup sequence

1. Ensure PostgreSQL is running with the `Demo` database created
2. `cd backend_demo && npm install && npm run migrate && npm run migrate:passwords && npm start`
3. `cd fronted_demo && npm install && npm start`

## Architecture

### Backend (LoopBack 4)

```
src/
├── application.ts          # App bootstrap, binds MySequence
├── sequence.ts             # Uses MiddlewareSequence (standard LoopBack 4)
├── index.ts                # Entry point, starts server on port 3000
├── controllers/            # REST endpoints
│   ├── auth.controller.ts      # /login, /change-password, /forgot-password, /hash-password
│   ├── employee.controller.ts  # /employees CRUD
│   ├── role.controller.ts      # /roles CRUD (super-admin gated for writes)
│   ├── department.controller.ts
│   ├── plant.controller.ts
│   ├── region.controller.ts
│   └── audit-log.controller.ts # /audit-logs read-only
├── models/                 # LoopBack Entity definitions (Employee, Role, AuditLog, etc.)
├── repositories/           # Data access layer (one per model)
├── datasources/
│   └── demo.datasource.ts  # PostgreSQL connection config
├── interceptors/
│   ├── auth.interceptor.ts     # Global: JWT verification, attaches currentUser to request
│   └── audit-log.interceptor.ts # Global: auto-logs POST/PATCH/PUT/DELETE to audit_log table
├── services/
│   ├── hash.service.ts     # bcrypt (hashPassword, comparePassword)
│   └── jwt.service.ts      # JWT sign/verify (8h expiry, secret hardcoded)
```

**Global interceptor ordering** is alphabetical by group name: `'audit'` < `'auth'`, so `AuditLogInterceptor` runs as the outer layer → `AuthInterceptor` as inner → controller. This means `audit-log` can read `currentUser` set by `auth` in its `finally` block.

**Authorization model**:
- Public paths (no JWT required): `/login`, `/ping`, `/explorer`, `/hash-password`, `/forgot-password`
- All other paths require Bearer JWT
- JWT payload: `{ employee_id, name, role_id, is_super_admin }`
- Role page permissions use bitmask integers: READ=1, CREATE=2, DELETE=4, UPDATE=8
- Super admin (`is_super_admin: true`) bypasses all permission checks
- Anti-lock protection: cannot delete/remove the last super admin role

### Frontend (Angular 17 standalone)

```
src/app/
├── app.routes.ts           # Route definitions
├── app.config.ts           # Bootstrap providers (router, i18n, HTTP with JWT interceptor, echarts)
├── common/default/         # DefaultComponent — layout shell (sidebar nav, header, profile/password modals)
├── pages/
│   ├── login/              # Login page
│   ├── welcome/            # Home/dashboard page
│   ├── report/             # Data visualization (ECharts)
│   ├── permissions/        # Role & permission management
│   └── audit-log/          # Audit log viewer
├── services/
│   ├── auth.service.ts     # Login/logout, token storage, change/forgot password
│   ├── permission.service.ts # Role CRUD, bitmask permission checks, current user permissions
│   ├── employee.service.ts # Employee CRUD, lookup options (areas, factories, depts, roles)
│   └── audit-log.service.ts
├── guards/
│   └── auth.guard.ts       # CanActivate: checks localStorage for auth_token
├── interceptors/
│   └── jwt.interceptor.ts  # Attaches Bearer token to all requests, redirects to /login on 401
└── models/                 # TypeScript interfaces (role.ts, employee.ts, audit-log.ts)
```

**Route structure**: `/login` → login page; `/default` (guarded by AuthGuard) wraps child routes in `DefaultComponent` layout: `/default/welcome`, `/default/report`, `/default/permissions`, `/default/audit-log`.

**Menu visibility**: `DefaultComponent` loads current user's role permissions and conditionally shows/hides sidebar menu items. Super admin sees all. Non-super-admins see only menu items where their role has READ permission on the corresponding page.

**JWT flow**: Login → server returns token + user info → stored in localStorage → `jwtInterceptor` attaches `Authorization: Bearer <token>` → `AuthGuard` checks token existence for route access.

## Key Design Decisions

- **Standalone components** (no NgModule) — all Angular components use `standalone: true`
- **ECharts usage**: `ngx-echarts` is only used for `forRoot()` registration; components use native `echarts.init()` directly
- **Audit logging is fire-and-forget** — `auditLogRepo.create().catch(...)` does not block the HTTP response
- **Password fields are sanitized** in audit logs (replaced with `'******'`)
- The `employee_id` field is a string type (not numeric)
