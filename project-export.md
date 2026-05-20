# 前后端项目导出

> 导出时间: 2026/5/20 10:06:23

---

## 项目 1: 前端项目 (fronted_demo)

### 一、项目结构

```
fronted_demo/
├── src
│   ├── app
│   │   ├── common
│   │   │   └── default
│   │   │       ├── default.component.html
│   │   │       ├── default.component.scss
│   │   │       ├── default.component.spec.ts
│   │   │       └── default.component.ts
│   │   ├── guards
│   │   │   └── auth.guard.ts
│   │   ├── interceptors
│   │   │   └── jwt.interceptor.ts
│   │   ├── models
│   │   │   ├── employee.ts
│   │   │   └── role.ts
│   │   ├── pages
│   │   │   ├── login
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   ├── login.component.spec.ts
│   │   │   │   └── login.component.ts
│   │   │   ├── permissions
│   │   │   │   ├── permissions.component.html
│   │   │   │   ├── permissions.component.scss
│   │   │   │   ├── permissions.component.spec.ts
│   │   │   │   └── permissions.component.ts
│   │   │   ├── report
│   │   │   │   ├── report.component.html
│   │   │   │   ├── report.component.scss
│   │   │   │   ├── report.component.spec.ts
│   │   │   │   └── report.component.ts
│   │   │   └── welcome
│   │   │       ├── welcome.component.html
│   │   │       ├── welcome.component.scss
│   │   │       ├── welcome.component.ts
│   │   │       └── welcome.routes.ts
│   │   ├── services
│   │   │   ├── auth.service.ts
│   │   │   ├── employee.service.ts
│   │   │   ├── permission.service.spec.ts
│   │   │   └── permission.service.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── icons-provider.ts
│   ├── environments
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

### 二、项目代码

共 45 个文件

### 📄 `angular.json`

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "fronted_demo": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/fronted_demo",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "./node_modules/@ant-design/icons-angular/src/inline-svg/",
                "output": "/assets/"
              }
            ],
            "styles": [
              "./node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.development.ts"
                }
              ]
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "fronted_demo:build:production"
            },
            "development": {
              "buildTarget": "fronted_demo:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "fronted_demo:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "./node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
              "src/styles.scss"
            ],
            "scripts": []
          }
        }
      }
    }
  }
}
```

---

### 📄 `package.json`

```json
{
  "name": "fronted-demo",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.3.0",
    "@angular/common": "^17.3.0",
    "@angular/compiler": "^17.3.0",
    "@angular/core": "^17.3.0",
    "@angular/forms": "^17.3.0",
    "@angular/platform-browser": "^17.3.0",
    "@angular/platform-browser-dynamic": "^17.3.0",
    "@angular/router": "^17.3.0",
    "@ctrl/tinycolor": "^4.2.0",
    "echarts": "^6.0.0",
    "ng-zorro-antd": "^17.4.1",
    "ngx-echarts": "^17.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.3.17",
    "@angular/cli": "^17.3.17",
    "@angular/compiler-cli": "^17.3.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.4.2"
  }
}
```

---

### 📄 `src/app/app.component.html`

```html
<router-outlet></router-outlet>
```

---

### 📄 `src/app/app.component.scss`

```scss

```

---

### 📄 `src/app/app.component.spec.ts`

```typescript

```

---

### 📄 `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
}
```

---

### 📄 `src/app/app.config.ts`

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';  // ★ 改动
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { jwtInterceptor } from './interceptors/jwt.interceptor';  // ★ 新增

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzIcons(),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])  // ★ 注册 JWT 拦截器
    ),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts })),
  ],
};
```

---

### 📄 `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DefaultComponent } from './common/default/default.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ReportComponent } from './pages/report/report.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'default', component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'report', component: ReportComponent },
      { path: 'permissions', component: PermissionsComponent },
    ]
  }
];
```

---

### 📄 `src/app/common/default/default.component.html`

```html
<nz-layout class="app-layout">
  <!-- 侧边栏 -->
  <nz-sider class="menu-sidebar" nzCollapsible nzWidth="256px" nzBreakpoint="md" [(nzCollapsed)]="isCollapsed"
    [nzTrigger]="null">
    <div class="sidebar-logo">
      <a href="https://ng.ant.design/" target="_blank">
        <img src="https://ng.ant.design/assets/img/logo.svg" alt="logo">
        <h1>人员分析系统</h1>
      </a>
    </div>

    <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed">
      <!-- ★ 新增 *ngIf -->
      <li nz-menu-item *ngIf="showHomeMenu" [nzSelected]="activeMenu === 'home'" (click)="selectMenu('home')">
        <a routerLink="/default/welcome">
          <span nz-icon nzType="home"></span>
          <span>首页</span>
        </a>
      </li>
      <!-- ★ 新增 *ngIf -->
      <li nz-menu-item *ngIf="showReportMenu" [nzSelected]="activeMenu === 'reports'" (click)="selectMenu('reports')">
        <a routerLink="/default/report">
          <span nz-icon nzType="table"></span>
          <span>报表</span>
        </a>
      </li>
      <!-- ★ 新增 *ngIf -->
      <li nz-menu-item *ngIf="showPermMenu" [nzSelected]="activeMenu === 'permissions'"
        (click)="selectMenu('permissions')">
        <a routerLink="/default/permissions">
          <span nz-icon nzType="apartment"></span>
          <span>权限</span>
        </a>
      </li>
    </ul>

  </nz-sider>

  <!-- 右侧主体内容 -->
  <nz-layout>
    <nz-header>
      <div class="app-header">
        <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
          <span class="trigger" nz-icon [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"></span>
        </span>

        <div class="header-right">
          <div class="user-dropdown" nz-dropdown [nzDropdownMenu]="userMenu" nzTrigger="click"
            nzPlacement="bottomRight">
            <nz-avatar class="user-avatar" [nzText]="userAvatar" nzSize="default"
              style="background-color: #1890ff; cursor: pointer;">
            </nz-avatar>
            <span class="user-name">{{ userName }}</span>
            <span nz-icon nzType="caret-down" class="dropdown-arrow"></span>
          </div>
        </div>

        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu class="user-menu">
            <li nz-menu-item (click)="onProfileSettings()">
              <span nz-icon nzType="user" nzTheme="outline"></span>
              <span>个人资料设置</span>
            </li>
            <li nz-menu-divider></li>
            <li nz-menu-item (click)="onChangePassword()">
              <span nz-icon nzType="lock" nzTheme="outline"></span>
              <span>修改密码</span>
            </li>
            <li nz-menu-item (click)="onLogout()">
              <span nz-icon nzType="logout" nzTheme="outline"></span>
              <span>退出登录</span>
            </li>
          </ul>
        </nz-dropdown-menu>

      </div>
    </nz-header>
    <nz-content>
      <div class="inner-content">
        <router-outlet></router-outlet>
      </div>
    </nz-content>
  </nz-layout>
</nz-layout>

<!-- ===================== 个人资料编辑对话框 ===================== -->
<nz-modal [(nzVisible)]="isProfileVisible" [nzTitle]="profileTitleTpl" [nzFooter]="profileFooterTpl" [nzWidth]="520"
  [nzMaskClosable]="false" [nzClosable]="true" (nzOnCancel)="handleProfileCancel()">

  <ng-template #profileTitleTpl>
    <div class="custom-modal-title">
      <span nz-icon nzType="user" nzTheme="outline" style="margin-right: 8px;"></span>
      个人资料设置
    </div>
  </ng-template>

  <ng-container *nzModalContent>
    <div class="modal-form-wrapper">
      <form nz-form [formGroup]="profileForm" nzLayout="horizontal">
        <nz-form-item>
          <nz-form-label [nzSpan]="6">工号</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="employee_id" readonly />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>性别</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-radio-group formControlName="Sex">
              <label nz-radio [nzValue]="true">男</label>
              <label nz-radio [nzValue]="false">女</label>
            </nz-radio-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确姓名(简体中文或者繁体中文)">
            <input nz-input formControlName="name" placeholder="请输入姓名" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>英文姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确英文名(大小写字母)">
            <input nz-input formControlName="name_a" placeholder="请输入英文姓名" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>部门</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择部门">
            <nz-select formControlName="dept_desc" nzPlaceHolder="请选择部门" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of deptOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>地区</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择地区">
            <nz-select formControlName="region_name" nzPlaceHolder="请选择地区" nzShowSearch nzAllowClear
              (ngModelChange)="onProfileAreaChange($event)">
              <nz-option *ngFor="let opt of modalAreaOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>厂别</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择厂别">
            <nz-select formControlName="plant_name" nzPlaceHolder="请选择厂别" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of modalFactoryOptions" [nzLabel]="opt.label"
                [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6">角色</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="role_id" nzPlaceHolder="-">
              <nz-option *ngFor="let opt of roleOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  </ng-container>

  <ng-template #profileFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handleProfileOk()" [nzLoading]="profileSubmitting">保存</button>
      <button nz-button nzType="default" (click)="handleProfileCancel()">取消</button>
    </div>
  </ng-template>
</nz-modal>

<!-- ===================== ★ 修改密码对话框（新增） ===================== -->
<nz-modal [(nzVisible)]="isPasswordVisible" [nzTitle]="passwordTitleTpl" [nzFooter]="passwordFooterTpl" [nzWidth]="460"
  [nzMaskClosable]="false" [nzClosable]="true" (nzOnCancel)="handlePasswordCancel()">

  <!-- 标题 -->
  <ng-template #passwordTitleTpl>
    <div class="custom-modal-title">
      <span nz-icon nzType="lock" nzTheme="outline" style="margin-right: 8px;"></span>
      修改密码
    </div>
  </ng-template>

  <!-- 内容区 -->
  <ng-container *nzModalContent>
    <div class="modal-form-wrapper password-form-wrapper">
      <form nz-form [formGroup]="passwordForm" nzLayout="horizontal">

        <!-- 原密码 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>原密码</nz-form-label>
          <nz-form-control [nzSpan]="15" nzErrorTip="请输入原密码">
            <nz-input-group [nzSuffix]="oldPwdSuffix">
              <input nz-input [type]="oldPwdVisible ? 'text' : 'password'" formControlName="oldPassword"
                placeholder="请输入原密码" autocomplete="current-password" />
            </nz-input-group>
            <ng-template #oldPwdSuffix>
              <span nz-icon [nzType]="oldPwdVisible ? 'eye' : 'eye-invisible'" (click)="oldPwdVisible = !oldPwdVisible"
                class="password-toggle-icon">
              </span>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <!-- 新密码 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>新密码</nz-form-label>
          <nz-form-control [nzSpan]="15" [nzErrorTip]="newPwdErrorTpl">
            <nz-input-group [nzSuffix]="newPwdSuffix">
              <input nz-input [type]="newPwdVisible ? 'text' : 'password'" formControlName="newPassword"
                placeholder="请输入新密码（至少6位）" autocomplete="new-password" />
            </nz-input-group>
            <ng-template #newPwdSuffix>
              <span nz-icon [nzType]="newPwdVisible ? 'eye' : 'eye-invisible'" (click)="newPwdVisible = !newPwdVisible"
                class="password-toggle-icon">
              </span>
            </ng-template>
            <!-- 多条件错误提示 -->
            <ng-template #newPwdErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">请输入新密码</ng-container>
              <ng-container *ngIf="control.hasError('minlength')">密码长度不能少于6位</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <!-- 确认新密码 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>确认密码</nz-form-label>
          <nz-form-control [nzSpan]="15" [nzErrorTip]="confirmPwdErrorTpl">
            <nz-input-group [nzSuffix]="confirmPwdSuffix">
              <input nz-input [type]="confirmPwdVisible ? 'text' : 'password'" formControlName="confirmPassword"
                placeholder="请再次输入新密码" autocomplete="new-password" />
            </nz-input-group>
            <ng-template #confirmPwdSuffix>
              <span nz-icon [nzType]="confirmPwdVisible ? 'eye' : 'eye-invisible'"
                (click)="confirmPwdVisible = !confirmPwdVisible" class="password-toggle-icon">
              </span>
            </ng-template>
            <!-- 多条件错误提示 -->
            <ng-template #confirmPwdErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">请再次输入新密码</ng-container>
              <ng-container *ngIf="control.hasError('mismatch')">两次输入的密码不一致</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

      </form>

      <!-- 密码安全提示 -->
      <div class="password-tips">
        <div class="tips-title">
          <span nz-icon nzType="safety-certificate" nzTheme="outline"></span>
          密码安全要求
        </div>
        <ul class="tips-list">
          <li>密码长度至少 6 个字符</li>
          <li>建议使用字母、数字和符号的组合</li>
          <li>新密码不能与原密码相同</li>
        </ul>
      </div>
    </div>
  </ng-container>

  <!-- 底部按钮 -->
  <ng-template #passwordFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handlePasswordOk()" [nzLoading]="passwordSubmitting">
        确认修改
      </button>
      <button nz-button nzType="default" (click)="handlePasswordCancel()">取消</button>
    </div>
  </ng-template>
</nz-modal>
```

---

### 📄 `src/app/common/default/default.component.scss`

```scss
:host {
  display: flex;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-layout {
  min-height: 100vh;
}

.menu-sidebar {
  position: relative;
  z-index: 10;
  min-height: 100%;
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
}

.header-trigger {
  height: 64px;
  padding: 20px 24px;
  font-size: 20px;
  cursor: pointer;
  transition: all .3s, padding 0s;
}

.trigger:hover {
  color: #1890ff;
}

.sidebar-logo {
  position: relative;
  height: 64px;
  padding-left: 24px;
  overflow: hidden;
  line-height: 64px;
  background: #001529;
  transition: all .3s;
}

.sidebar-logo img {
  display: inline-block;
  height: 32px;
  width: 32px;
  vertical-align: middle;
}

.sidebar-logo h1 {
  display: inline-block;
  margin: 0 0 0 20px;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}

nz-header {
  padding: 0;
  width: 100%;
  z-index: 2;
}

.app-header {
  position: relative;
  height: 64px;
  padding: 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

nz-content {
  margin: 0;
}

.inner-content {
  padding: 8px;
  background: #fff;
}

/* ===================== 右侧用户头像区域 ===================== */

.header-right {
  display: flex;
  align-items: center;
  padding-right: 24px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
  height: 64px;
  transition: background 0.3s ease;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.user-avatar {
  margin-right: 8px;
  font-size: 14px;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 4px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.45);
  transition: transform 0.3s;
}

/* 下拉菜单样式 */
.user-menu {
  min-width: 160px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    transition: all 0.2s;

    &:hover {
      color: #1890ff;
    }

    [nz-icon] {
      font-size: 16px;
    }
  }
}

/* ===================== 弹框通用样式 ===================== */

.custom-modal-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 弹框表单包装器 */
.modal-form-wrapper {

  /* 禁用状态的 input 框 */
  input[readonly],
  input:disabled,
  .ant-input-disabled,
  .ant-input[disabled] {
    color: rgba(0, 0, 0, 0.85) !important;
    background-color: #fafafa !important;
    cursor: default !important;
    border-color: #d9d9d9 !important;
  }

  /* 禁用状态的 select */
  .ant-select-disabled {
    .ant-select-selector {
      color: rgba(0, 0, 0, 0.85) !important;
      background-color: #fafafa !important;
      cursor: default !important;
    }

    .ant-select-arrow {
      display: none;
    }
  }

  /* 禁用状态的 radio */
  .ant-radio-disabled+span,
  .ant-radio-wrapper-disabled {
    color: rgba(0, 0, 0, 0.85) !important;
    cursor: default !important;
  }
}

/* ===================== ★ 修改密码弹框专用样式 ===================== */

/* 密码可见性切换图标 */
.password-toggle-icon {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

/* 密码安全提示区域 */
.password-tips {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f6f8fa;
  border-radius: 6px;
  border: 1px solid #e8ecf0;

  .tips-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 8px;

    [nz-icon] {
      color: #1890ff;
      font-size: 15px;
    }
  }

  .tips-list {
    margin: 0;
    padding-left: 20px;

    li {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      list-style-type: disc;

      &::marker {
        color: #d9d9d9;
      }
    }
  }
}

/* 密码表单中 input-group 的后缀图标区域微调 */
.password-form-wrapper {
  ::ng-deep .ant-input-group {
    .ant-input-affix-wrapper {
      border-radius: 6px;
    }
  }
}
```

---

### 📄 `src/app/common/default/default.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultComponent } from './default.component';

describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

### 📄 `src/app/common/default/default.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// NG-ZORRO 模块
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

// 业务服务 & 模型
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { SelectOption, RoleOption } from '../../models/employee';
import { forkJoin, of } from 'rxjs';
import { PermissionService, Permission } from '../../services/permission.service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    NzDividerModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzButtonModule,
  ],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent implements OnInit {
  isCollapsed = false;
  activeMenu: string = 'home';

  // 用户信息
  userName: string = '';
  userAvatar: string = '';

  // ===================== 个人资料编辑弹框 =====================
  isProfileVisible = false;
  profileForm!: FormGroup;
  profileSubmitting = false;
  currentEmployeeId: string = '';

  modalAreaOptions: SelectOption[] = [];
  modalFactoryOptions: SelectOption[] = [];
  deptOptions: SelectOption[] = [];
  roleOptions: RoleOption[] = [];

  // ===================== ★ 修改密码弹框 =====================
  isPasswordVisible = false;
  passwordForm!: FormGroup;
  passwordSubmitting = false;

  // 密码可见性切换
  oldPwdVisible = false;
  newPwdVisible = false;
  confirmPwdVisible = false;
  // 侧边栏菜单权限控制
  showHomeMenu = true;
  showReportMenu = true;
  showPermMenu = true;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private permService: PermissionService,  // ★ 新增
  ) {
    this.initProfileForm();
    this.initPasswordForm();
  }


  ngOnInit(): void {
    this.loadUserInfo();
    this.loadMenuPermissions();  // ★ 新增
  }

  // ★ 新增方法
  private loadMenuPermissions(): void {
    this.permService.getCurrentUserPermissions().subscribe({
      next: (role) => {
        if (role) {
          this.showHomeMenu = this.permService.hasPermission(role.home_page_auth ?? 0, Permission.READ);
          this.showReportMenu = this.permService.hasPermission(role.report_page_auth ?? 0, Permission.READ);
          // ★ Task 10: 所有用户均可查看权限页面（查看自己的角色权限）
          this.showPermMenu = true;
        }
      },
      error: () => {
        console.warn('菜单权限加载失败，默认显示全部菜单');
      }
    });
  }


  // ===================== 初始化 =====================

  /** 初始化个人资料编辑表单 */
  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      employee_id: [{ value: '', disabled: true }],
      Sex: [true],
      name: ['', [Validators.required, Validators.pattern(/^[\u4e00-\u9fff\u3400-\u4dbf]+$/)]],
      name_a: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      dept_desc: [null, [Validators.required]],
      region_name: [null, [Validators.required]],
      plant_name: [null, [Validators.required]],
      role_id: [{ value: null, disabled: true }],
    });
  }

  /** 初始化修改密码表单 */
  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /** 从 localStorage 加载用户信息 */
  private loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || user.employee_id || '用户';
      this.userAvatar = this.userName.charAt(0);
      this.currentEmployeeId = user.employee_id;
    } else {
      this.userName = '用户';
      this.userAvatar = 'U';
    }
  }

  selectMenu(menuName: string) {
    this.activeMenu = menuName;
  }

  // ===================== 个人资料设置 =====================

  onProfileSettings(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.employee_id) {
      this.message.error('无法获取当前用户信息，请重新登录');
      return;
    }

    this.currentEmployeeId = user.employee_id;

    this.employeeService.getEmployeeById(user.employee_id).subscribe({
      next: (employee) => {
        const emp: any = employee;
        const areas$ = this.employeeService.getAreas();
        const factories$ = emp.region_name
          ? this.employeeService.getFactories(emp.region_name)
          : of([] as SelectOption[]);
        const depts$ = this.employeeService.getDepartments();
        const roles$ = this.employeeService.getRoles();

        forkJoin({ areas: areas$, factories: factories$, depts: depts$, roles: roles$ }).subscribe({
          next: ({ areas, factories, depts, roles }) => {
            this.modalAreaOptions = areas.filter(a => a.value !== '1');
            this.modalFactoryOptions = factories.filter(f => f.value !== '1');
            this.deptOptions = depts;
            this.roleOptions = roles;

            this.profileForm.reset();
            this.profileForm.patchValue({
              employee_id: emp.employee_id ?? '',
              name: emp.name ?? '',
              name_a: emp.name_a ?? '',
              Sex: emp.Sex ?? true,
              dept_desc: emp.dept_desc ?? null,
              region_name: emp.region_name ?? null,
              plant_name: emp.plant_name ?? null,
              role_id: emp.role_id ?? null,
            });

            Object.values(this.profileForm.controls).forEach(control => {
              control.markAsPristine();
              control.markAsUntouched();
              control.updateValueAndValidity({ onlySelf: true });
            });

            this.isProfileVisible = true;
          },
          error: () => this.message.error('加载选项数据失败')
        });
      },
      error: () => this.message.error('获取用户详情失败，请稍后重试')
    });
  }

  onProfileAreaChange(area: string): void {
    this.employeeService.getFactories(area).subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
      const current = this.profileForm.get('plant_name')?.value;
      if (current && !this.modalFactoryOptions.find(f => f.value === current)) {
        this.profileForm.patchValue({ plant_name: null });
      }
    });
  }

  handleProfileOk(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    let hasError = false;
    Object.keys(this.profileForm.controls).forEach(key => {
      const ctrl = this.profileForm.controls[key];
      if (ctrl.enabled && ctrl.invalid) {
        hasError = true;
      }
    });

    if (hasError) {
      this.message.error('请检查表单中的必填项和格式');
      return;
    }

    const formData = this.profileForm.getRawValue();
    const updateData: any = {
      name: formData.name,
      name_a: formData.name_a,
      Sex: formData.Sex,
      dept_desc: formData.dept_desc,
      region_name: formData.region_name,
      plant_name: formData.plant_name,
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    this.profileSubmitting = true;

    this.employeeService.updateEmployee(this.currentEmployeeId, updateData).subscribe({
      next: () => {
        this.message.success('个人资料修改成功！');
        this.isProfileVisible = false;
        this.profileSubmitting = false;

        const userInfo = this.authService.getCurrentUser();
        if (userInfo) {
          userInfo.name = formData.name;
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        }
        this.loadUserInfo();
      },
      error: (err) => {
        this.message.error('修改失败：' + (err.error?.error?.message || '请稍后重试'));
        this.profileSubmitting = false;
      }
    });
  }

  handleProfileCancel(): void {
    this.isProfileVisible = false;
  }

  // ===================== ★ 修改密码（核心功能） =====================

  /** 点击"修改密码" → 重置表单 → 打开弹框 */
  onChangePassword(): void {
    // 重置表单
    this.passwordForm.reset();

    // 重置密码可见性状态
    this.oldPwdVisible = false;
    this.newPwdVisible = false;
    this.confirmPwdVisible = false;

    // 清除所有校验状态
    Object.values(this.passwordForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity({ onlySelf: true });
    });

    this.isPasswordVisible = true;
  }

  /** 提交修改密码 */
  handlePasswordOk(): void {
    // 1. 标记所有字段为 dirty 以触发校验展示
    Object.values(this.passwordForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    // 2. 表单级校验
    if (this.passwordForm.invalid) {
      this.message.error('请检查表单中的必填项');
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

    // 3. 确认密码一致性校验
    if (newPassword !== confirmPassword) {
      this.message.error('两次输入的新密码不一致');
      // 手动标红确认密码框
      this.passwordForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.passwordForm.get('confirmPassword')?.markAsDirty();
      return;
    }

    // 4. 新旧密码不能相同
    if (oldPassword === newPassword) {
      this.message.warning('新密码不能与原密码相同');
      return;
    }

    // 5. 调用后端 API
    this.passwordSubmitting = true;

    this.authService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        this.message.success('密码修改成功！请牢记新密码');
        this.isPasswordVisible = false;
        this.passwordSubmitting = false;
      },
      error: (err) => {
        const msg = err.error?.error?.message || '密码修改失败，请稍后重试';
        this.message.error(msg);
        this.passwordSubmitting = false;
      }
    });
  }

  /** 取消修改密码 */
  handlePasswordCancel(): void {
    this.isPasswordVisible = false;
  }

  // ===================== 退出登录 =====================

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

---

### 📄 `src/app/guards/auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    }
    // 未登录，重定向到登录页
    return this.router.parseUrl('/login');
  }
}
```

---

### 📄 `src/app/icons-provider.ts`

```typescript
import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
```

---

### 📄 `src/app/interceptors/jwt.interceptor.ts`

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * 功能型 HTTP 拦截器（Angular 17 standalone 风格）
 * 1. 自动在请求头附加 Authorization: Bearer <token>
 * 2. 遇到 401 响应自动清除 token 并跳转登录页
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  // 克隆请求并附加 Authorization 头
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // token 失效 → 清除本地存储 → 跳转登录
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

---

### 📄 `src/app/models/employee.ts`

```typescript
// src/app/models/employee.model.ts
export interface Employee {
  employee_id: string;
  name?: string;
  name_a?: string;
  dept_desc?: string;
  plant_name?: string;
  region_name?: string;
  status?: string;
  hire_date?: string;
  resin_date?: string;
  checked?: boolean;
}

export interface EmployeeFilter {
  startDate?: Date | null;
  endDate?: Date | null;
  area?: string;
  factory?: string;
  searchText?: string;
  skip?: number;
  limit?: number;
}

export interface EmployeeResponse {
  data: Employee[];
  total: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
export interface RoleOption {
  label: string;
  value: number;
}
```

---

### 📄 `src/app/models/role.ts`

```typescript
/** 角色详情接口 */
export interface RoleDetail {
  role_id: number;
  role_name: string;
  description?: string;
  home_page_auth: number;
  report_page_auth: number;
  auth_page_auth: number;
  is_super_admin?: boolean;   // ★ Task 8 新增
  created_at?: string;
  updated_at?: string;
}

/** 页面权限字段类型 */
export type PageAuthField = 'home_page_auth' | 'report_page_auth' | 'auth_page_auth';

/** 页面权限表格行（用于 UI 渲染） */
export interface PagePermRow {
  label: string;
  field: PageAuthField;
  read: boolean;
  create: boolean;
  delete: boolean;
  update: boolean;
}
```

---

### 📄 `src/app/pages/login/login.component.html`

```html
<div class="login-container">
  <nz-card nzTitle="系统登录" class="login-card">
    <form nz-form [formGroup]="validateForm" class="login-form" (ngSubmit)="submitForm()">

      <!-- 用户名输入框 -->
      <nz-form-item>
        <nz-form-control nzErrorTip="请输入用户名！">
          <nz-input-group nzPrefixIcon="user">
            <input type="text" nz-input formControlName="username" placeholder="请输入用户名 (admin)" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>

      <!-- 密码输入框 (增加了密码可见性切换) -->
      <nz-form-item>
        <nz-form-control nzErrorTip="请输入密码！">
          <nz-input-group nzPrefixIcon="lock">
            <input [type]="passwordVisible ? 'text' : 'password'" nz-input formControlName="password"
              placeholder="请输入密码" />
          </nz-input-group>
        </nz-form-control>
      </nz-form-item>

      <!-- 记住密码及忘记密码 -->
      <div nz-row class="login-form-margin">
        <div nz-col [nzSpan]="12">
          <label nz-checkbox formControlName="remember">
            <span>记住我</span>
          </label>
        </div>
        <div nz-col [nzSpan]="12" class="text-right">
          <a class="login-form-forgot" (click)="onForgotPassword()">忘记密码？</a>
        </div>
      </div>

      <!-- 登录按钮 -->
      <button nz-button class="login-form-button login-form-margin" nzType="primary" [nzLoading]="isLoading">
        登 录
      </button>
    </form>
  </nz-card>
</div>

<!-- ===================== 忘记密码对话框 ===================== -->
<nz-modal [(nzVisible)]="forgotPwdVisible" [nzTitle]="forgotPwdTitleTpl" [nzFooter]="forgotPwdFooterTpl" [nzWidth]="460"
  [nzMaskClosable]="false" [nzClosable]="true" (nzOnCancel)="handleForgotPwdCancel()">

  <!-- 标题 -->
  <ng-template #forgotPwdTitleTpl>
    <div class="custom-modal-title">
      <span nz-icon nzType="lock" nzTheme="outline" style="margin-right: 8px;"></span>
      忘记密码
    </div>
  </ng-template>

  <!-- 内容区 -->
  <ng-container *nzModalContent>
    <div class="modal-form-wrapper password-form-wrapper">
      <form nz-form [formGroup]="forgotPwdForm" nzLayout="horizontal">

        <!-- 用户名（工号） -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>工号</nz-form-label>
          <nz-form-control [nzSpan]="15" nzErrorTip="请输入工号">
            <nz-input-group nzPrefixIcon="user">
              <input nz-input formControlName="username" placeholder="请输入工号" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

        <!-- 新密码 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>新密码</nz-form-label>
          <nz-form-control [nzSpan]="15" [nzErrorTip]="forgotNewPwdErrorTpl">
            <nz-input-group [nzSuffix]="forgotNewPwdSuffix">
              <input nz-input [type]="forgotNewPwdVisible ? 'text' : 'password'" formControlName="newPassword"
                placeholder="请输入新密码（至少6位）" autocomplete="new-password" />
            </nz-input-group>
            <ng-template #forgotNewPwdSuffix>
              <span nz-icon [nzType]="forgotNewPwdVisible ? 'eye' : 'eye-invisible'"
                (click)="forgotNewPwdVisible = !forgotNewPwdVisible" class="password-toggle-icon">
              </span>
            </ng-template>
            <ng-template #forgotNewPwdErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">请输入新密码</ng-container>
              <ng-container *ngIf="control.hasError('minlength')">密码长度不能少于6位</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <!-- 确认新密码 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzRequired>确认密码</nz-form-label>
          <nz-form-control [nzSpan]="15" [nzErrorTip]="forgotConfirmPwdErrorTpl">
            <nz-input-group [nzSuffix]="forgotConfirmPwdSuffix">
              <input nz-input [type]="forgotConfirmPwdVisible ? 'text' : 'password'" formControlName="confirmPassword"
                placeholder="请再次输入新密码" autocomplete="new-password" />
            </nz-input-group>
            <ng-template #forgotConfirmPwdSuffix>
              <span nz-icon [nzType]="forgotConfirmPwdVisible ? 'eye' : 'eye-invisible'"
                (click)="forgotConfirmPwdVisible = !forgotConfirmPwdVisible" class="password-toggle-icon">
              </span>
            </ng-template>
            <ng-template #forgotConfirmPwdErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">请再次输入新密码</ng-container>
              <ng-container *ngIf="control.hasError('mismatch')">两次输入的密码不一致</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

      </form>

      <!-- 密码安全提示 -->
      <div class="password-tips">
        <div class="tips-title">
          <span nz-icon nzType="safety-certificate" nzTheme="outline"></span>
          密码安全要求
        </div>
        <ul class="tips-list">
          <li>密码长度至少 6 个字符</li>
          <li>建议使用字母、数字和符号的组合</li>
        </ul>
      </div>
    </div>
  </ng-container>

  <!-- 底部按钮 -->
  <ng-template #forgotPwdFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handleForgotPwdOk()" [nzLoading]="forgotPwdSubmitting">
        确认重置
      </button>
      <button nz-button nzType="default" (click)="handleForgotPwdCancel()">取消</button>
    </div>
  </ng-template>
</nz-modal>
```

---

### 📄 `src/app/pages/login/login.component.scss`

```scss
/* 让整个登录区域撑满屏幕并居中 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

/* 卡片样式，限制最大宽度 */
.login-card {
  width: 100%;
  max-width: 380px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-form {
  margin-top: 10px;
}

.login-form-margin {
  margin-bottom: 24px;
}

/* 忘记密码靠右对齐 */
.text-right {
  text-align: right;
}

.login-form-forgot {
  cursor: pointer;
}

/* 登录按钮撑满整行 */
.login-form-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 密码可见性切换图标 */
.password-toggle-icon {
  cursor: pointer;
  color: #888;
}

.password-toggle-icon:hover {
  color: #1890ff;
}

/* 弹框通用样式 */
.custom-modal-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.modal-form-wrapper {
  padding: 0 8px;
}

.password-form-wrapper .ant-input-affix-wrapper {
  border-radius: 6px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 密码安全提示 */
.password-tips {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f6f8fa;
  border: 1px solid #e8eaed;
  border-radius: 6px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 13px;
  line-height: 2;
}
```

---

### 📄 `src/app/pages/login/login.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

### 📄 `src/app/pages/login/login.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzCheckboxModule,
    NzGridModule,
    NzCardModule,
    NzModalModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false;
  isLoading = false;

  // ===================== 忘记密码 =====================
  forgotPwdVisible = false;
  forgotPwdForm!: FormGroup;
  forgotPwdSubmitting = false;
  forgotNewPwdVisible = false;
  forgotConfirmPwdVisible = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    // 如果已登录，直接跳转
    if (this.authService.isTokenValid()) {
      this.router.navigate(['/default/welcome']);
      return;
    }

    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true],
    });

    this.forgotPwdForm = this.fb.group({
      username: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const { username, password } = this.validateForm.value;

      this.authService.login({ username, password }).subscribe({
        next: () => {
          this.isLoading = false;
          this.message.success('登录成功');
          this.router.navigate(['/default/welcome']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('登录失败：', err);
          const msg = err.error?.error?.message || '用户名或密码错误';
          this.message.error(msg);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // ===================== 忘记密码 =====================

  /** 点击"忘记密码？" → 重置表单 → 打开弹框 */
  onForgotPassword(): void {
    this.forgotPwdForm.reset();
    this.forgotNewPwdVisible = false;
    this.forgotConfirmPwdVisible = false;
    Object.values(this.forgotPwdForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity({ onlySelf: true });
    });
    this.forgotPwdVisible = true;
  }

  /** 提交忘记密码 */
  handleForgotPwdOk(): void {
    // 标记所有字段为 dirty 以触发校验展示
    Object.values(this.forgotPwdForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });

    if (this.forgotPwdForm.invalid) {
      this.message.error('请检查表单中的必填项');
      return;
    }

    const { username, newPassword, confirmPassword } = this.forgotPwdForm.value;

    if (newPassword !== confirmPassword) {
      this.message.error('两次输入的新密码不一致');
      this.forgotPwdForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.forgotPwdForm.get('confirmPassword')?.markAsDirty();
      return;
    }

    this.forgotPwdSubmitting = true;

    this.authService.forgotPassword({ username, newPassword }).subscribe({
      next: () => {
        this.message.success('密码重置成功！请牢记新密码');
        this.forgotPwdVisible = false;
        this.forgotPwdSubmitting = false;
      },
      error: (err) => {
        const msg = err.error?.error?.message || '密码重置失败，请稍后重试';
        this.message.error(msg);
        this.forgotPwdSubmitting = false;
      }
    });
  }

  /** 取消忘记密码 */
  handleForgotPwdCancel(): void {
    this.forgotPwdVisible = false;
  }
}
```

---

### 📄 `src/app/pages/permissions/permissions.component.html`

```html
<div class="permissions-container">

  <!-- 权限加载中 -->
  <div *ngIf="!permLoaded" class="loading-state">
    <span nz-icon nzType="loading" nzTheme="outline" style="font-size: 24px;"></span>
    <p>加载中...</p>
  </div>

  <!-- ★ 主体内容 -->
  <ng-container *ngIf="permLoaded && canRead">

    <nz-alert *ngIf="!isSuperAdmin" nzType="info" nzMessage="您只能查看自己的角色权限，如需修改请联系超级管理员" nzShowIcon [nzCloseable]="false"
      style="margin-bottom: 16px;">
    </nz-alert>

    <!-- ★ Task 9: 工具栏仅超级管理员可见 -->
    <ng-container *ngIf="isSuperAdmin">
      <div class="toolbar">
        <div class="toolbar-left">
          <label class="toolbar-label">当前角色：</label>
          <nz-select [(ngModel)]="selectedRoleId" (ngModelChange)="onRoleChange($event)" style="width: 200px;"
            nzPlaceHolder="请选择角色" nzShowSearch>
            <nz-option *ngFor="let role of roleList" [nzValue]="role.role_id" [nzLabel]="role.role_name">
            </nz-option>
          </nz-select>
        </div>
        <div class="toolbar-right">
          <button nz-button nzType="primary" (click)="onAddRole()" [disabled]="!canCreate" nz-tooltip
            [nzTooltipTitle]="!canCreate ? '无新增权限' : ''">
            <span nz-icon nzType="plus"></span>新增角色
          </button>
          <button nz-button nzType="default" nzDanger (click)="onDeleteRole()" [disabled]="!canDelete || !selectedRole"
            nz-tooltip [nzTooltipTitle]="!canDelete ? '无删除权限' : ''">
            <span nz-icon nzType="delete"></span>删除角色
          </button>
        </div>
      </div>
      <nz-divider></nz-divider>
    </ng-container>

    <!-- ★ Task 9: 角色权限配置卡片 — 标题和保存按钮根据身份切换 -->
    <nz-card [nzTitle]="isSuperAdmin ? '角色权限配置' : '我的角色权限'" [nzExtra]="isSuperAdmin ? extraTpl : undefined"
      *ngIf="selectedRole">

      <!-- 角色基本信息 -->
      <div class="role-info">
        <div class="info-row">
          <label>角色名称：</label>
          <ng-container *ngIf="isSuperAdmin">
            <input nz-input [(ngModel)]="editRoleName" style="width: 200px;" />
          </ng-container>
          <ng-container *ngIf="!isSuperAdmin">
            <span style="font-weight: 500;">{{ editRoleName }}</span>
          </ng-container>
        </div>
        <div class="info-row">
          <label>角色描述：</label>
          <ng-container *ngIf="isSuperAdmin">
            <input nz-input [(ngModel)]="editDescription" style="width: 300px;" placeholder="选填，描述该角色用途" />
          </ng-container>
          <ng-container *ngIf="!isSuperAdmin">
            <span>{{ editDescription || '暂无描述' }}</span>
          </ng-container>
        </div>
      </div>

      <!-- 权限配置表格 -->
      <nz-table #permTable [nzData]="pagePermissions" [nzFrontPagination]="false" nzBordered nzSize="middle"
        [nzShowPagination]="false">
        <thead>
          <tr>
            <th nzWidth="200px">页面</th>
            <th nzWidth="120px" nzAlign="center">查看 (R)</th>
            <th nzWidth="120px" nzAlign="center">新增 (C)</th>
            <th nzWidth="120px" nzAlign="center">删除 (D)</th>
            <th nzWidth="120px" nzAlign="center">修改 (U)</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of permTable.data">
            <td><strong>{{ row.label }}</strong></td>
            <td nzAlign="center">
              <label nz-checkbox [(ngModel)]="row.read" [nzDisabled]="!canUpdate"></label>
            </td>
            <td nzAlign="center">
              <label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.create" [nzDisabled]="!canUpdate"></label>
            </td>
            <td nzAlign="center">
              <label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.delete" [nzDisabled]="!canUpdate"></label>
            </td>
            <td nzAlign="center">
              <label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.update" [nzDisabled]="!canUpdate"></label>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- 保存按钮（卡片右上角，仅超级管理员） -->
      <ng-template #extraTpl>
        <button nz-button nzType="primary" (click)="onSaveRole()" [nzLoading]="saving">
          <span nz-icon nzType="save"></span>保存修改
        </button>
      </ng-template>
    </nz-card>

    <!-- ★ Task 9: 空状态（仅超级管理员可见） -->
    <div class="empty-state" *ngIf="!selectedRole && !loading && isSuperAdmin">
      <span nz-icon nzType="inbox" nzTheme="outline" style="font-size: 48px; color: #d9d9d9;"></span>
      <p>暂无角色数据，请先新增角色</p>
    </div>

  </ng-container>
</div>

<!-- ★ 新增角色对话框（仅超级管理员操作会触发） -->
<nz-modal [(nzVisible)]="isAddModalVisible" nzTitle="新增角色" [nzWidth]="600" [nzMaskClosable]="false"
  (nzOnCancel)="handleAddCancel()" [nzFooter]="addFooterTpl">

  <ng-container *nzModalContent>
    <form nz-form [formGroup]="addRoleForm" nzLayout="horizontal">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>角色名称</nz-form-label>
        <nz-form-control [nzSpan]="16" nzErrorTip="请输入角色名称">
          <input nz-input formControlName="role_name" placeholder="请输入角色名称" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label [nzSpan]="6">角色描述</nz-form-label>
        <nz-form-control [nzSpan]="16">
          <input nz-input formControlName="description" placeholder="可选，描述该角色的用途" />
        </nz-form-control>
      </nz-form-item>
    </form>

    <nz-table #addPermTable [nzData]="addPagePerms" [nzFrontPagination]="false" nzBordered nzSize="small"
      [nzShowPagination]="false" style="margin-top: 16px;">
      <thead>
        <tr>
          <th>页面</th>
          <th nzAlign="center">查看 (R)</th>
          <th nzAlign="center">新增 (C)</th>
          <th nzAlign="center">删除 (D)</th>
          <th nzAlign="center">修改 (U)</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of addPermTable.data">
          <td>{{ row.label }}</td>
          <td nzAlign="center"><label nz-checkbox [(ngModel)]="row.read"></label></td>
          <td nzAlign="center"><label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.create"></label></td>
          <td nzAlign="center"><label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.delete"></label></td>
          <td nzAlign="center"><label *ngIf="row.label !== '首页'" nz-checkbox [(ngModel)]="row.update"></label></td>
        </tr>
      </tbody>
    </nz-table>
  </ng-container>

  <ng-template #addFooterTpl>
    <button nz-button nzType="primary" (click)="handleAddOk()" [nzLoading]="addSubmitting">确定</button>
    <button nz-button nzType="default" (click)="handleAddCancel()">取消</button>
  </ng-template>
</nz-modal>
```

---

### 📄 `src/app/pages/permissions/permissions.component.scss`

```scss
.permissions-container {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 64px);
}

// ==================== 加载状态 ====================
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #999;

  p {
    margin-top: 12px;
    font-size: 14px;
  }
}

// ==================== 工具栏 ====================
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .toolbar-label {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      white-space: nowrap;
    }
  }

  .toolbar-right {
    display: flex;
    gap: 8px;
  }
}

// ==================== 角色信息 ====================
.role-info {
  margin-bottom: 16px;

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;

    label {
      color: #666;
      min-width: 80px;
      text-align: right;
      flex-shrink: 0;
    }
  }
}

// ==================== 空状态 ====================
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;

  p {
    margin-top: 16px;
    color: #999;
    font-size: 14px;
  }
}
```

---

### 📄 `src/app/pages/permissions/permissions.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsComponent } from './permissions.component';

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

### 📄 `src/app/pages/permissions/permissions.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { PermissionService, Permission } from '../../services/permission.service';
import { AuthService } from '../../services/auth.service';              // ★ Task 9 新增
import { RoleDetail, PageAuthField, PagePermRow } from '../../models/role';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzSelectModule, NzButtonModule, NzTableModule, NzCheckboxModule,
    NzFormModule, NzInputModule, NzIconModule, NzModalModule, NzMessageModule,
    NzCardModule, NzDividerModule, NzToolTipModule, NzTagModule, NzAlertModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {

  // ==================== 角色列表 & 选中 ====================
  roleList: RoleDetail[] = [];
  selectedRoleId: number | null = null;
  selectedRole: RoleDetail | null = null;

  // 可编辑字段
  editRoleName = '';
  editDescription = '';

  // ==================== 权限表格数据 ====================
  pagePermissions: PagePermRow[] = [];

  // ==================== 当前用户权限 ====================
  permLoaded = false;  // 权限是否加载完成
  canRead = false;
  canCreate = false;
  canDelete = false;
  canUpdate = false;

  // ★ Task 9 新增：超级管理员标记
  isSuperAdmin = false;

  // ==================== 新增角色弹框 ====================
  isAddModalVisible = false;
  addRoleForm!: FormGroup;
  addSubmitting = false;
  addPagePerms: PagePermRow[] = [];

  // ==================== 加载状态 ====================
  loading = false;
  saving = false;

  constructor(
    private permService: PermissionService,
    private authService: AuthService,   // ★ Task 9 新增
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
  ) {
    this.initAddForm();
  }

  ngOnInit(): void {
    // ★ Task 9: 根据超级管理员身份分流加载逻辑
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.loadPermissionsAndData();
  }

  // ==================== ★ Task 9: 分流加载逻辑 ====================

  private loadPermissionsAndData(): void {
    if (this.isSuperAdmin) {
      // ★ 超级管理员：拥有全部 CRUD 权限，加载所有角色
      this.canRead = true;
      this.canCreate = true;
      this.canDelete = true;
      this.canUpdate = true;
      this.permLoaded = true;
      this.loadRoles();
    } else {
      // ★ 普通用户：只能只读查看自己的角色
      this.canRead = true;
      this.canCreate = false;
      this.canDelete = false;
      this.canUpdate = false;
      this.permLoaded = true;
      this.loadMyRole();
    }
  }

  // ★ Task 9 新增：普通用户加载自己的角色
  private loadMyRole(): void {
    this.loading = true;
    this.permService.getMyRole().subscribe({
      next: (role) => {
        if (role) {
          this.roleList = [role];
          this.selectedRoleId = role.role_id ?? null;
          this.selectedRole = role;
          this.editRoleName = role.role_name || '';
          this.editDescription = role.description || '';
          this.pagePermissions = this.decodeRoleToRows(role);
        }
        this.loading = false;
      },
      error: () => {
        this.message.error('加载角色信息失败');
        this.loading = false;
      }
    });
  }

  // ==================== 初始化 ====================

  private initAddForm(): void {
    this.addRoleForm = this.fb.group({
      role_name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
    });
    this.addPagePerms = this.getDefaultPagePerms();
  }

  private getDefaultPagePerms(): PagePermRow[] {
    return [
      { label: '首页', field: 'home_page_auth', read: true, create: false, delete: false, update: false },
      { label: '报表页面', field: 'report_page_auth', read: true, create: false, delete: false, update: false },
      { label: '权限页面', field: 'auth_page_auth', read: false, create: false, delete: false, update: false },
    ];
  }

  // ==================== 加载当前用户权限 ====================

  private loadCurrentUserPermissions(): void {
    this.permService.getCurrentUserPermissions().subscribe({
      next: (role) => {
        if (role) {
          const authVal = role.auth_page_auth ?? 0;
          this.canRead = this.permService.hasPermission(authVal, Permission.READ);
          this.canCreate = this.permService.hasPermission(authVal, Permission.CREATE);
          this.canDelete = this.permService.hasPermission(authVal, Permission.DELETE);
          this.canUpdate = this.permService.hasPermission(authVal, Permission.UPDATE);
        }
        this.permLoaded = true;
        // 有查看权限才加载角色列表
        if (this.canRead) {
          this.loadRoles();
        }
      },
      error: () => {
        this.message.error('获取当前用户权限失败');
        this.permLoaded = true;
      }
    });
  }

  // ==================== 加载角色列表 ====================

  loadRoles(): void {
    this.loading = true;
    this.permService.getAllRoles().subscribe({
      next: (roles) => {
        this.roleList = roles;
        if (this.roleList.length > 0) {
          // 若之前未选中或选中的已被删除，默认选第一个
          if (this.selectedRoleId == null || !this.roleList.find(r => r.role_id === this.selectedRoleId)) {
            this.selectedRoleId = this.roleList[0].role_id;
          }
          this.onRoleChange(this.selectedRoleId!);
        } else {
          this.selectedRole = null;
          this.pagePermissions = [];
        }
        this.loading = false;
      },
      error: () => {
        this.message.error('加载角色列表失败');
        this.loading = false;
      }
    });
  }

  // ==================== 角色切换 ====================

  onRoleChange(roleId: number): void {
    this.selectedRoleId = roleId;
    const role = this.roleList.find(r => r.role_id === roleId);
    if (role) {
      this.selectedRole = role;
      this.editRoleName = role.role_name || '';
      this.editDescription = role.description || '';
      this.pagePermissions = this.decodeRoleToRows(role);
    }
  }

  /** 将角色权限数值解码为表格行 */
  private decodeRoleToRows(role: RoleDetail): PagePermRow[] {
    const pages: { label: string; field: PageAuthField }[] = [
      { label: '首页', field: 'home_page_auth' },
      { label: '报表页面', field: 'report_page_auth' },
      { label: '权限页面', field: 'auth_page_auth' },
    ];
    return pages.map(p => {
      const val: number = role[p.field] ?? 0;
      return {
        label: p.label,
        field: p.field,
        read: this.permService.hasPermission(val, Permission.READ),
        create: this.permService.hasPermission(val, Permission.CREATE),
        delete: this.permService.hasPermission(val, Permission.DELETE),
        update: this.permService.hasPermission(val, Permission.UPDATE),
      };
    });
  }

  /** 将表格行编码为权限数值 */
  encodeRowToValue(row: PagePermRow): number {
    let val = 0;
    if (row.read) val |= Permission.READ;
    if (row.create) val |= Permission.CREATE;
    if (row.delete) val |= Permission.DELETE;
    if (row.update) val |= Permission.UPDATE;
    return val;
  }

  // ==================== 保存修改 ====================

  onSaveRole(): void {
    if (!this.selectedRole) return;

    if (!this.editRoleName.trim()) {
      this.message.error('角色名称不能为空');
      return;
    }

    const updateData: Partial<RoleDetail> = {
      role_name: this.editRoleName.trim(),
      description: this.editDescription.trim() || undefined,
    };

    // 编码各页面权限值
    this.pagePermissions.forEach(row => {
      updateData[row.field] = this.encodeRowToValue(row);
    });

    this.saving = true;
    this.permService.updateRole(this.selectedRole.role_id, updateData).subscribe({
      next: () => {
        this.message.success('角色权限修改成功');
        this.saving = false;
        this.loadRoles(); // 刷新列表
      },
      error: (err) => {
        this.message.error('修改失败：' + (err.error?.error?.message || '请稍后重试'));
        this.saving = false;
      }
    });
  }

  // ==================== 新增角色 ====================

  onAddRole(): void {
    this.addRoleForm.reset();
    this.addPagePerms = this.getDefaultPagePerms();
    this.isAddModalVisible = true;
  }

  handleAddOk(): void {
    // 表单校验
    Object.values(this.addRoleForm.controls).forEach(c => {
      if (c.invalid) { c.markAsDirty(); c.updateValueAndValidity(); }
    });
    if (this.addRoleForm.invalid) {
      this.message.error('请填写角色名称');
      return;
    }

    const formVal = this.addRoleForm.value;
    const newRole: Partial<RoleDetail> = {
      role_name: formVal.role_name,
      description: formVal.description || undefined,
    };

    // 编码权限
    this.addPagePerms.forEach(row => {
      newRole[row.field] = this.encodeRowToValue(row);
    });

    this.addSubmitting = true;
    this.permService.createRole(newRole).subscribe({
      next: (created) => {
        this.message.success(`角色「${created.role_name}」创建成功`);
        this.isAddModalVisible = false;
        this.addSubmitting = false;
        this.selectedRoleId = created.role_id; // 自动切换到新角色
        this.loadRoles();
      },
      error: (err) => {
        this.message.error('创建失败：' + (err.error?.error?.message || '请稍后重试'));
        this.addSubmitting = false;
      }
    });
  }

  handleAddCancel(): void {
    this.isAddModalVisible = false;
  }

  // ==================== 删除角色 ====================

  onDeleteRole(): void {
    if (!this.selectedRole) return;

    const roleId = this.selectedRole.role_id;
    const roleName = this.selectedRole.role_name;

    // 先检查是否有员工绑定了该角色
    this.permService.getEmployeeCountByRole(roleId).subscribe({
      next: (count) => {
        if (count > 0) {
          // 有绑定员工 → 不可删除
          this.message.error(`不可删除，角色「${roleName}」下还有 ${count} 名员工绑定，请先解绑再删除`);
          return;
        }

        // 无绑定 → 二次确认
        this.modal.confirm({
          nzTitle: '确认删除角色',
          nzContent: `确定要删除角色「${roleName}」吗？此操作不可恢复。`,
          nzOkText: '确定删除',
          nzOkType: 'primary',
          nzOkDanger: true,
          nzCancelText: '取消',
          nzOnOk: () => {
            return this.permService.deleteRole(roleId).toPromise().then(
              () => {
                this.message.success(`角色「${roleName}」已删除`);
                this.selectedRoleId = null;
                this.loadRoles();
              },
              (err) => {
                this.message.error('删除失败：' + (err.error?.error?.message || '请稍后重试'));
              }
            );
          }
        });
      },
      error: () => this.message.error('查询角色绑定人数失败')
    });
  }
}
```

---

### 📄 `src/app/pages/report/report.component.html`

```html
<!-- report.component.html -->
<div class="report-container">
  <!-- 筛选区域 -->
  <div class="filter-section">
    <div class="filter-row">
      <!-- 时间范围 -->
      <!-- 时间范围 -->
      <div class="filter-item">
        <label>时间</label>
        <div class="date-range">
          <nz-date-picker [(ngModel)]="startDate" nzPlaceHolder="开始日期" [nzDisabledDate]="disabledStartDate"
            nzFormat="yyyy-MM-dd">
          </nz-date-picker>
          <span class="range-separator">至</span>
          <nz-date-picker [(ngModel)]="endDate" nzPlaceHolder="结束日期" [nzDisabledDate]="disabledEndDate"
            nzFormat="yyyy-MM-dd">
          </nz-date-picker>
        </div>
      </div>

      <!-- 地区选择 -->
      <div class="filter-item">
        <label>地区</label>
        <!-- 地区改变只需触发获取新厂别即可，不需要自动 onSearch -->
        <nz-select [(ngModel)]="selectedArea" nzShowSearch (ngModelChange)="onAreaChange($event)" style="width: 150px;">
          <nz-option *ngFor="let option of areaOptions" [nzValue]="option.value" [nzLabel]="option.label">
          </nz-option>
        </nz-select>
      </div>

      <!-- 厂别选择 -->
      <div class="filter-item">
        <label>厂别</label>
        <!-- 移除 (ngModelChange)="onSearch()" -->
        <nz-select [(ngModel)]="selectedFactory" nzShowSearch style="width: 150px;">
          <nz-option *ngFor="let option of factoryOptions" [nzValue]="option.value" [nzLabel]="option.label">
          </nz-option>
        </nz-select>
      </div>

      <!-- 搜索框 -->
      <div class="filter-item search-box">
        <nz-input-group [nzSuffix]="suffixIconSearch">
          <input type="text" nz-input [(ngModel)]="searchText" placeholder="工号、姓名、部门" (keyup.enter)="onSearch()" />
        </nz-input-group>
        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search" class="search-icon" (click)="onSearch()">
          </span>
        </ng-template>
      </div>
      <!-- 搜索与重置按钮 -->
      <div class="filter-item query-buttons">
        <button nz-button nzType="primary" (click)="onSearch()">搜索</button>
        <button nz-button nzType="default" (click)="onReset()">重置</button>
      </div>

    </div>
  </div>

  <!-- 表格区域 -->
  <div class="table-wrapper">
    <div class="table-toolbar">
      <!-- 新增：如图1所示的表格工具栏 -->
      <div class="table-actions">
        <!-- ★ 新增 *ngIf="canReportCreate" -->
        <button nz-button nzType="primary" (click)="onAdd()" *ngIf="canReportCreate">
          <span nz-icon nzType="plus"></span>新建
        </button>
        <!-- ★ 新增 *ngIf="canReportDelete" -->
        <button nz-button nzType="default" (click)="onDelete()" [disabled]="setOfCheckedId.size === 0"
          *ngIf="canReportDelete">
          <span nz-icon nzType="delete"></span>删除
        </button>
      </div>
    </div>


    <nz-table #employeeTable [nzData]="listOfData" [nzLoading]="loading" [nzTotal]="total" [nzPageSize]="pageSize"
      [nzPageIndex]="pageIndex" [nzFrontPagination]="false" (nzPageIndexChange)="onPageIndexChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)" nzShowSizeChanger [nzPageSizeOptions]="[10, 20, 50, 100]" nzBordered
      nzSize="middle">
      <thead>
        <tr>
          <th nzWidth="50px" nzAlign="center" [(nzChecked)]="checked" [nzIndeterminate]="indeterminate"
            (nzCheckedChange)="onAllChecked($event)">
          </th>
          <th nzWidth="120px">工号</th>
          <th nzWidth="100px">姓名</th>
          <th nzWidth="125px">英文姓名</th>
          <th nzWidth="80px" nzAlign="center">地区</th>
          <th nzWidth="80px" nzAlign="center">厂别</th>
          <th>部门</th>
          <th>入职时间</th>
          <th nzWidth="80px" nzAlign="center">状态</th>
          <th nzWidth="120px" nzAlign="center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of employeeTable.data">
          <td nzAlign="center" [nzChecked]="setOfCheckedId.has(data.employee_id)"
            (nzCheckedChange)="onItemChecked(data.employee_id, $event)">
          </td>
          <td>{{ data.employee_id }}</td>
          <td>{{ data.name }}</td>
          <td>{{ data.name_a }}</td>
          <td nzAlign="center">{{ data.region_name}}</td>
          <td nzAlign="center">{{ data.plant_name }}</td>
          <td>{{ data.dept_desc }}</td>
          <td>{{ data.hire_date | date:'yyyy-MM-dd' }}</td>
          <td nzAlign="center">
            <nz-tag [nzColor]="data.status ? 'green' : 'default'">
              {{ data.status ? '在职' : '离职' }}
            </nz-tag>

          </td>
          <td nzAlign="center">
            <a (click)="onView(data)" class="action-link">查看</a>
            <!-- ★ 新增 *ngIf="canReportUpdate" -->
            <ng-container *ngIf="canReportUpdate">
              <nz-divider nzType="vertical"></nz-divider>
              <a (click)="onEdit(data)" class="action-link">编辑</a>
            </ng-container>
          </td>
        </tr>
      </tbody>
    </nz-table>
  </div>
</div>

<!-- ===================== ★ 新增员工对话框 ★ ===================== -->
<nz-modal [(nzVisible)]="isModalVisible" [nzTitle]="modalTitleTpl" [nzFooter]="modalFooterTpl" [nzWidth]="520"
  [nzMaskClosable]="false" [nzClosable]="true" (nzOnCancel)="handleModalCancel()">

  <!-- 标题 -->
  <ng-template #modalTitleTpl>
    <div class="custom-modal-title">{{ modalTitle }}</div>
  </ng-template>

  <!-- 内容区 -->
  <ng-container *nzModalContent>
    <div class="modal-form-wrapper">
      <form nz-form [formGroup]="employeeForm" nzLayout="horizontal">

        <!-- 工号 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>工号</nz-form-label>
          <nz-form-control [nzSpan]="16" [nzErrorTip]="employeeIdErrorTpl">
            <input nz-input formControlName="employee_id" placeholder="请输入工号" />
            <ng-template #employeeIdErrorTpl>
              <ng-container *ngIf="employeeForm.get('employee_id')?.hasError('required')">请输入工号</ng-container>
              <ng-container
                *ngIf="employeeForm.get('employee_id')?.hasError('pattern')">工号格式不正确，应为大写字母和数字</ng-container>
              <ng-container *ngIf="employeeForm.get('employee_id')?.hasError('employeeExists')">工号已存在</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <!-- 性别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>性别</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-radio-group formControlName="Sex">
              <label nz-radio [nzValue]="true">男</label>
              <label nz-radio [nzValue]="false">女</label>
            </nz-radio-group>
          </nz-form-control>
        </nz-form-item>

        <!-- 姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确姓名(简体中文或者繁体中文)">
            <input nz-input formControlName="name" placeholder="单行输入" />
          </nz-form-control>
        </nz-form-item>

        <!-- 英文姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>英文姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确英文名(大小写字母)">
            <input nz-input formControlName="name_a" placeholder="单行输入" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>部门</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择部门">
            <nz-select formControlName="dept_desc" nzPlaceHolder="请选择部门" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of deptOptions" [nzLabel]="opt.label" [nzValue]="opt.value">
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <!-- 地区 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>地区</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择地区">
            <nz-select formControlName="region_name" nzPlaceHolder="请选择地区" nzShowSearch nzAllowClear
              (ngModelChange)="onModalAreaChange($event)">
              <nz-option *ngFor="let opt of modalAreaOptions" [nzLabel]="opt.label" [nzValue]="opt.value">
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 厂别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>厂别</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择厂别">
            <nz-select formControlName="plant_name" nzPlaceHolder="请选择厂别" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of modalFactoryOptions" [nzLabel]="opt.label" [nzValue]="opt.value">
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>角色</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择角色">
            <nz-select formControlName="role_id" nzPlaceHolder="请选择角色" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of roleOptions" [nzLabel]="opt.label" [nzValue]="opt.value">
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

      </form>

      <!-- ★ 批量分页导航（美化版） -->
      <div class="batch-nav-bar" *ngIf="!isEditMode">

        <div class="batch-pagination">
          <!-- 上一页 -->
          <button class="page-btn nav-btn" [disabled]="currentBatchIndex === 0" (click)="onPrevEmployee()">
            <span nz-icon nzType="left" nzTheme="outline"></span>
            上一页
          </button>

          <!-- 页码按钮 -->
          <ng-container *ngFor="let page of getVisiblePages()">
            <span class="page-ellipsis" *ngIf="page === '...'">···</span>
            <button class="page-btn num-btn" *ngIf="page !== '...'" [class.active]="page === currentBatchIndex + 1"
              (click)="goToPage(page)">
              {{ page }}
            </button>
          </ng-container>

          <!-- 下一页 -->
          <button class="page-btn nav-btn" (click)="onNextEmployee()">
            下一页
            <span nz-icon nzType="right" nzTheme="outline"></span>
          </button>
        </div>

        <!-- 删除本条 -->
        <div class="batch-delete" *ngIf="batchEmployees.length > 1">
          <a class="delete-link" (click)="onDeleteCurrentEmployee()">
            <span nz-icon nzType="delete" nzTheme="outline"></span> 删除本条
          </a>
        </div>
      </div>

    </div>
  </ng-container>

  <!-- 底部按钮 -->
  <ng-template #modalFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handleModalOk()" [nzLoading]="submitting">确定</button>
      <button nz-button nzType="default" (click)="handleModalCancel()">取消</button>
    </div>
  </ng-template>
</nz-modal>

<!-- ===================== 查看员工对话框（只读表单 ===================== -->
<nz-modal [(nzVisible)]="isViewVisible" [nzTitle]="viewTitleTpl" [nzFooter]="viewFooterTpl" [nzWidth]="520"
  [nzMaskClosable]="true" [nzClosable]="true" (nzOnCancel)="handleViewCancel()">

  <!-- 标题 -->
  <ng-template #viewTitleTpl>
    <div class="custom-modal-title">员工详情</div>
  </ng-template>

  <!-- 内容区：只读表单 -->
  <ng-container *nzModalContent>
    <div class="modal-form-wrapper">
      <form nz-form [formGroup]="viewForm" nzLayout="horizontal">

        <!-- 工号 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">工号</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="employee_id" readonly />
          </nz-form-control>
        </nz-form-item>

        <!-- 性别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">性别</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-radio-group formControlName="Sex">
              <label nz-radio [nzValue]="true">男</label>
              <label nz-radio [nzValue]="false">女</label>
            </nz-radio-group>
          </nz-form-control>
        </nz-form-item>

        <!-- 姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">姓名</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="name" readonly />
          </nz-form-control>
        </nz-form-item>

        <!-- 英文姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">英文姓名</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="name_a" readonly />
          </nz-form-control>
        </nz-form-item>

        <!-- 部门 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">部门</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="dept_desc" nzPlaceHolder="-">
              <nz-option *ngFor="let opt of deptOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 地区 -->
        <!-- <nz-form-item>
          <nz-form-label [nzSpan]="6">地区</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="region_name" nzPlaceHolder="-">
              <nz-option *ngFor="let opt of modalAreaOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item> -->

        <!-- 厂别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">厂别</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="plant_name" nzPlaceHolder="-">
              <nz-option *ngFor="let opt of modalFactoryOptions" [nzLabel]="opt.label"
                [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 角色 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">角色</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="role_id" nzPlaceHolder="-">
              <nz-option *ngFor="let opt of roleOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 状态 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">状态</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-switch formControlName="status" nzCheckedChildren="在职" nzUnCheckedChildren="离职"></nz-switch>
          </nz-form-control>
        </nz-form-item>

      </form>
    </div>
  </ng-container>

  <!-- 底部按钮 -->
  <ng-template #viewFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handleViewCancel()">关闭</button>
    </div>
  </ng-template>
</nz-modal>

<!-- ===================== ★ 新增 / 编辑 员工对话框 ★ ===================== -->
<nz-modal [(nzVisible)]="isModalVisible" [nzTitle]="modalTitleTpl" [nzFooter]="modalFooterTpl" [nzWidth]="520"
  [nzMaskClosable]="false" [nzClosable]="true" (nzOnCancel)="handleModalCancel()">

  <!-- 标题 -->
  <ng-template #modalTitleTpl>
    <div class="custom-modal-title">{{ modalTitle }}</div>
  </ng-template>

  <!-- 内容区 -->
  <ng-container *nzModalContent>
    <div class="modal-form-wrapper">
      <form nz-form [formGroup]="employeeForm" nzLayout="horizontal">

        <!-- 工号 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>工号</nz-form-label>
          <nz-form-control [nzSpan]="16" [nzErrorTip]="employeeIdErrorTpl">
            <input nz-input formControlName="employee_id" placeholder="请输入工号" [readonly]="isEditMode" />
            <ng-template #employeeIdErrorTpl>
              <ng-container *ngIf="employeeForm.get('employee_id')?.hasError('required')">请输入工号</ng-container>
              <ng-container
                *ngIf="employeeForm.get('employee_id')?.hasError('pattern')">工号格式不正确，应为大写字母和数字</ng-container>
              <ng-container *ngIf="employeeForm.get('employee_id')?.hasError('employeeExists')">工号已存在</ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <!-- 性别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>性别</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-radio-group formControlName="Sex">
              <label nz-radio [nzValue]="true">男</label>
              <label nz-radio [nzValue]="false">女</label>
            </nz-radio-group>
          </nz-form-control>
        </nz-form-item>

        <!-- 姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确姓名(简体中文或者繁体中文)">
            <input nz-input formControlName="name" placeholder="单行输入" />
          </nz-form-control>
        </nz-form-item>

        <!-- 英文姓名 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>英文姓名</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请输入正确英文名(大小写字母)">
            <input nz-input formControlName="name_a" placeholder="单行输入" />
          </nz-form-control>
        </nz-form-item>

        <!-- 部门 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>部门</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择部门">
            <nz-select formControlName="dept_desc" nzPlaceHolder="请选择部门" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of deptOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 地区 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>地区</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择地区">
            <nz-select formControlName="region_name" nzPlaceHolder="请选择地区" nzShowSearch nzAllowClear
              (ngModelChange)="onModalAreaChange($event)">
              <nz-option *ngFor="let opt of modalAreaOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 厂别 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>厂别</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择厂别">
            <nz-select formControlName="plant_name" nzPlaceHolder="请选择厂别" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of modalFactoryOptions" [nzLabel]="opt.label"
                [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 角色 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>角色</nz-form-label>
          <nz-form-control [nzSpan]="16" nzErrorTip="请选择角色">
            <nz-select formControlName="role_id" nzPlaceHolder="请选择角色" nzShowSearch nzAllowClear>
              <nz-option *ngFor="let opt of roleOptions" [nzLabel]="opt.label" [nzValue]="opt.value"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>

      <!-- ★ 批量分页导航（仅新增模式显示） -->
      <div class="batch-nav-bar" *ngIf="!isEditMode">

        <div class="batch-pagination">
          <!-- 上一页 -->
          <button class="page-btn nav-btn" [disabled]="currentBatchIndex === 0" (click)="onPrevEmployee()">
            <span nz-icon nzType="left" nzTheme="outline"></span>
            上一页
          </button>

          <!-- 页码按钮 -->
          <ng-container *ngFor="let page of getVisiblePages()">
            <span class="page-ellipsis" *ngIf="page === '...'">···</span>
            <button class="page-btn num-btn" *ngIf="page !== '...'" [class.active]="page === currentBatchIndex + 1"
              (click)="goToPage(page)">
              {{ page }}
            </button>
          </ng-container>

          <!-- 下一页 -->
          <button class="page-btn nav-btn" (click)="onNextEmployee()">
            下一页
            <span nz-icon nzType="right" nzTheme="outline"></span>
          </button>
        </div>

        <!-- 删除本条 -->
        <div class="batch-delete" *ngIf="batchEmployees.length > 1">
          <a class="delete-link" (click)="onDeleteCurrentEmployee()">
            <span nz-icon nzType="delete" nzTheme="outline"></span> 删除本条
          </a>
        </div>
      </div>

    </div>
  </ng-container>

  <!-- 底部按钮 -->
  <ng-template #modalFooterTpl>
    <div class="modal-footer">
      <button nz-button nzType="primary" (click)="handleModalOk()" [nzLoading]="submitting">
        {{ isEditMode ? '保存' : '确定' }}
      </button>
      <button nz-button nzType="default" (click)="handleModalCancel()">取消</button>
    </div>
  </ng-template>
</nz-modal>
```

---

### 📄 `src/app/pages/report/report.component.scss`

```scss
.filter-section {
  background-color: #ffffff;
  /* 还原图2的浅灰背景色 */
  padding: 16px;
  border-bottom: 1px solid #ffffff;

  .filter-row {
    display: flex;
    align-items: flex-end;
    /* 让底部输入框保持在同一水平线 */
    flex-wrap: nowrap;
    /* 强制要求：所有输入控件都在同一行，不换行 */
    gap: 24px;
    /* 各个控件组之间的左右间距 */
    position: relative;
    /* 关键：为右侧按钮的绝对定位提供参照系 */
    // padding-right: 15px;
    /* 右侧留出空白，防止屏幕变窄时输入框被按钮遮挡 */

    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      /* 调小间距：缩小 Label 和下方输入控件的上下间距 */

      label {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1;
        height: 14px;
      }

      /* 1. 满足要求：时间框长度调长 */
      .date-range {
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        padding: 0px;
        width: 320px;
        /* 整体宽度调长 */

        /* 隐藏内部 date-picker 的自带边框，融为一体 */
        nz-date-picker {
          flex: 1;

          /* 让两个时间框平分 320px 的宽度 */
          ::ng-deep .ant-picker {
            border: none !important;
            box-shadow: none !important;
            background: transparent;
            width: 100%;
            padding: 4px 0;
          }
        }

        .range-separator {
          color: #333;
          padding: 0 12px;
          font-weight: 500;
        }
      }

      &.search-box {
        width: 300px;
        /* 搜索框宽度 */
      }

      /* 搜索与重置按钮容器 */
      &.query-buttons {
        flex-direction: row;
        /* 按钮横向排列 */
        gap: 8px;
      }

    }
  }
}

/* 表格与工具栏区域 */
.table-wrapper {
  background: #fff;
  border-radius: 4px;
  /* 为整个表格区域添加一个浅色外边框，让整体更像一个卡片 */
  border: 1px solid #f0f0f0;

  /* 核心：工具栏样式 */
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    /* 标题居左，按钮居右 */
    align-items: center;
    padding: 16px 20px;

    /* 工具栏下方的下划线 */
    border-bottom: 1px solid #e8e8e8;

    .table-title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }

    .table-actions {
      display: flex;
      gap: 12px;
      /* 按钮之间的间距 */
      align-items: center;
    }
  }

  /* 样式优化：去除自带表格顶部的边框，防止与刚刚加的下划线重叠造成双线 */
  ::ng-deep .ant-table-bordered .ant-table-container {
    border-top: none;
  }
}

/* ========== 批量分页导航（美化版） ========== */
.batch-nav-bar {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.batch-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

/* 通用页码按钮 */
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #595959;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover:not(:disabled):not(.active) {
    color: #1890ff;
    border-color: #1890ff;
    background: #f0f7ff;
  }

  &:active:not(:disabled):not(.active) {
    transform: scale(0.96);
  }

  &:disabled {
    color: #bfbfbf;
    background: #f5f5f5;
    border-color: #d9d9d9;
    cursor: not-allowed;
    box-shadow: none;
  }
}

/* 页码数字按钮 */
.num-btn {
  padding: 0;
  font-weight: 500;

  &.active {
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.35);
    cursor: default;
  }
}

/* 上一页 / 下一页 */
.nav-btn {
  gap: 4px;
  font-weight: 500;
  padding: 0 14px;
  background: #fafafa;
}

/* 省略号 */
.page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #bfbfbf;
  font-size: 16px;
  letter-spacing: 2px;
  cursor: default;
}

/* 删除本条 */
.batch-delete {
  .delete-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #ff4d4f;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: #fff1f0;
      color: #cf1322;
    }
  }
}

/* ===================== 只读表单样式 ===================== */
.modal-form-wrapper {

  /* 禁用状态的 input 框：白底黑字，去除禁用鼠标样式 */
  input[readonly],
  input:disabled,
  .ant-input-disabled,
  .ant-input[disabled] {
    color: rgba(0, 0, 0, 0.85) !important;
    background-color: #fafafa !important;
    cursor: default !important;
    border-color: #d9d9d9 !important;
  }

  /* 禁用状态的 select */
  .ant-select-disabled {
    .ant-select-selector {
      color: rgba(0, 0, 0, 0.85) !important;
      background-color: #fafafa !important;
      cursor: default !important;
    }

    .ant-select-arrow {
      display: none; // 隐藏下拉箭头，强调不可操作
    }
  }

  /* 禁用状态的 radio */
  .ant-radio-disabled+span,
  .ant-radio-wrapper-disabled {
    color: rgba(0, 0, 0, 0.85) !important;
    cursor: default !important;
  }

  /* 禁用状态的 switch */
  .ant-switch-disabled {
    opacity: 0.8 !important;
    cursor: default !important;
  }

  /* 禁用状态的 date-picker */
  .ant-picker-disabled {
    color: rgba(0, 0, 0, 0.85) !important;
    background-color: #fafafa !important;
    cursor: default !important;

    .ant-picker-suffix {
      display: none;
    }
  }
}
```

---

### 📄 `src/app/pages/report/report.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

### 📄 `src/app/pages/report/report.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeFilter, SelectOption, RoleOption } from '../../models/employee';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PermissionService, Permission } from '../../services/permission.service';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzMessageModule,
    NzModalModule,
    NzDividerModule,
    NzTagModule,
    NzFormModule,
    NzSwitchModule,
    NzRadioModule
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  // ===================== 筛选条件 =====================
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedArea: string = '1';
  selectedFactory: string = '1';
  searchText: string = '';

  // ===================== 分页 =====================
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // ===================== 表格数据 =====================
  listOfData: Employee[] = [];
  loading = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  // ===================== 筛选栏下拉选项（含"全部"） =====================
  areaOptions: SelectOption[] = [{ label: '全部', value: '1' }];
  factoryOptions: SelectOption[] = [{ label: '全部', value: '1' }];

  // ===================== 对话框 =====================
  isModalVisible = false;
  isEditMode = false;
  modalTitle = '新增';
  employeeForm!: FormGroup;
  submitting = false;
  currentEmployeeId: string = '';

  viewForm!: FormGroup;
  isViewVisible = false;
  viewEmployee: any = {};
  viewSexText = '';
  viewRoleLabel = '';
  // ===================== 对话框下拉选项（不含"全部"） =====================
  modalAreaOptions: SelectOption[] = [];
  modalFactoryOptions: SelectOption[] = [];
  deptOptions: SelectOption[] = [];
  roleOptions: RoleOption[] = [];
  // ===================== 批量新增 =====================
  batchEmployees: any[] = [];
  currentBatchIndex: number = 0;
  // ★ 报表页按钮权限
  canReportCreate = true;
  canReportDelete = true;
  canReportUpdate = true;
  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private permService: PermissionService,
  ) {
    this.initForm();
    this.initViewForm(); // ← 新增
  }

  ngOnInit(): void {
    this.loadAreas();
    this.loadFactories();
    this.loadDepartments();
    this.loadRoles();
    this.loadData();
    this.loadReportPermissions();  // ★ 新增
  }

  // ★ 新增方法
  private loadReportPermissions(): void {
    this.permService.getCurrentUserPermissions().subscribe({
      next: (role) => {
        if (role) {
          const val = role.report_page_auth ?? 0;
          this.canReportCreate = this.permService.hasPermission(val, Permission.CREATE);
          this.canReportDelete = this.permService.hasPermission(val, Permission.DELETE);
          this.canReportUpdate = this.permService.hasPermission(val, Permission.UPDATE);
        }
      }
    });
  }

  // ===================== 表单初始化 =====================

  private initForm(): void {
    this.employeeForm = this.fb.group({
      employee_id: ['', {
        validators: [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)],
        asyncValidators: [this.employeeIdExistsValidator()],
        updateOn: 'blur'
      }],
      password: ['123456'],
      name: ['', [Validators.required, Validators.pattern(/^[\u4e00-\u9fff\u3400-\u4dbf]+$/)]],
      name_a: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      Sex: [true],
      dept_desc: [null, [Validators.required]],
      region_name: [null, [Validators.required]],
      plant_name: [null, [Validators.required]],
      role_id: [null, [Validators.required]],
      hire_date: [new Date()],
      resin_date: [null],
      status: [true],
      hasaccess: [true]
    });
  }
  /** 初始化只读表单（所有控件默认禁用） */
  private initViewForm(): void {
    this.viewForm = this.fb.group({
      employee_id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      name_a: [{ value: '', disabled: true }],
      Sex: [{ value: true, disabled: true }],
      dept_desc: [{ value: null, disabled: true }],
      region_name: [{ value: null, disabled: true }],
      plant_name: [{ value: null, disabled: true }],
      role_id: [{ value: null, disabled: true }],
      status: [{ value: true, disabled: true }],
    });
  }

  /** 异步校验器：检测工号是否已存在（在 blur 时触发） */
  private employeeIdExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const val = control.value;
      if (!val) return of(null);
      // 在编辑模式且未更改工号时视为有效
      if (this.isEditMode && this.currentEmployeeId && val === this.currentEmployeeId) {
        return of(null);
      }
      return this.employeeService.getEmployeeById(val).pipe(
        map(() => ({ employeeExists: true })),
        catchError(() => of(null))
      );
    };
  }

  private getDefaultEmployeeData(): any {
    return {
      employee_id: '',
      password: '123456',
      name: '',
      name_a: '',
      Sex: true,
      dept_desc: null,
      region_name: null,
      plant_name: null,
      role_id: null,
      hire_date: new Date(),
      resin_date: null,
      status: true,
      hasaccess: true
    };
  }

  // =====================下拉列表加载 =====================
  loadAreas(): void {
    this.employeeService.getAreas().subscribe({
      next: (areas) => { this.areaOptions = areas; },
      error: (err) => console.error('加载地区列表失败:', err)
    });
  }

  loadFactories(area?: string): void {
    this.employeeService.getFactories(area).subscribe({
      next: (factories) => { this.factoryOptions = factories; },
      error: (err) => console.error('加载厂别列表失败:', err)
    });
  }

  /**
   * ★ 加载部门列表（从 API 获取）
   */
  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (depts) => {
        this.deptOptions = depts;
        console.log('加载部门列表成功:', this.deptOptions);
      },
      error: (err) => {
        console.error('加载部门列表失败:', err);
        this.message.error('加载部门列表失败');
      }
    });
  }
  loadRoles(): void {
    this.employeeService.getRoles().subscribe({
      next: (roles) => {
        this.roleOptions = roles;
        console.log('加载角色列表成功:', this.roleOptions);
      },
      error: (err) => {
        console.error('加载角色列表失败:', err);
        this.message.error('加载角色列表失败');
      }
    });
  }

  onAreaChange(area: string): void {
    this.selectedFactory = '1';
    this.loadFactories(area);
  }

  // ===================== 数据加载 =====================

  loadData(): void {
    this.loading = true;
    const filter: EmployeeFilter = {
      startDate: this.startDate,
      endDate: this.endDate,
      area: this.selectedArea,
      factory: this.selectedFactory,
      searchText: this.searchText,
      skip: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize
    };
    // 同时请求数据页和总数，确保分页 total 正确
    forkJoin({
      page: this.employeeService.getEmployees(filter),
      total: this.employeeService.getEmployeesCount(filter)
    }).subscribe({
      next: ({ page, total }) => {
        this.listOfData = page.data;
        this.total = total ?? page.total ?? page.data.length;
        this.loading = false;
        this.refreshCheckedStatus();
      },
      error: (error) => {
        console.error('加载数据失败:', error);
        this.message.error('加载数据失败，请稍后重试');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedArea = '1';
    this.selectedFactory = '1';
    this.searchText = '';
    this.loadFactories();
    this.onSearch();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  // =====================  新增员工对话框 =====================

  onAdd(): void {
    this.isEditMode = false;
    this.modalTitle = '新增';
    this.batchEmployees = [this.getDefaultEmployeeData()];
    this.currentBatchIndex = 0;
    this.loadBatchToForm(0);
    this.loadModalOptions();
    this.isModalVisible = true;
  }

  /**
   * 加载弹框中的下拉选项（地区/厂别不含"全部"，部门/角色直接复用）
   */
  private loadModalOptions(): void {
    // 地区（不含"全部"）
    this.employeeService.getAreas().subscribe(areas => {
      this.modalAreaOptions = areas.filter(a => a.value !== '1');
    });
    // 厂别（不含"全部"）
    this.employeeService.getFactories().subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
    });
  }

  /**
   * 弹框内地区变化 → 联动更新厂别选项
   */
  onModalAreaChange(area: string, preferredPlant?: string): void {
    // 加载指定地区的厂别选项，异步完成后恢复或校验 plant_name
    this.employeeService.getFactories(area).subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
      // 如果调用时传入了首选厂别，则尝试恢复（可能是 value 或 label）
      if (preferredPlant) {
        const foundByValue = this.modalFactoryOptions.find(f => f.value === preferredPlant);
        if (foundByValue) {
          this.employeeForm.patchValue({ plant_name: foundByValue.value });
        } else {
          const foundByLabel = this.modalFactoryOptions.find(f => f.label === preferredPlant);
          if (foundByLabel) {
            this.employeeForm.patchValue({ plant_name: foundByLabel.value });
          }
        }
      } else {
        // 若当前表单中的 plant_name 不在新选项中，则清空以避免不一致
        const current = this.employeeForm.get('plant_name')?.value;
        if (current && !this.modalFactoryOptions.find(f => f.value === current || f.label === current)) {
          this.employeeForm.patchValue({ plant_name: null });
        }
      }
    });
  }

  // =====================  批量分页导航 =====================

  private saveFormToBatch(): void {
    this.batchEmployees[this.currentBatchIndex] = { ...this.employeeForm.getRawValue() };
  }

  private loadBatchToForm(index: number): void {
    const data = this.batchEmployees[index];
    this.employeeForm.reset();
    this.employeeForm.patchValue(data);
    if (data.region_name) {
      this.onModalAreaChange(data.region_name, data.plant_name);
    }
  }

  onPrevEmployee(): void {
    if (this.currentBatchIndex <= 0) return;
    this.saveFormToBatch();
    this.currentBatchIndex--;
    this.loadBatchToForm(this.currentBatchIndex);
  }

  onNextEmployee(): void {
    this.saveFormToBatch();
    if (this.currentBatchIndex < this.batchEmployees.length - 1) {
      this.currentBatchIndex++;
    } else {
      this.batchEmployees.push(this.getDefaultEmployeeData());
      this.currentBatchIndex = this.batchEmployees.length - 1;
    }
    this.loadBatchToForm(this.currentBatchIndex);
  }

  onDeleteCurrentEmployee(): void {
    if (this.batchEmployees.length <= 1) {
      this.message.warning('至少需要保留一条记录');
      return;
    }
    this.batchEmployees.splice(this.currentBatchIndex, 1);
    if (this.currentBatchIndex >= this.batchEmployees.length) {
      this.currentBatchIndex = this.batchEmployees.length - 1;
    }
    this.loadBatchToForm(this.currentBatchIndex);
    this.message.success('已删除当前记录');
  }
  /**
   * ★ 计算可见页码（含省略号），类似 Ant Design Pagination 算法
   */
  getVisiblePages(): (number | string)[] {
    const total = this.batchEmployees.length;
    const current = this.currentBatchIndex + 1;

    // 总页数 <= 7 时全部显示
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (current <= 4) {
      // 靠近开头：显示前5页 + ... + 末页
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      // 靠近末尾：首页 + ... + 后5页
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      // 居中：首页 + ... + 当前±1 + ... + 末页
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  /**
   * 跳转到指定批次页
   */
  goToPage(page: number | string): void {
    if (typeof page === 'string') return;           // 省略号不可点
    const index = (page as number) - 1;
    if (index === this.currentBatchIndex) return;    // 当前页不重复加载
    this.saveFormToBatch();
    this.currentBatchIndex = index;
    this.loadBatchToForm(index);
  }

  // =====================  提交 & 取消 =====================

  handleModalOk(): void {
    // ======================== 编辑模式 ========================
    if (this.isEditMode) {
      // 标记所有字段以触发校验展示
      this.markFormDirty();

      // 检查启用状态的字段是否有效
      const controls = this.employeeForm.controls;
      let hasError = false;
      Object.keys(controls).forEach(key => {
        const ctrl = controls[key];
        if (ctrl.enabled && ctrl.invalid) {
          hasError = true;
        }
      });

      if (hasError) {
        this.message.error('请检查表单中的必填项和格式');
        return;
      }

      // getRawValue 能获取包含 disabled 字段（employee_id）的完整数据
      const formData = this.employeeForm.getRawValue();
      const updateData: any = {
        name: formData.name,
        name_a: formData.name_a,
        Sex: formData.Sex,
        dept_desc: formData.dept_desc,
        region_name: formData.region_name,
        plant_name: formData.plant_name,
        role_id: formData.role_id,
        password: formData.password,
        hire_date: formData.hire_date ? this.formatDate(formData.hire_date) : undefined,
        resin_date: formData.resin_date ? this.formatDate(formData.resin_date) : undefined,
        status: formData.status,
        //hasaccess: formData.hasaccess
      };

      // 移除 undefined 字段，避免覆盖后端已有数据
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log('准备更新的员工数据:', this.currentEmployeeId, updateData);
      this.submitting = true;

      this.employeeService.updateEmployee(this.currentEmployeeId, updateData).subscribe({
        next: () => {
          this.message.success('员工信息修改成功！');
          this.isModalVisible = false;
          this.submitting = false;
          // 恢复工号字段可编辑
          this.employeeForm.get('employee_id')?.enable();
          this.loadData();
        },
        error: (err) => {
          this.message.error('修改失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });

      return;
    }

    // ======================== 新增模式（原有逻辑不变） ========================
    this.saveFormToBatch();

    // 逐条校验
    for (let i = 0; i < this.batchEmployees.length; i++) {
      const emp = this.batchEmployees[i];
      if (!emp.employee_id || !emp.name || !emp.dept_desc || !emp.region_name || !emp.plant_name || emp.role_id == null) {
        this.currentBatchIndex = i;
        this.loadBatchToForm(i);
        this.markFormDirty();
        this.message.error(`第 ${i + 1} 条记录信息不完整，请检查必填项`);
        return;
      }
    }

    // 格式化日期
    const employees = this.batchEmployees.map(emp => ({
      ...emp,
      hire_date: emp.hire_date ? this.formatDate(emp.hire_date) : undefined,
      resin_date: emp.resin_date ? this.formatDate(emp.resin_date) : undefined,
    }));
    console.log('准备提交的员工数据:', employees);
    this.submitting = true;

    if (employees.length === 1) {
      this.employeeService.createEmployee(employees[0]).subscribe({
        next: () => {
          this.message.success('新增员工成功！');
          this.isModalVisible = false;
          this.submitting = false;
          this.loadData();
        },
        error: (err) => {
          this.message.error('新增失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });
    } else {
      this.employeeService.createEmployees(employees).subscribe({
        next: (results) => {
          this.message.success(`成功批量新增 ${results.length} 名员工！`);
          this.isModalVisible = false;
          this.submitting = false;
          this.loadData();
        },
        error: (err) => {
          this.message.error('批量新增失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });
    }
  }


  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  private markFormDirty(): void {
    Object.values(this.employeeForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString();
  }


  // ===================== 查看 / 编辑 =====================

  onView(data: Employee): void {
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        const emp: any = employee as any;
        console.log('emp:', emp);

        // ★ 关键修复：先加载地区 & 厂别选项，再填充表单
        const areas$ = this.employeeService.getAreas();
        const factories$ = emp.region_name
          ? this.employeeService.getFactories(emp.region_name)
          : of([] as SelectOption[]);

        forkJoin({ areas: areas$, factories: factories$ }).subscribe({
          next: ({ areas, factories }) => {
            // 1. 填充下拉选项（不含"全部"）
            this.modalAreaOptions = areas.filter(a => a.value !== '1');
            this.modalFactoryOptions = factories.filter(f => f.value !== '1');

            // 2. 性别文本
            const sexVal = emp.Sex;
            this.viewSexText = (sexVal === undefined || sexVal === null)
              ? '' : (sexVal ? '男' : '女');

            // 3. 角色标签
            this.viewRoleLabel = '';
            if (emp.role_id != null) {
              const rid = typeof emp.role_id === 'number' ? emp.role_id : Number(emp.role_id);
              const found = this.roleOptions.find(r => r.value === rid);
              this.viewRoleLabel = found ? found.label : String(emp.role_id);
            }

            // 4. ★ 选项就绪后，再 patchValue
            this.viewForm.patchValue({
              employee_id: emp.employee_id ?? '',
              name: emp.name ?? '',
              name_a: emp.name_a ?? '',
              Sex: emp.Sex ?? true,
              dept_desc: emp.dept_desc ?? null,
              region_name: emp.region_name ?? null,
              plant_name: emp.plant_name ?? null,
              role_id: emp.role_id ?? null,
              status: emp.status ?? true,
              hasaccess: emp.hasaccess ?? true
            });

            this.viewEmployee = emp;
            this.isViewVisible = true;
          },
          error: () => this.message.error('加载选项数据失败')
        });
      },
      error: () => this.message.error('获取员工详情失败')
    });
  }
  handleViewCancel(): void {
    this.isViewVisible = false;
  }

  onEdit(data: Employee): void {
    this.isEditMode = true;
    this.modalTitle = '编辑';
    this.currentEmployeeId = data.employee_id;

    // 先获取最新的完整员工数据
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        const emp: any = employee as any;

        // 加载弹框下拉选项（地区 & 厂别）
        const areas$ = this.employeeService.getAreas();
        const factories$ = emp.region_name
          ? this.employeeService.getFactories(emp.region_name)
          : of([] as SelectOption[]);

        forkJoin({ areas: areas$, factories: factories$ }).subscribe({
          next: ({ areas, factories }) => {
            // 1. 填充弹框下拉选项（不含"全部"）
            this.modalAreaOptions = areas.filter(a => a.value !== '1');
            this.modalFactoryOptions = factories.filter(f => f.value !== '1');

            // 2. 重置表单并填充数据
            this.employeeForm.reset();
            this.employeeForm.patchValue({
              employee_id: emp.employee_id ?? '',
              password: emp.password ?? '123456',
              name: emp.name ?? '',
              name_a: emp.name_a ?? '',
              Sex: emp.Sex ?? true,
              dept_desc: emp.dept_desc ?? null,
              region_name: emp.region_name ?? null,
              plant_name: emp.plant_name ?? null,
              role_id: emp.role_id ?? null,
              status: emp.status ?? true,
            });

            // 3. ★ 编辑模式下禁用工号字段（不可修改主键）
            this.employeeForm.get('employee_id')?.disable();

            // 4. 清除所有校验状态（避免残留红框）
            Object.values(this.employeeForm.controls).forEach(control => {
              control.markAsPristine();
              control.markAsUntouched();
              control.updateValueAndValidity({ onlySelf: true });
            });

            // 5. 打开弹框
            this.isModalVisible = true;
          },
          error: () => this.message.error('加载选项数据失败')
        });
      },
      error: () => this.message.error('获取员工详情失败')
    });
  }


  // ===================== 删除 =====================

  onDelete(): void {
    if (this.setOfCheckedId.size === 0) {
      this.message.warning('请选择要删除的项');
      return;
    }
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除选中的 ${this.setOfCheckedId.size} 条记录吗？此操作不可恢复。`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => {
        const ids = Array.from(this.setOfCheckedId);
        console.log('准备删除的员工ID列表:', ids);
        return this.employeeService.deleteEmployees(ids).toPromise().then(
          (result) => {
            this.message.success(`成功删除 ${result?.count || ids.length} 条记录`);
            this.setOfCheckedId.clear();
            this.loadData();
          },
          () => this.message.error('删除失败，请稍后重试')
        );
      }
    });
  }

  // ===================== 勾选 =====================

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => this.updateCheckedSet(item.employee_id, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfData;
    this.checked = listOfEnabledData.length > 0 &&
      listOfEnabledData.every(item => this.setOfCheckedId.has(item.employee_id));
    this.indeterminate = listOfEnabledData.some(item =>
      this.setOfCheckedId.has(item.employee_id)
    ) && !this.checked;
  }
  // ===================== 其他工具函数 =====================
  /**
  * ★ 开始日期的禁用函数：不能晚于已选的结束日期
  */
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endDate) {
      return false;
    }
    // 开始日期不能晚于结束日期
    return startValue.getTime() > this.endDate.getTime();
  };

  /**
   * ★ 结束日期的禁用函数：不能早于已选的开始日期
   */
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startDate) {
      return false;
    }
    // 结束日期不能早于开始日期
    return endValue.getTime() < this.startDate.getTime();
  };

}
```

---

### 📄 `src/app/pages/welcome/welcome.component.html`

```html
<div class="welcome-container">
  <nz-spin [nzSpinning]="loading">

    <!-- ==================== 页面标题 ==================== -->
    <div class="page-header">
      <h2>人员分析仪表图</h2>
    </div>

    <!-- ==================== 仪表盘网格 ==================== -->
    <div class="dashboard-grid">

      <!-- ========== 1. 左侧统计卡片 ========== -->
      <div class="stats-section">
        <div class="stat-card">
          <span class="stat-label">在职人数</span>
          <span class="stat-number">{{ activeCount }}</span>
          <div class="stat-row">
            <span class="row-label">同比</span>
            <span class="row-value" [class.val-down]="yoyActive < 0" [class.val-up]="yoyActive >= 0">
              {{ yoyActive }}%
            </span>
            <span class="row-arrow" [class.val-down]="yoyActive < 0" [class.val-up]="yoyActive >= 0">
              {{ yoyActive < 0 ? '↓' : '↑' }} </span>
          </div>
          <div class="stat-row">
            <span class="row-label">环比</span>
            <span class="row-value" [class.val-down]="momActive < 0" [class.val-up]="momActive >= 0">
              {{ momActive }}%
            </span>
            <span class="row-arrow" [class.val-down]="momActive < 0" [class.val-up]="momActive >= 0">
              {{ momActive < 0 ? '↓' : '↑' }} </span>
          </div>
        </div>

        <div class="stat-card">
          <span class="stat-label">离职人数</span>
          <span class="stat-number resign-number">{{ resignCount }}</span>
          <div class="stat-row">
            <span class="row-label">同比</span>
            <span class="row-value" [class.val-down]="yoyResign < 0" [class.val-up]="yoyResign >= 0">
              {{ yoyResign }}%
            </span>
            <span class="row-arrow" [class.val-down]="yoyResign < 0" [class.val-up]="yoyResign >= 0">
              {{ yoyResign < 0 ? '↓' : '↑' }} </span>
          </div>
          <div class="stat-row">
            <span class="row-label">环比</span>
            <span class="row-value" [class.val-down]="momResign < 0" [class.val-up]="momResign >= 0">
              {{ momResign }}%
            </span>
            <span class="row-arrow" [class.val-down]="momResign < 0" [class.val-up]="momResign >= 0">
              {{ momResign < 0 ? '↓' : '↑' }} </span>
          </div>
        </div>
      </div>

      <!-- ========== 2. 中间图表区 ========== -->
      <div class="chart-section">
        <div class="filter-bar">
          <div class="filter-group">
            <label>日期</label>
            <div class="date-range-wrapper">
              <nz-date-picker [(ngModel)]="startDate" nzPlaceHolder="请选择日期" [nzDisabledDate]="disabledStartDate"
                nzFormat="yyyy-MM-dd" nzSize="small">
              </nz-date-picker>
              <nz-date-picker [(ngModel)]="endDate" nzPlaceHolder="请选择日期" [nzDisabledDate]="disabledEndDate"
                nzFormat="yyyy-MM-dd" nzSize="small">
              </nz-date-picker>
            </div>
          </div>
          <div class="filter-group">
            <label>厂区</label>
            <nz-select [(ngModel)]="selectedFactory" nzPlaceHolder="请选择厂区" nzShowSearch nzAllowClear nzSize="small"
              style="width: 120px;">
              <nz-option *ngFor="let opt of factoryOptions" [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
            </nz-select>
          </div>
          <button nz-button nzType="primary" nzSize="small" (click)="onSearch()">查询</button>
          <button nz-button nzType="default" nzSize="small" (click)="onReset()">重置</button>
        </div>
        <div #trendChartRef class="trend-chart"></div>
      </div>

      <!-- ========== 3. 右侧面板 ========== -->
      <div class="right-panel">
        <div class="ranking-block">
          <h4 class="section-title">📈 厂别人数排行</h4>
          <div class="rank-list">
            <div class="rank-item" *ngFor="let item of displayedRanking; let i = index">
              <span class="rank-badge" [style.background]="item.badgeColor">{{ i + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <div class="rank-bar-wrap">
                <div class="rank-bar" [style.width.%]="item.count / getMaxCount() * 100"
                  [style.background]="item.barColor">
                </div>
              </div>
              <span class="rank-count">{{ item.count }}</span>
            </div>
          </div>
          <div class="view-more-wrap" *ngIf="factoryRanking.length > 10">
            <a class="view-more-link" (click)="toggleShowAll()">
              {{ showAllFactories ? '收起' : '查看更多' }}
            </a>
          </div>
        </div>

        <div class="gender-block">
          <h4 class="section-title">% 性别比</h4>
          <div #genderChartRef class="gender-chart"></div>
        </div>
      </div>

      <!-- ========== 4. 地区人员分布 ========== -->
      <div class="map-section">
        <h4 class="section-title">地区人员分布</h4>
        <div #mapChartRef class="map-chart"></div>
      </div>

      <!-- ========== 5. 部门分布 ========== -->
      <div class="dept-section">
        <h4 class="section-title">部门分布</h4>
        <div #deptChartRef class="dept-chart"></div>
      </div>
    </div>

  </nz-spin>
</div>
<!-- ★ 自定义部门饼图 Tooltip 浮层（脱离所有布局容器） -->
<div class="dept-tooltip-overlay" [class.visible]="deptTooltipVisible" [style.top.px]="deptTooltipTop"
  [style.left.px]="deptTooltipLeft">
  <div class="tooltip-header">{{ deptTooltipTitle }}</div>
  <div class="tooltip-body">
    <div class="tooltip-detail-item" *ngFor="let d of deptTooltipDetails">
      <span class="detail-code">{{ d.code }}</span>：{{ d.desc }}：<b>{{ d.count }}</b>人
    </div>
  </div>
</div>
```

---

### 📄 `src/app/pages/welcome/welcome.component.scss`

```scss
/* ==================== 全局盒模型 ==================== */
:host {
  display: block;
  width: 100%;
  overflow: hidden;
}

/* ==================== 容器 ==================== */
.welcome-container {
  background: #f0f2f5;
  /* ★ 改为浅灰背景，衬托白色卡片 */
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 12px;
  /* ★ 新增内边距，防止阴影被裁切 */
}

/* ==================== 页面标题 ==================== */
.page-header {
  text-align: center;
  padding: 10px 0 6px;
  margin-bottom: 12px;
  /* ★ 与下方网格拉开距离 */
  background: #fff;
  /* ★ 白色背景 */
  border-radius: 6px;
  /* ★ 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  /* ★ 阴影 */
  border-bottom: none;
  /* ★ 去掉原来的底部边线 */

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}

/* ==================== 仪表盘网格 ==================== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 110px 300px 1fr 250px;
  grid-template-rows: auto auto;
  grid-template-areas:
    "stats  center center right"
    "map    map    dept   right";
  gap: 8px;
  /* ★ 用 gap 代替边线分隔 */
  border: none;
  /* ★ 去掉外边框 */
  border-top: none;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0 auto;
}

/* ==================== 通用卡片阴影样式 ==================== */
.stats-section,
.chart-section,
.right-panel,
.map-section,
.dept-section {
  background: #fff;
  /* ★ 白色背景 */
  border-radius: 6px;
  /* ★ 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  /* ★ 阴影 */
  transition: box-shadow 0.3s ease;
  /* ★ 过渡动画 */

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    /* ★ 悬停加深阴影 */
  }
}

/* ==================== 1. 统计卡片 ==================== */
.stats-section {
  grid-area: stats;
  display: flex;
  flex-direction: column;
  min-width: 0;
  /* ★ 去掉 border-right */
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;

  &:first-child {
    border-bottom: 1px solid #e8e8e8;
  }
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.stat-number {
  font-size: 26px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  line-height: 1.6;
}

.row-label {
  color: #999;
}

.row-value,
.row-arrow {
  font-weight: 500;
}

.val-down {
  color: #52c41a;
}

.val-up {
  color: #ff4d4f;
}

/* ==================== 2. 中间图表区 ==================== */
.chart-section {
  grid-area: center;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  /* ★ 去掉 border-right */
}

.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: nowrap;
}

.filter-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 2px;

  label {
    font-size: 11px;
    color: #999;
  }
}

.date-range-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.trend-chart {
  height: 220px;
  padding: 4px 8px;
  min-width: 0;
}

/* ==================== 3. 右侧面板 ==================== */
.right-panel {
  grid-area: right;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-width: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 8px;
  white-space: nowrap;
}

/* ----- 厂别排行 ----- */
.ranking-block {
  flex: 1;
  padding: 10px 10px;
  border-bottom: 1px solid #e8e8e8;
  overflow-y: auto;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.rank-name {
  // width: 36px;                    // ★ 删除固定宽度
  min-width: 70px; // ★ 最小宽度，保证对齐
  max-width: 110px; // ★ 最大宽度，防止过长挤压进度条
  font-size: 11px;
  color: #333;
  flex-shrink: 0;
  // overflow: hidden;               // ★ 删除
  // text-overflow: ellipsis;        // ★ 删除
  white-space: nowrap;
}


.rank-bar-wrap {
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
  min-width: 0;
}

.rank-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.rank-count {
  width: 40px;
  text-align: right;
  font-size: 11px;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
}

.view-more-wrap {
  text-align: center;
  margin-top: 8px;
}

.view-more-link {
  display: inline-block;
  padding: 2px 12px;
  border: 1px solid #1890ff;
  border-radius: 10px;
  color: #1890ff;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e6f7ff;
  }
}

/* ----- 性别比 ----- */
.gender-block {
  padding: 10px 10px;
}

.gender-chart {
  height: 150px;
}

/* ==================== 4. 地区地图 ==================== */
.map-section {
  grid-area: map;
  padding: 10px 12px;
  min-width: 0;
  overflow: hidden;
  /* ★ 去掉 border-top、border-right */
}

.map-chart {
  height: 200px;
}

/* ==================== 5. 部门分布 ==================== */
.dept-section {
  grid-area: dept;
  padding: 10px 12px;
  min-width: 0;
  overflow: hidden;
  /* ★ 去掉 border-top */
}

.dept-chart {
  height: 200px;
}

/* ==================== 页脚 ==================== */
.page-footer {
  padding: 8px 12px;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #e8e8e8;
}

/* ==================== 响应式处理 ==================== */
@media (max-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: 110px 1fr 180px;
  }

  .stat-number {
    font-size: 22px;
  }

  .rank-name {
    width: 30px;
  }

  .trend-chart {
    height: 200px;
  }

  .map-chart,
  .dept-chart {
    height: 180px;
  }

  .gender-chart {
    height: 130px;
  }
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 100px 1fr 160px;
  }

  .stat-number {
    font-size: 20px;
  }

  .filter-bar {
    flex-wrap: wrap;
    gap: 6px;
  }
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "stats"
      "center"
      "right"
      "map"
      "dept";
  }

  .stats-section {
    flex-direction: row;

    .stat-card:first-child {
      border-bottom: none;
      border-right: 1px solid #e8e8e8;
    }
  }

  .chart-section,
  .map-section {
    /* ★ 移动端无需右边框 */
  }
}

.dept-tooltip-overlay {
  position: fixed;
  z-index: 2147483647;
  // ★ 去掉 top/left/transform，改由 TS 动态设置
  background: rgba(0, 0, 0, 0.88);
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
  max-height: 60vh;
  overflow-y: auto;
  min-width: 280px;
  max-width: 420px;
  pointer-events: none;

  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  .tooltip-header {
    position: sticky;
    top: 0;
    background: rgba(0, 0, 0, 0.95);
    font-size: 14px;
    font-weight: 700;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px 8px 0 0;
  }

  .tooltip-body {
    padding: 8px 16px 12px;
  }

  .tooltip-detail-item {
    padding: 3px 0;
    font-size: 12px;
    line-height: 1.6;
    white-space: nowrap;

    .detail-code {
      color: #faad14;
      font-weight: 600;
    }

    b {
      color: #fff;
      margin-left: 2px;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 2px;
  }
}
```

---

### 📄 `src/app/pages/welcome/welcome.component.ts`

```typescript
import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, HostListener, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';

import { forkJoin } from 'rxjs';
import * as echarts from 'echarts';

import { EmployeeService } from '../../services/employee.service';
import { SelectOption } from '../../models/employee';
import { environment } from '../../../environments/environment.development';

/** 排行榜徽章颜色 */
const BADGE_COLORS = [
  '#ff4d4f', '#ff7a45', '#52c41a',
  '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'
];
/** 排行榜柱条颜色 */
const BAR_COLORS = [
  '#ff4d4f', '#ff7a45', '#52c41a',
  '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff'
];

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzMessageModule,
    // ★ 不再导入任何 ngx-echarts 模块/指令
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {

  // ===================== ViewChild 图表容器 =====================
  @ViewChild('trendChartRef') trendChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('mapChartRef') mapChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('deptChartRef') deptChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('genderChartRef') genderChartEl!: ElementRef<HTMLDivElement>;

  // ===================== ECharts 实例 =====================
  private trendChart: echarts.ECharts | null = null;
  private mapEchart: echarts.ECharts | null = null;
  private deptEchart: echarts.ECharts | null = null;
  private genderEchart: echarts.ECharts | null = null;

  // ===================== 统计数据 =====================
  activeCount = 0;
  resignCount = 0;
  totalCount = 0;
  yoyActive = 0;
  momActive = 0;
  yoyResign = 0;
  momResign = 0;

  // ===================== 筛选条件 =====================
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedFactory = '';
  factoryOptions: SelectOption[] = [];

  // ===================== 厂别排行 =====================
  factoryRanking: { name: string; count: number; badgeColor: string; barColor: string }[] = [];
  displayedRanking: { name: string; count: number; badgeColor: string; barColor: string }[] = [];
  showAllFactories = false;

  // ===================== 原始数据 / 状态 =====================
  allEmployees: any[] = [];
  regionData: any[] = [];
  currentDate = '';
  loading = false;
  mapReady = false;
  mapLoadFailed = false;
  deptMap: Record<string, string> = {};
  deptDescToCode: Record<string, string> = {};
  // ===================== 部门饼图自定义 Tooltip =====================
  // 部门饼图自定义 Tooltip
  deptTooltipVisible = false;
  deptTooltipTitle = '';
  deptTooltipDetails: { code: string; desc: string; count: number }[] = [];
  deptTooltipTop = 0;
  deptTooltipLeft = 0;


  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient,
    private message: NzMessageService,
    private ngZone: NgZone
  ) { }

  // ==================== 生命周期 ====================

  ngOnInit(): void {
    this.currentDate = this.formatDisplayDate(new Date());
    this.loadFactoryOptions();
    this.loadWorldMap();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      // 数据可能已经在延迟期间加载完毕，需要立即渲染
      if (this.allEmployees.length > 0) {
        this.buildTrendChart();
        this.buildDeptChart();
        this.buildGenderChart();
        if (this.mapReady) {
          this.buildMapChart();
        } else if (this.mapLoadFailed) {
          this.buildMapFallbackChart();
        }
      }
    }, 400);
  }

  ngOnDestroy(): void {
    this.trendChart?.dispose();
    this.mapEchart?.dispose();
    this.deptEchart?.dispose();
    this.genderEchart?.dispose();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.trendChart?.resize();
    this.mapEchart?.resize();
    this.deptEchart?.resize();
    this.genderEchart?.resize();
  }

  // ==================== 初始化 ECharts 实例 ====================

  private initCharts(): void {
    if (this.trendChartEl?.nativeElement) {
      this.trendChart = echarts.init(this.trendChartEl.nativeElement);
    }
    if (this.mapChartEl?.nativeElement) {
      this.mapEchart = echarts.init(this.mapChartEl.nativeElement);
    }
    if (this.deptChartEl?.nativeElement) {
      this.deptEchart = echarts.init(this.deptChartEl.nativeElement);
    }
    if (this.genderChartEl?.nativeElement) {
      this.genderEchart = echarts.init(this.genderChartEl.nativeElement);
    }
  }

  // ==================== 下拉选项加载 ====================

  private loadFactoryOptions(): void {
    this.employeeService.getFactories().subscribe({
      next: opts => {
        this.factoryOptions = opts.filter(o => o.value !== '1');
      }
    });
  }

  // ==================== 仪表盘数据加载 ====================

  loadDashboardData(): void {
    this.loading = true;
    const where = this.buildWhereFilter();

    forkJoin({
      activeCount: this.employeeService.getCountByStatus(true, where),
      resignCount: this.employeeService.getCountByStatus(false, where),
      allEmployees: this.employeeService.getAllForAnalysis(where),
      regions: this.http.get<any[]>(`${environment.apiUrl}/regions`),
      departments: this.http.get<any[]>(`${environment.apiUrl}/departments`)   // ★ 新增
    }).subscribe({
      next: ({ activeCount, resignCount, allEmployees, regions, departments }) => {
        this.activeCount = activeCount;
        this.resignCount = resignCount;
        this.totalCount = activeCount + resignCount;
        this.allEmployees = allEmployees;
        this.regionData = regions;
        console.log(this.regionData);
        // ★ 新增：建立部门映射
        this.buildDeptMap(departments);

        this.calculateComparisons();
        this.buildTrendChart();
        this.buildFactoryRanking();
        this.buildDeptChart();
        this.buildGenderChart();

        if (this.mapReady) {
          this.buildMapChart();
        } else if (this.mapLoadFailed) {
          this.buildMapFallbackChart();
        }

        this.loading = false;

        // setTimeout(() => this.resizeAllCharts(), 100);
      },
      error: err => {
        console.error('加载仪表盘数据失败:', err);
        this.message.error('数据加载失败，请稍后重试');
        this.loading = false;
      }
    });
  }


  private buildWhereFilter(): any {
    const where: any = {};
    if (this.startDate && this.endDate) {
      where.hire_date = {
        between: [
          this.fmtDate(this.startDate),
          this.fmtDate(this.endDate) + 'T23:59:59'
        ]
      };
    }
    if (this.selectedFactory) {
      where.plant_name = this.selectedFactory;
    }
    return where;
  }

  onSearch(): void {
    this.loadDashboardData();
  }
  onReset(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedFactory = '';
    this.loadDashboardData();
  }
  // ==================== 同比 / 环比计算 ====================

  private calculateComparisons(): void {
    const now = new Date();
    const curKey = this.monthKey(now.getFullYear(), now.getMonth() + 1);

    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const prevKey = this.monthKey(prevYear, prevMonth);
    const lastYearKey = this.monthKey(now.getFullYear() - 1, now.getMonth() + 1);

    const hires = this.groupByMonth('hire_date');
    const resigns = this.groupByMonth('resin_date');

    const curH = hires[curKey] || 0;
    const prevH = hires[prevKey] || 0;
    const lyH = hires[lastYearKey] || 0;

    const curR = resigns[curKey] || 0;
    const prevR = resigns[prevKey] || 0;
    const lyR = resigns[lastYearKey] || 0;

    this.yoyActive = lyH > 0 ? +((curH - lyH) / lyH * 100).toFixed(2) : 0;
    this.momActive = prevH > 0 ? +((curH - prevH) / prevH * 100).toFixed(2) : 0;
    this.yoyResign = lyR > 0 ? +((curR - lyR) / lyR * 100).toFixed(2) : 0;
    this.momResign = prevR > 0 ? +((curR - prevR) / prevR * 100).toFixed(2) : 0;
  }

  private groupByMonth(field: string): Record<string, number> {
    const m: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      if (emp[field]) {
        const d = new Date(emp[field]);
        const key = this.monthKey(d.getFullYear(), d.getMonth() + 1);
        m[key] = (m[key] || 0) + 1;
      }
    });
    return m;
  }

  private monthKey(y: number, m: number): string {
    return `${y}-${String(m).padStart(2, '0')}`;
  }

  // ==================== 趋势折线图 ====================

  private buildTrendChart(): void {
    if (!this.trendChart) return;

    const now = new Date();
    const months: string[] = [];
    const hireData: number[] = [];
    const resignData: number[] = [];

    const hires = this.groupByMonth('hire_date');
    const resigns = this.groupByMonth('resin_date');

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = this.monthKey(d.getFullYear(), d.getMonth() + 1);
      months.push(`${d.getMonth() + 1}月`);
      hireData.push(hires[key] || 0);
      resignData.push(resigns[key] || 0);
    }

    this.trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['离职人数', '入职人数'],
        top: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, color: '#666' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: { lineStyle: { color: '#d9d9d9' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { color: '#999' }
      },
      series: [
        {
          name: '离职人数',
          type: 'line',
          data: resignData,
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#ff4d4f' },
          lineStyle: { color: '#ff4d4f', width: 2 }
        },
        {
          name: '入职人数',
          type: 'line',
          data: hireData,
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#faad14' },
          lineStyle: { color: '#faad14', width: 2 }
        }
      ]
    }, true);
  }

  // ==================== 厂别排行 ====================

  private buildFactoryRanking(): void {
    const map: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const f = emp.plant_name || '未知';
      map[f] = (map[f] || 0) + 1;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

    this.factoryRanking = sorted.map(([name, count], i) => ({
      name,
      count,
      badgeColor: BADGE_COLORS[Math.min(i, BADGE_COLORS.length - 1)],
      barColor: BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)]
    }));

    this.updateDisplayedRanking();
  }

  updateDisplayedRanking(): void {
    this.displayedRanking = this.showAllFactories
      ? this.factoryRanking
      : this.factoryRanking.slice(0, 10);
  }

  toggleShowAll(): void {
    this.showAllFactories = !this.showAllFactories;
    this.updateDisplayedRanking();
  }

  getMaxCount(): number {
    return this.factoryRanking.length > 0 ? this.factoryRanking[0].count : 1;
  }

  // ==================== 世界地图 ====================

  private loadWorldMap(): void {
    // ★ 优先使用本地 assets，不再依赖外部 CDN
    const localUrl = 'assets/map/world.json';

    fetch(localUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Local map load failed: ${res.status}`);
        return res.json();
      })
      .then(json => {
        echarts.registerMap('world', json as any);
        this.mapReady = true;
        if (this.allEmployees.length > 0 && this.mapEchart) {
          this.buildMapChart();
        }
      })
      .catch(err => {
        console.warn('地图加载失败，使用备用图表:', err);
        this.mapLoadFailed = true;
        if (this.allEmployees.length > 0 && this.mapEchart) {
          this.buildMapFallbackChart();
        }
      });
  }
  private buildMapChart(): void {
    if (!this.mapReady || !this.mapEchart) return;

    // 1. 按地区聚合人数
    const regionCount: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const r = emp.region_name || '未知';
      regionCount[r] = (regionCount[r] || 0) + 1;
    });

    // 2. 构建散点数据（按人数降序）
    const scatterData = this.regionData
      .filter((r: any) => r.longitude != null && r.latitude != null)
      .map((r: any) => ({
        name: r.region_name,
        name_cn: r.region_name_cn,
        value: [r.longitude, r.latitude, regionCount[r.region_name] || 0]
      }))
      .sort((a: any, b: any) => b.value[2] - a.value[2]);

    // 3. ★ 拆分：前3名 vs 其余
    const top3Data = scatterData.slice(0, 3);
    const restData = scatterData.slice(3);

    // 4. 为前3名计算标签位置 + 连线
    const labelPositions = this.calculateLabelPositions(top3Data);
    const linesData: any[] = [];
    const labelPoints: any[] = [];

    top3Data.forEach((point: any, index: number) => {
      const labelPos = labelPositions[index];

      linesData.push({
        coords: [
          [point.value[0], point.value[1]],
          [labelPos.lon, labelPos.lat]
        ]
      });

      labelPoints.push({
        name: point.name,
        value: [labelPos.lon, labelPos.lat, point.value[2]],
        dataIndex: index
      });
    });

    // 5. 颜色方案
    const colors = ['#ff4d4f', '#ff7a45', '#ffa940', '#fadb14', '#52c41a', '#1890ff', '#722ed1'];
    const getColor = (index: number): string => colors[Math.min(index, colors.length - 1)];

    this.mapEchart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: 'transparent',
        textStyle: { color: '#ffffffff', fontSize: 13 },
        formatter: (params: any) => {
          console.log("参数" + JSON.stringify(params));
          if (params.seriesType === 'lines') return '';
          if (params.seriesName === '标签') return '';  // 标签端点不重复显示
          const count = params.value?.[2] ?? 0;
          return `
          <div style="padding:4px 8px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:4px;">📍 ${params.name}:${params.data.name_cn}</div>
            <div style="font-size:20px;font-weight:700;color:#faad14;">
              ${count.toLocaleString()} <span style="font-size:12px;color:#ccc;">人</span>
            </div>
          </div>`;
        }
      },
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.5,
        center: [90, 20],
        label: { show: false },
        itemStyle: {
          areaColor: '#d6e4f0',
          borderColor: '#a3bdd4',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: { areaColor: '#b3d1ea' },
          label: {
            show: true,
          }
        }
      },
      series: [
        // ★ 系列1：前3名散点（带颜色排名）
        {
          name: 'TOP3',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: top3Data,
          symbolSize: 10,
          itemStyle: {
            color: (params: any) => getColor(params.dataIndex),
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          label: { show: false },
          zlevel: 2
        },

        // ★ 系列2：其余散点 — 默认不显示标签，hover 时显示
        {
          name: '其他地区',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: restData.map((d: any, i: number) => ({
            ...d,
            dataIndex: i + 3   // 保留全局索引用于取色
          })),
          symbolSize: 10,
          itemStyle: {
            color: (params: any) => {
              const idx = params.data.dataIndex ?? (params.dataIndex + 3);
              if (params.value[2] === 0) return '#bfbfbf';
              return getColor(idx);
            },
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          // ★ 默认不显示标签
          label: { show: false },
          // ★ 鼠标悬停时显示标签
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.4)',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'right',
              distance: 8,
              formatter: (p: any) => {
                const count = p.value[2];
                return `${p.name}  ${count.toLocaleString()}人`;
              },
              fontSize: 13,
              fontWeight: 700,
              color: (params: any) => {
                const idx = params.data.dataIndex ?? (params.dataIndex + 3);
                if (params.value[2] === 0) return '#999';
                return getColor(idx);
              },
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: [4, 8],
              borderRadius: 4,
              borderColor: '#ddd',
              borderWidth: 1
            }
          },
          zlevel: 2
        },

        // ★ 系列3：连线 — 仅前3名
        {
          name: '连线',
          type: 'lines',
          coordinateSystem: 'geo',
          data: linesData,
          lineStyle: {
            color: '#aaa',
            width: 1,
            type: 'solid',
            curveness: 0.2,
            opacity: 0.4
          },
          zlevel: 1
        },

        // ★ 系列4：标签端点 — 仅前3名
        {
          name: '标签',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: labelPoints,
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            color: (params: any) => getColor(params.data.dataIndex),
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: true,
            position: 'right',
            distance: 5,
            formatter: (p: any) => {
              const count = p.value[2];
              const idx = p.data.dataIndex;
              return `{s${idx}|${p.name}  ${count.toLocaleString()}人}`;
            },
            rich: (() => {
              const richStyles: Record<string, any> = {};
              for (let i = 0; i < 3; i++) {
                const color = getColor(i);
                richStyles[`s${i}`] = {
                  fontSize: 13,
                  fontWeight: 700,
                  color: color,
                  padding: [4, 8],
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  borderRadius: 4,
                  borderColor: color,
                  borderWidth: 1,
                  lineHeight: 22
                };
              }
              return richStyles;
            })()
          },
          zlevel: 3
        }
      ]
    }, true);
  }
  /**
   * ★ 计算标签在右侧空白区域的位置
   * 标签放在太平洋空白海域，垂直排列，避免与地图陆地重叠
   */
  private calculateLabelPositions(data: any[]): { lon: number; lat: number }[] {
    const count = data.length;

    // 标签列的经度位置（太平洋空白区域）
    const baseLon = 160;

    // 根据数据量动态计算垂直分布范围
    const topLat = 50;                                   // 最高标签的纬度
    const spacing = count > 1 ? Math.min(15, 70 / count) : 0;  // 标签间距（自动适应）

    return data.map((_: any, index: number) => ({
      lon: baseLon + (index % 2 === 0 ? 0 : 5),          // 奇偶交错，避免标签重叠
      lat: topLat - index * spacing
    }));
  }
  /**
   * ★ 计算每个散点的标签偏移方向和距离，避免标签重叠
   * 策略：按索引交替分配不同方向（右上、右下、左上、左下等）
   */
  private calculateLabelOffsets(data: any[]): { dx: number; dy: number }[] {
    // 预定义偏移方向（经度偏移, 纬度偏移）
    const directions = [
      { dx: 15, dy: 8 },     // 右上
      { dx: 18, dy: -5 },    // 右下
      { dx: -18, dy: 10 },   // 左上
      { dx: 20, dy: -12 },   // 右下远
      { dx: -15, dy: -8 },   // 左下
      { dx: 22, dy: 3 },     // 右平
      { dx: -20, dy: -3 },   // 左平
      { dx: 12, dy: 15 },    // 右上远
      { dx: -12, dy: 15 },   // 左上远
      { dx: 25, dy: -8 },    // 右下远
    ];

    return data.map((_: any, index: number) => {
      const dir = directions[index % directions.length];
      // 根据索引稍微调整距离，避免完全重叠
      const scale = 1 + (index * 0.05);
      return {
        dx: dir.dx * scale,
        dy: dir.dy * scale
      };
    });
  }



  /** 地图加载失败时的备用柱状图 */
  private buildMapFallbackChart(): void {
    if (!this.mapEchart) return;

    const regionCount: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const r = emp.region_name || '未知';
      regionCount[r] = (regionCount[r] || 0) + 1;
    });
    const sorted = Object.entries(regionCount).sort((a, b) => b[1] - a[1]);

    this.mapEchart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 13 },
        formatter: (params: any) => {
          // ★ 过滤掉 geo 组件（国家区域）的 tooltip → 白色框消失
          if (params.componentType === 'geo') return '';
          if (params.seriesType === 'lines') return '';
          if (params.seriesName === '标签') return '';
          const count = params.value?.[2] ?? 0;
          return `
      <div style="padding:4px 8px;">
        <div style="font-size:14px;font-weight:600;margin-bottom:4px;">📍 ${params.name}</div>
        <div style="font-size:20px;font-weight:700;color:#faad14;">
          ${count.toLocaleString()} <span style="font-size:12px;color:#ccc;">人</span>
        </div>
      </div>`;
        }
      },
      grid: { left: '3%', right: '10%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: sorted.map(([n]) => n).reverse(),
        axisLabel: { fontSize: 11 }
      },
      series: [{
        type: 'bar',
        data: sorted.map(([, c]) => c).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#69c0ff' }
          ])
        },
        barWidth: '60%'
      }]
    }, true);
  }

  // ==================== 部门饼图 ====================

  // ==================== 部门饼图（按编码前3位归类） ====================

  private buildDeptChart(): void {
    if (!this.deptEchart) return;

    // ── 1. 按 dept_desc 统计每个部门的人数 ──
    const deptCountMap: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const raw = emp.dept_desc || '未知';
      deptCountMap[raw] = (deptCountMap[raw] || 0) + 1;
    });

    // ── 2. 按 dept_code 前3位归类 ──
    const groupMap: Record<string, {
      total: number;
      details: { code: string; desc: string; count: number }[];
    }> = {};

    Object.entries(deptCountMap).forEach(([desc, count]) => {
      const code = this.deptDescToCode[desc] || desc;
      const prefix = code.length >= 3 ? code.substring(0, 3) : code;

      if (!groupMap[prefix]) {
        groupMap[prefix] = { total: 0, details: [] };
      }
      groupMap[prefix].total += count;
      groupMap[prefix].details.push({ code, desc, count });
    });

    // ── 3. 按总人数降序排序 ──
    const sorted = Object.entries(groupMap).sort((a, b) => b[1].total - a[1].total);

    // ── 4. 构建饼图数据 ──
    const pieData = sorted.map(([prefix, group]) => {
      group.details.sort((a, b) => b.count - a.count);
      return {
        name: prefix,
        value: group.total,
        details: group.details
      };
    });

    // ── 5. 渲染（★ 禁用内置 tooltip，改用自定义浮层） ──
    this.deptEchart.setOption({
      tooltip: { show: false },          // ★ 禁用内置 tooltip
      series: [{
        type: 'pie',
        radius: ['0%', '65%'],
        center: ['50%', '52%'],
        data: pieData,
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 10,
          color: '#555'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }]
    }, true);

    // ── 6. ★ 绑定自定义 Tooltip 事件 ──
    this.bindDeptChartEvents();
  }

  /**
   * ★ 绑定饼图鼠标事件 → 驱动自定义 Tooltip 浮层
   */
  private bindDeptChartEvents(): void {
    if (!this.deptEchart) return;

    this.deptEchart.off('mouseover');
    this.deptEchart.off('mouseout');
    this.deptEchart.off('mousemove');      // ★ 新增

    // 鼠标移入扇区 → 显示浮层
    this.deptEchart.on('mouseover', (params: any) => {
      if (params.componentType !== 'series') return;

      this.ngZone.run(() => {
        const details = params.data?.details || [];
        this.deptTooltipTitle = `${params.name} — 共 ${params.value} 人（${params.percent}%）`;
        this.deptTooltipDetails = details;
        this.deptTooltipVisible = true;
      });
    });

    // ★ 鼠标移动 → 跟随鼠标位置（带边界检测）
    this.deptEchart.getZr().on('mousemove', (params: any) => {
      if (!this.deptTooltipVisible) return;

      this.ngZone.run(() => {
        const mouseX = params.event?.clientX ?? params.offsetX ?? 0;
        const mouseY = params.event?.clientY ?? params.offsetY ?? 0;

        const tooltipWidth = 350;     // 预估宽度
        const tooltipHeight = 300;    // 预估高度
        const offset = 15;            // 鼠标与浮层间距

        // ★ 边界检测：防止超出视口
        let x = mouseX + offset;
        let y = mouseY + offset;

        // 右侧超出 → 显示在鼠标左侧
        if (x + tooltipWidth > window.innerWidth) {
          x = mouseX - tooltipWidth - offset;
        }
        // 底部超出 → 显示在鼠标上方
        if (y + tooltipHeight > window.innerHeight) {
          y = mouseY - tooltipHeight - offset;
        }
        // 左侧/顶部不超出
        x = Math.max(10, x);
        y = Math.max(10, y);

        this.deptTooltipTop = y;
        this.deptTooltipLeft = x;
      });
    });

    // 鼠标移出扇区 → 隐藏浮层
    this.deptEchart.on('mouseout', () => {
      this.ngZone.run(() => {
        this.deptTooltipVisible = false;
      });
    });
  }




  /**
   * 建立部门映射表
   * 同时支持 dept_code → dept_desc 和 dept_desc → dept_desc
   */
  private buildDeptMap(departments: any[]): void {
    this.deptMap = {};
    this.deptDescToCode = {};

    departments.forEach((dept: any) => {
      const code = dept.dept_code || '';
      const desc = dept.dept_desc || '';

      // 正向：code → desc（用于其他场景）
      if (code && desc) {
        this.deptMap[code] = desc;
      }
      if (desc) {
        this.deptMap[desc] = desc;
      }
      if (desc && code) {
        this.deptDescToCode[desc] = code;
      }
      if (code) {
        this.deptDescToCode[code] = code;
      }
    });
  }


  // ==================== 性别环形图 ====================

  private buildGenderChart(): void {
    if (!this.genderEchart) return;

    let male = 0, female = 0, unknown = 0;
    this.allEmployees.forEach((emp: any) => {
      if (emp.Sex === true) male++;
      else if (emp.Sex === false) female++;
      else unknown++;
    });

    const total = male + female + unknown;
    const mp = total > 0 ? Math.round(male / total * 100) : 0;
    const fp = total > 0 ? Math.round(female / total * 100) : 0;
    const up = 100 - mp - fp;

    this.genderEchart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: {
        orient: 'vertical',
        right: '-4%',
        top: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        formatter: (name: string) => {
          if (name === '男') return `男：${mp}%（${male}）`;
          if (name === '女') return `女：${fp}%（${female}）`;
          return `未知：${up}%（${unknown}）`;
        },
        textStyle: { fontSize: 12, lineHeight: 22 }
      },
      title: {
        text: '总人数',
        subtext: `${total}`,
        left: '30%',
        top: '35%',
        textAlign: 'center',
        textStyle: { fontSize: 13, color: '#999', fontWeight: 'normal' },
        subtextStyle: { fontSize: 24, color: '#333', fontWeight: 'bold' }
      },
      series: [{
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: male, name: '男', itemStyle: { color: '#1890ff' } },
          { value: female, name: '女', itemStyle: { color: '#ff85c0' } },
          { value: unknown, name: '未知', itemStyle: { color: '#d9d9d9' } }
        ]
      }]
    }, true);
  }

  // ==================== 日期禁用 ====================

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endDate) return false;
    return startValue.getTime() > this.endDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startDate) return false;
    return endValue.getTime() < this.startDate.getTime();
  };

  // ==================== 工具函数 ====================

  private formatDisplayDate(d: Date): string {
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }

  private fmtDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
```

---

### 📄 `src/app/pages/welcome/welcome.routes.ts`

```typescript
// import { Routes } from '@angular/router';
// import { WelcomeComponent } from './welcome.component';

// export const WELCOME_ROUTES: Routes = [
//   { path: '', component: WelcomeComponent },
// ];
```

---

### 📄 `src/app/services/auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    employee_id: string;
    name?: string;
    role_id?: number;
    is_super_admin?: boolean;   // ★ Task 8 新增
  };
}

/** JWT Payload 中的字段（与后端 JwtPayload 对应） */
export interface TokenPayload {
  employee_id: string;
  name?: string;
  role_id?: number;
  is_super_admin?: boolean;   // ★ Task 8 新增
  iat: number;
  exp: number;
}

// ★ 新增：修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ★ 新增：忘记密码请求
export interface ForgotPasswordRequest {
  username: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * 登录
   */
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
        }
        if (res.user) {
          localStorage.setItem('user_info', JSON.stringify(res.user));
        }
      })
    );
  }

  /**
   * ★ 修改密码
   */
  changePassword(payload: ChangePasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/change-password`,
      payload
    );
  }

  /**
   * ★ 忘记密码（无需登录态）
   */
  forgotPassword(payload: ForgotPasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/forgot-password`,
      payload
    );
  }

  /**
   * 登出
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as TokenPayload;
    } catch {
      return null;
    }
  }

  isTokenValid(): boolean {
    const payload = this.decodeToken();
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  getCurrentUser(): LoginResponse['user'] | null {
    const raw = localStorage.getItem('user_info');
    return raw ? JSON.parse(raw) : null;
  }

  // ★ Task 8 新增：快捷判断当前用户是否为超级管理员
  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_super_admin === true;
  }
}
```

---

### 📄 `src/app/services/employee.service.ts`

```typescript
// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee, EmployeeFilter, EmployeeResponse, SelectOption, RoleOption } from '../models/employee';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;
  private apiUrlPlant = `${environment.apiUrl}/plants`;
  private apiUrlRegion = `${environment.apiUrl}/regions`;
  private apiUrlDept = `${environment.apiUrl}/departments`;
  private apiUrlRole = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }
  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  /**
   * 获取员工列表
   */
  getEmployees(filter?: EmployeeFilter): Observable<EmployeeResponse> {
    let params = new HttpParams();

    const loopbackFilter: any = {
      where: {},
      skip: filter?.skip || 0,
      limit: filter?.limit || 10,
      order: ['hire_date DESC']
    };

    // ========== ★ 新增：时间范围筛选 ==========
    // 如果后端使用 between 接受 [start, end]，构造为 ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss"]
    if (filter?.startDate && filter?.endDate) {
      const start = this.formatDate(filter.startDate); // 仅日期部分
      const end = this.formatDate(filter.endDate) + 'T23:59:59'; // 包含当天结束时间
      // 注意字段名使用下划线与后端一致：hire_date
      loopbackFilter.where.hire_date = {
        between: [start, end]
      };
    }
    // 搜索文本（工号、姓名、部门）
    if (filter?.searchText && filter.searchText.trim()) {
      loopbackFilter.where.or = [
        { employee_id: { like: `%${filter.searchText}%` } },
        { name: { like: `%${filter.searchText}%` } },
        { dept_desc: { like: `%${filter.searchText}%` } },
      ];
    }

    // 【修改点】将地区和厂别筛选合并到 LoopBack 4 filter的 where 对象中
    if (filter?.area && filter.area !== '1') {
      loopbackFilter.where.region_name = filter.area;
    }
    if (filter?.factory && filter.factory !== '1') {
      loopbackFilter.where.plant_name = filter.factory;
    }

    params = params.set('filter', JSON.stringify(loopbackFilter));
    console.log('请求参数:', params.toString());
    return this.http.get<Employee[] | EmployeeResponse>(this.apiUrl, { params }).pipe(
      map((resp: Employee[] | EmployeeResponse) => {
        if (Array.isArray(resp)) {
          return { data: resp, total: resp.length } as EmployeeResponse;
        }
        return resp as EmployeeResponse;
      })
    );
  }

  /**
   * 获取符合条件的员工总数（用于分页）
   */
  getEmployeesCount(filter?: EmployeeFilter): Observable<number> {
    let where: any = {};

    if (filter?.startDate && filter?.endDate) {
      const start = this.formatDate(filter.startDate);
      const end = this.formatDate(filter.endDate) + 'T23:59:59';
      where.hire_date = { between: [start, end] };
    } else if (filter?.startDate || filter?.endDate) {
      const hireDateCondition: any = {};
      if (filter.startDate) {
        hireDateCondition.gte = this.formatDate(filter.startDate);
      }
      if (filter.endDate) {
        hireDateCondition.lte = this.formatDate(filter.endDate) + 'T23:59:59';
      }
      where.hire_date = hireDateCondition;
    }

    if (filter?.searchText && filter.searchText.trim()) {
      where.or = [
        { employee_id: { like: `%${filter.searchText}%` } },
        { name: { like: `%${filter.searchText}%` } },
        { dept_desc: { like: `%${filter.searchText}%` } },
      ];
    }

    if (filter?.area && filter.area !== '1') {
      where.region_name = filter.area;
    }
    if (filter?.factory && filter.factory !== '1') {
      where.plant_name = filter.factory;
    }

    const params = new HttpParams().set('where', JSON.stringify(where));
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`, { params }).pipe(
      map(r => r.count)
    );
  }

  /**
   * 根据ID获取员工
   */
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  /**
   * 创建员工
   */
  createEmployee(employee: Partial<Employee>): Observable<Employee> {

    return this.http.post<Employee>(this.apiUrl, employee);
  }
  /**
    * 批量创建员工（使用 forkJoin 并行发送多个创建请求）
    */
  createEmployees(employees: Partial<Employee>[]): Observable<Employee[]> {
    const requests = employees.map(emp => this.createEmployee(emp));
    return forkJoin(requests);
  }
  /**
   * 更新员工
   */
  updateEmployee(id: string, employee: Partial<Employee>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * 批量软删除（标记为离职）
   */
  deleteEmployees(ids: string[]): Observable<{ count: number }> {
    if (!ids || ids.length === 0) {
      return of({ count: 0 });
    }
    const where = JSON.stringify({ employee_id: { inq: ids } });
    const params = new HttpParams().set('where', where);
    // LoopBack 的 updateAll 返回 Count 类型 {count: number}
    return this.http.patch<{ count: number }>(`${this.apiUrl}`, { status: false, resin_date: new Date() }, { params });
  }

  /**
   * 获取地区列表
   */
  getAreas(): Observable<SelectOption[]> {
    return this.http.get<any[]>(`${this.apiUrlRegion}`).pipe(
      map(list => {
        const options: SelectOption[] = list.map(item => {
          const name = item.region_name ?? item.name ?? item.label ?? '';
          return { value: name, label: name };
        });
        if (!options.find(o => o.value === '1')) {
          options.unshift({ value: '1', label: '全部' });
        }
        return options;
      })
    );
  }


  /**
   * 获取厂别列表 (修正映射逻辑)
   */
  getFactories(area?: string): Observable<SelectOption[]> {
    let params = new HttpParams();
    // 这里需注意：若厂别接口依赖 region_name，传入正确的参数
    if (area && area !== '1') {
      params = params.set('region_name', area);
    }
    return this.http.get<any[]>(`${this.apiUrlPlant}`, { params }).pipe(
      map(list => {
        const options: SelectOption[] = list.map(item => {
          const name = item.plant_name ?? item.name ?? item.label ?? '';
          return { value: name, label: name };
        });
        if (!options.find(o => o.value === '1')) {
          options.unshift({ value: '1', label: '全部' });
        }
        return options;
      })
    );
  }
  getDepartments(): Observable<SelectOption[]> {
    return this.http.get<any[]>(this.apiUrlDept).pipe(
      map(list => {
        return list.map(item => {
          const name = item.dept_desc ?? item.name ?? item.label ?? '';
          return { value: name, label: name } as SelectOption;
        });
      })
    );
  }

  /**
   * 获取角色列表
   * 后端返回示例: [{ role_id: 1, role_name: "管理员" }, { role_id: 2, role_name: "普通用户" }, ...]
   */
  getRoles(): Observable<RoleOption[]> {
    return this.http.get<any[]>(this.apiUrlRole).pipe(
      map(list => {
        return list.map(item => {
          const id = item.role_id ?? item.id ?? item.value;
          const name = item.role_name ?? item.name ?? item.label ?? '';
          return { value: id, label: name } as RoleOption;
        });
      })
    );
  }
  // ===================== 分析页专用 =====================

  /** 按状态统计人数（在职/离职） */
  getCountByStatus(status: boolean, extraWhere?: any): Observable<number> {
    const where = { status, ...(extraWhere || {}) };
    const params = new HttpParams().set('where', JSON.stringify(where));
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`, { params }).pipe(
      map(r => r.count)
    );
  }

  /** 获取全部员工（前端聚合分析用，不分页） */
  getAllForAnalysis(extraWhere?: any): Observable<Employee[]> {
    const filter = {
      where: extraWhere || {},
      limit: 100000
    };
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(resp => Array.isArray(resp) ? resp : (resp?.data || []))
    );
  }

}
```

---

### 📄 `src/app/services/permission.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

---

### 📄 `src/app/services/permission.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { RoleDetail, PageAuthField } from '../models/role';
import { environment } from '../../environments/environment.development';

/** 权限位掩码常量 */
export const Permission = {
  READ: 1,   // 0001 — 查看
  CREATE: 2,   // 0010 — 新增
  DELETE: 4,   // 0100 — 删除
  UPDATE: 8,   // 1000 — 修改
} as const;

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/roles`;
  private employeeApiUrl = `${environment.apiUrl}/employees`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  // ==================== 位运算工具方法 ====================

  /** 判断是否拥有某项权限 */
  hasPermission(authValue: number, perm: number): boolean {
    return (authValue & perm) === perm;
  }

  /** 将勾选的权限数组合并为数值 */
  encodePermissions(perms: number[]): number {
    return perms.reduce((acc, p) => acc | p, 0);
  }

  /** 将数值解码为权限数组 */
  decodePermissions(value: number): number[] {
    const result: number[] = [];
    if (value & Permission.READ) result.push(Permission.READ);
    if (value & Permission.CREATE) result.push(Permission.CREATE);
    if (value & Permission.DELETE) result.push(Permission.DELETE);
    if (value & Permission.UPDATE) result.push(Permission.UPDATE);
    return result;
  }

  // ==================== 当前用户权限查询 ====================

  /** 获取当前登录用户的角色权限 */
  getCurrentUserPermissions(): Observable<RoleDetail | null> {
    const user = this.authService.getCurrentUser();
    if (!user || user.role_id == null) {
      return of(null);
    }
    return this.http.get<RoleDetail>(`${this.apiUrl}/${user.role_id}`);
  }

  // ★ Task 8 新增：获取当前用户自己的角色详情
  getMyRole(): Observable<RoleDetail | null> {
    const user = this.authService.getCurrentUser();
    if (!user || user.role_id == null) {
      return of(null);
    }
    return this.http.get<RoleDetail>(`${this.apiUrl}/${user.role_id}`);
  }

  /** 快速判断当前用户对某页面是否有某权限 */
  checkPagePermission(role: RoleDetail, page: PageAuthField, perm: number): boolean {
    const val: number = role[page] ?? 0;
    return this.hasPermission(val, perm);
  }

  // ==================== 角色 CRUD ====================

  getAllRoles(): Observable<RoleDetail[]> {
    return this.http.get<RoleDetail[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Partial<RoleDetail>): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(this.apiUrl, role);
  }

  updateRole(id: number, role: Partial<RoleDetail>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** 查询某角色下绑定了多少员工 */
  getEmployeeCountByRole(roleId: number): Observable<number> {
    const where = JSON.stringify({ role_id: roleId });
    const params = new HttpParams().set('where', where);
    return this.http.get<{ count: number }>(
      `${this.employeeApiUrl}/count`, { params }
    ).pipe(map(r => r.count));
  }
}
```

---

### 📄 `src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  // 替换为你的本地 LoopBack 4 实际运行的地址和端口
  apiUrl: 'http://localhost:3000'
};
```

---

### 📄 `src/environments/environment.ts`

```typescript
export const environment = {};
```

---

### 📄 `src/index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>FrontedDemo</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

### 📄 `src/main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

---

### 📄 `src/styles.scss`

```scss
/* You can add global styles to this file, and also import other style files */
```

---

### 📄 `tsconfig.app.json`

```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

---

### 📄 `tsconfig.json`

```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

---

### 📄 `tsconfig.spec.json`

```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine"
    ]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

---

---

## 项目 2: 后端项目 (backend_demo)

### 一、项目结构

```
backend_demo/
├── data
│   └── demo.sqlite
├── public
│   └── index.html
├── src
│   ├── __tests__
│   │   ├── acceptance
│   │   │   ├── home-page.acceptance.ts
│   │   │   ├── ping.controller.acceptance.ts
│   │   │   └── test-helper.ts
│   │   └── README.md
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── department.controller.ts
│   │   ├── employee.controller.ts
│   │   ├── index.ts
│   │   ├── ping.controller.ts
│   │   ├── plant.controller.ts
│   │   ├── README.md
│   │   ├── region.controller.ts
│   │   └── role.controller.ts
│   ├── datasources
│   │   ├── demo.datasource.ts
│   │   ├── index.ts
│   │   └── README.md
│   ├── interceptors
│   │   ├── auth.interceptor.ts
│   │   └── index.ts
│   ├── models
│   │   ├── department.model.ts
│   │   ├── employee.model.ts
│   │   ├── index.ts
│   │   ├── plant.model.ts
│   │   ├── README.md
│   │   ├── region.model.ts
│   │   └── role.model.ts
│   ├── repositories
│   │   ├── department.repository.ts
│   │   ├── employee.repository.ts
│   │   ├── index.ts
│   │   ├── plant.repository.ts
│   │   ├── README.md
│   │   ├── region.repository.ts
│   │   └── role.repository.ts
│   ├── services
│   │   ├── hash.service.ts
│   │   ├── index.ts
│   │   └── jwt.service.ts
│   ├── application.ts
│   ├── index.ts
│   ├── migrate-passwords.ts
│   ├── migrate.ts
│   ├── openapi-spec.ts
│   └── sequence.ts
├── .dockerignore
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .mocharc.json
├── .prettierignore
├── .prettierrc
├── .yo-rc.json
├── DEVELOPING.md
├── Dockerfile
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

### 二、项目代码

共 42 个文件

### 📄 `.eslintrc.js`

```javascript
module.exports = {
  extends: '@loopback/eslint-config',
};
```

---

### 📄 `.mocharc.json`

```json
{
  "exit": true,
  "recursive": true,
  "require": "source-map-support/register"
}
```

---

### 📄 `.yo-rc.json`

```json
{
  "@loopback/cli": {
    "packageManager": "npm",
    "version": "7.0.12"
  }
}
```

---

### 📄 `package.json`

```json
{
  "name": "backend_demo",
  "version": "0.0.1",
  "description": "backend_demo",
  "keywords": [
    "loopback-application",
    "loopback"
  ],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "engines": {
    "node": "20 || 22 || 24"
  },
  "scripts": {
    "build": "lb-tsc",
    "build:watch": "lb-tsc --watch",
    "lint": "npm run eslint && npm run prettier:check",
    "lint:fix": "npm run eslint:fix && npm run prettier:fix",
    "prettier:cli": "lb-prettier \"**/*.ts\" \"**/*.js\"",
    "prettier:check": "npm run prettier:cli -- -l",
    "prettier:fix": "npm run prettier:cli -- --write",
    "eslint": "lb-eslint --report-unused-disable-directives .",
    "eslint:fix": "npm run eslint -- --fix",
    "pretest": "npm run rebuild",
    "test": "lb-mocha --allow-console-logs \"dist/__tests__\"",
    "posttest": "npm run lint",
    "test:dev": "lb-mocha --allow-console-logs dist/__tests__/**/*.js && npm run posttest",
    "docker:build": "docker build -t backend_demo .",
    "docker:run": "docker run -p 3000:3000 -d backend_demo",
    "premigrate": "npm run build",
    "migrate": "node ./dist/migrate",
    "preopenapi-spec": "npm run build",
    "openapi-spec": "node ./dist/openapi-spec",
    "prestart": "npm run rebuild",
    "start": "node -r source-map-support/register .",
    "clean": "lb-clean dist *.tsbuildinfo .eslintcache",
    "rebuild": "npm run clean && npm run build",
    "migrate:passwords": "npm run build && node ./dist/migrate-passwords"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "Yongfeng YF Xu <Yongfeng_YF_Xu@wistron.com>",
  "license": "",
  "files": [
    "README.md",
    "dist",
    "src",
    "!*/__tests__"
  ],
  "dependencies": {
    "@loopback/boot": "^8.0.11",
    "@loopback/core": "^7.0.10",
    "@loopback/repository": "^8.0.10",
    "@loopback/rest": "^15.0.11",
    "@loopback/rest-explorer": "^8.0.11",
    "@loopback/service-proxy": "^8.0.10",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "loopback-connector-postgresql": "^7.2.3",
    "tslib": "^2.0.0"
  },
  "devDependencies": {
    "@loopback/build": "^12.0.10",
    "@loopback/eslint-config": "^16.0.1",
    "@loopback/testlab": "^8.0.10",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^16.18.126",
    "eslint": "^8.57.1",
    "source-map-support": "^0.5.21",
    "typescript": "~5.2.2"
  }
}
```

---

### 📄 `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <title>backend_demo</title>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" type="image/x-icon" href="https://loopback.io/favicon.ico">

  <style>
    h3 {
      margin-left: 25px;
      text-align: center;
    }

    a, a:visited {
      color: #3f5dff;
    }

    h3 a {
      margin-left: 10px;
    }

    a:hover, a:focus, a:active {
      color: #001956;
    }

    .power {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
    }

    .info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%)
    }

    .info h1 {
      text-align: center;
      margin-bottom: 0;
    }

    .info p {
      text-align: center;
      margin-bottom: 3em;
      margin-top: 1em;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: rgb(29, 30, 32);
        color: white;
      }

      a, a:visited {
        color: #4990e2;
      }

      a:hover, a:focus, a:active {
        color: #2b78ff;
      }
    }
  </style>
</head>

<body>
  <div class="info">
    <h1>backend_demo</h1>
    <p>Version 1.0.0</p>

    <h3>OpenAPI spec: <a href="./openapi.json">/openapi.json</a></h3>
    <h3>API Explorer: <a href="./explorer">/explorer</a></h3>
  </div>

  <footer class="power">
    <a href="https://loopback.io" target="_blank">
      <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" />
    </a>
  </footer>
</body>

</html>
```

---

### 📄 `src/application.ts`

```typescript
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export { ApplicationConfig };

export class BackendDemoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

  }
}
```

---

### 📄 `src/controllers/auth.controller.ts`

```typescript
import { inject } from '@loopback/core';
import {
  post, requestBody, response, ResponseObject,
  RestBindings, Request,
} from '@loopback/rest';
import { repository } from '@loopback/repository';
import { EmployeeRepository, RoleRepository } from '../repositories';
import { comparePassword, hashPassword } from '../services/hash.service';
import { generateToken, verifyToken } from '../services/jwt.service';

const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { type: 'object' },
        },
      },
    },
  },
};

// ★ 新增：修改密码响应
const CHANGE_PASSWORD_RESPONSE: ResponseObject = {
  description: 'Change password response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export class AuthController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    // ★ Task 3 新增：注入 RoleRepository 以查询 is_super_admin
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) { }

  /**
   * POST /login
   * 使用 bcrypt 比对密码，成功后签发 JWT
   */
  @post('/login')
  @response(200, LOGIN_RESPONSE)
  async login(
    @requestBody({
      description: 'Credentials',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    credentials: { username: string; password: string },
  ) {
    const { username, password } = credentials;

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: username },
    });

    if (!employee || !employee.password) {
      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // 2. bcrypt 比对密码
    const isMatch = await comparePassword(password, employee.password);
    if (!isMatch) {
      throw Object.assign(new Error('用户名或密码错误'), { statusCode: 401 });
    }

    // ★ 3. 查询角色获取 is_super_admin
    let isSuperAdmin = false;
    if (employee.role_id != null) {
      try {
        const role = await this.roleRepository.findById(employee.role_id);
        isSuperAdmin = role?.is_super_admin ?? false;
      } catch {
        // 角色不存在，默认非超级管理员
      }
    }

    // 4. 签发 JWT（包含 is_super_admin）
    const token = generateToken({
      employee_id: employee.employee_id,
      name: employee.name,
      role_id: employee.role_id,
      is_super_admin: isSuperAdmin,
    });

    return {
      token,
      user: {
        employee_id: employee.employee_id,
        name: employee.name,
        role_id: employee.role_id,
        is_super_admin: isSuperAdmin,
      },
    };
  }

  // ===================== ★ 新增：修改密码 =====================

  /**
   * POST /change-password
   * 需要 JWT 认证（拦截器已自动校验 token）
   * 从 Authorization header 中解析当前用户，验证原密码后更新新密码
   */
  @post('/change-password')
  @response(200, CHANGE_PASSWORD_RESPONSE)
  async changePassword(
    @requestBody({
      description: 'Change password payload',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: { type: 'string' },
              newPassword: { type: 'string' },
            },
            required: ['oldPassword', 'newPassword'],
          },
        },
      },
    })
    body: { oldPassword: string; newPassword: string },
  ): Promise<{ success: boolean; message: string }> {

    // 1. 从 JWT 中提取当前登录用户的 employee_id
    const authHeader = this.request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw Object.assign(new Error('未提供有效的认证令牌'), { statusCode: 401 });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    const employeeId = decoded.employee_id;

    console.log(`[change-password] 用户 ${employeeId} 请求修改密码`);

    // 2. 查找用户
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee || !employee.password) {
      throw Object.assign(new Error('用户不存在或密码未设置'), { statusCode: 400 });
    }

    // 3. 验证原密码
    const isMatch = await comparePassword(body.oldPassword, employee.password);
    if (!isMatch) {
      throw Object.assign(new Error('原密码不正确'), { statusCode: 400 });
    }

    // 4. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), { statusCode: 400 });
    }

    // 5. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(employeeId, {
      password: hashedNewPassword,
    });

    console.log(`[change-password] 用户 ${employeeId} 密码修改成功`);

    return { success: true, message: '密码修改成功' };
  }

  /**
   * POST /forgot-password
   * 公开端点（无需 JWT），用于忘记密码时重置密码
   * 通过 username（工号）查找用户并更新新密码
   */
  @post('/forgot-password')
  @response(200, CHANGE_PASSWORD_RESPONSE)
  async forgotPassword(
    @requestBody({
      description: 'Forgot password payload',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              newPassword: { type: 'string' },
            },
            required: ['username', 'newPassword'],
          },
        },
      },
    })
    body: { username: string; newPassword: string },
  ): Promise<{ success: boolean; message: string }> {

    console.log(`[forgot-password] 用户 ${body.username} 请求重置密码`);

    // 1. 查找用户
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: body.username },
    });

    if (!employee) {
      throw Object.assign(new Error('该工号不存在'), { statusCode: 400 });
    }

    // 2. 校验新密码长度
    if (!body.newPassword || body.newPassword.length < 6) {
      throw Object.assign(new Error('新密码长度不能少于6位'), { statusCode: 400 });
    }

    // 3. 哈希新密码并更新
    const hashedNewPassword = await hashPassword(body.newPassword);
    await this.employeeRepository.updateById(body.username, {
      password: hashedNewPassword,
    });

    console.log(`[forgot-password] 用户 ${body.username} 密码重置成功`);

    return { success: true, message: '密码重置成功' };
  }

  /**
   * POST /hash-password （工具端点）
   */
  @post('/hash-password')
  @response(200, {
    description: 'Hash a plain-text password (utility endpoint)',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async hashPwd(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { password: { type: 'string' } },
            required: ['password'],
          },
        },
      },
    })
    body: { password: string },
  ) {
    const hashed = await hashPassword(body.password);
    return { hashedPassword: hashed };
  }
}
```

---

### 📄 `src/controllers/department.controller.ts`

```typescript
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Department} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository : DepartmentRepository,
  ) {}

  @post('/departments')
  @response(200, {
    description: 'Department model instance',
    content: {'application/json': {schema: getModelSchemaRef(Department)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {
            title: 'NewDepartment',
            
          }),
        },
      },
    })
    department: Department,
  ): Promise<Department> {
    return this.departmentRepository.create(department);
  }

  @get('/departments/count')
  @response(200, {
    description: 'Department model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.count(where);
  }

  @get('/departments')
  @response(200, {
    description: 'Array of Department model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Department, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Department) filter?: Filter<Department>,
  ): Promise<Department[]> {
    return this.departmentRepository.find(filter);
  }

  @patch('/departments')
  @response(200, {
    description: 'Department PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
    @param.where(Department) where?: Where<Department>,
  ): Promise<Count> {
    return this.departmentRepository.updateAll(department, where);
  }

  @get('/departments/{id}')
  @response(200, {
    description: 'Department model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Department, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Department, {exclude: 'where'}) filter?: FilterExcludingWhere<Department>
  ): Promise<Department> {
    return this.departmentRepository.findById(id, filter);
  }

  @patch('/departments/{id}')
  @response(204, {
    description: 'Department PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Department, {partial: true}),
        },
      },
    })
    department: Department,
  ): Promise<void> {
    await this.departmentRepository.updateById(id, department);
  }

  @put('/departments/{id}')
  @response(204, {
    description: 'Department PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() department: Department,
  ): Promise<void> {
    await this.departmentRepository.replaceById(id, department);
  }

  @del('/departments/{id}')
  @response(204, {
    description: 'Department DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.departmentRepository.deleteById(id);
  }
}
```

---

### 📄 `src/controllers/employee.controller.ts`

```typescript
import {
  Count, CountSchema, Filter, FilterExcludingWhere,
  repository, Where,
} from '@loopback/repository';
import {
  post, param, get, getModelSchemaRef, patch, put, del,
  requestBody, response,
} from '@loopback/rest';
import { Employee } from '../models';
import { EmployeeRepository } from '../repositories';
import { hashPassword } from '../services/hash.service';

export class EmployeeControllerController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
  ) { }

  @post('/employees')
  @response(200, {
    description: 'Employee model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Employee) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, { title: 'NewEmployee' }),
        },
      },
    })
    employee: Employee,
  ): Promise<Employee> {
    // ★ 创建时自动哈希密码
    if (employee.password) {
      employee.password = await hashPassword(employee.password);
    }

    console.log('========= POST /employees =========');
    const result = await this.employeeRepository.create(employee);
    console.log('========= 创建成功 =========');
    return result;
  }

  @get('/employees/count')
  @response(200, {
    description: 'Employee model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Employee) where?: Where<Employee>,
  ): Promise<Count> {
    return this.employeeRepository.count(where);
  }

  @get('/employees')
  @response(200, {
    description: 'Array of Employee model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Employee, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Employee) filter?: Filter<Employee>,
  ): Promise<Employee[]> {
    return this.employeeRepository.find(filter);
  }

  @patch('/employees')
  @response(200, {
    description: 'Employee PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, { partial: true }),
        },
      },
    })
    employee: Employee,
    @param.where(Employee) where?: Where<Employee>,
  ): Promise<Count> {
    // ★ 批量更新也要哈希
    if (employee.password) {
      employee.password = await hashPassword(employee.password);
    }
    return this.employeeRepository.updateAll(employee, where);
  }

  @get('/employees/{id}')
  @response(200, {
    description: 'Employee model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Employee, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Employee, { exclude: 'where' })
    filter?: FilterExcludingWhere<Employee>,
  ): Promise<Employee> {
    return this.employeeRepository.findById(id, filter);
  }

  @patch('/employees/{id}')
  @response(204, { description: 'Employee PATCH success' })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employee, { partial: true }),
        },
      },
    })
    employee: Employee,
  ): Promise<void> {
    // ★ 单条更新时如果传了 password 则哈希
    if (employee.password) {
      employee.password = await hashPassword(employee.password);
    }
    await this.employeeRepository.updateById(id, employee);
  }

  @put('/employees/{id}')
  @response(204, { description: 'Employee PUT success' })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() employee: Employee,
  ): Promise<void> {
    if (employee.password) {
      employee.password = await hashPassword(employee.password);
    }
    await this.employeeRepository.replaceById(id, employee);
  }

  @del('/employees/{id}')
  @response(204, { description: 'Employee DELETE success' })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.employeeRepository.deleteById(id);
  }
}
```

---

### 📄 `src/controllers/index.ts`

```typescript
export * from './ping.controller';
export * from './employee.controller';
export * from './department.controller';
export * from './plant.controller';
export * from './region.controller';
export * from './role.controller';
```

---

### 📄 `src/controllers/ping.controller.ts`

```typescript
import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
```

---

### 📄 `src/controllers/plant.controller.ts`

```typescript
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Plant} from '../models';
import {PlantRepository} from '../repositories';

export class PlantController {
  constructor(
    @repository(PlantRepository)
    public plantRepository : PlantRepository,
  ) {}

  @post('/plants')
  @response(200, {
    description: 'Plant model instance',
    content: {'application/json': {schema: getModelSchemaRef(Plant)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plant, {
            title: 'NewPlant',
            
          }),
        },
      },
    })
    plant: Plant,
  ): Promise<Plant> {
    return this.plantRepository.create(plant);
  }

  @get('/plants/count')
  @response(200, {
    description: 'Plant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Plant) where?: Where<Plant>,
  ): Promise<Count> {
    return this.plantRepository.count(where);
  }

  @get('/plants')
  @response(200, {
    description: 'Array of Plant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Plant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Plant) filter?: Filter<Plant>,
  ): Promise<Plant[]> {
    return this.plantRepository.find(filter);
  }

  @patch('/plants')
  @response(200, {
    description: 'Plant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plant, {partial: true}),
        },
      },
    })
    plant: Plant,
    @param.where(Plant) where?: Where<Plant>,
  ): Promise<Count> {
    return this.plantRepository.updateAll(plant, where);
  }

  @get('/plants/{id}')
  @response(200, {
    description: 'Plant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Plant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Plant, {exclude: 'where'}) filter?: FilterExcludingWhere<Plant>
  ): Promise<Plant> {
    return this.plantRepository.findById(id, filter);
  }

  @patch('/plants/{id}')
  @response(204, {
    description: 'Plant PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plant, {partial: true}),
        },
      },
    })
    plant: Plant,
  ): Promise<void> {
    await this.plantRepository.updateById(id, plant);
  }

  @put('/plants/{id}')
  @response(204, {
    description: 'Plant PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() plant: Plant,
  ): Promise<void> {
    await this.plantRepository.replaceById(id, plant);
  }

  @del('/plants/{id}')
  @response(204, {
    description: 'Plant DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.plantRepository.deleteById(id);
  }
}
```

---

### 📄 `src/controllers/region.controller.ts`

```typescript
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Region} from '../models';
import {RegionRepository} from '../repositories';

export class RegionController {
  constructor(
    @repository(RegionRepository)
    public regionRepository : RegionRepository,
  ) {}

  @post('/regions')
  @response(200, {
    description: 'Region model instance',
    content: {'application/json': {schema: getModelSchemaRef(Region)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {
            title: 'NewRegion',
            
          }),
        },
      },
    })
    region: Region,
  ): Promise<Region> {
    return this.regionRepository.create(region);
  }

  @get('/regions/count')
  @response(200, {
    description: 'Region model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Region) where?: Where<Region>,
  ): Promise<Count> {
    return this.regionRepository.count(where);
  }

  @get('/regions')
  @response(200, {
    description: 'Array of Region model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Region, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Region) filter?: Filter<Region>,
  ): Promise<Region[]> {
    return this.regionRepository.find(filter);
  }

  @patch('/regions')
  @response(200, {
    description: 'Region PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {partial: true}),
        },
      },
    })
    region: Region,
    @param.where(Region) where?: Where<Region>,
  ): Promise<Count> {
    return this.regionRepository.updateAll(region, where);
  }

  @get('/regions/{id}')
  @response(200, {
    description: 'Region model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Region, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Region, {exclude: 'where'}) filter?: FilterExcludingWhere<Region>
  ): Promise<Region> {
    return this.regionRepository.findById(id, filter);
  }

  @patch('/regions/{id}')
  @response(204, {
    description: 'Region PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {partial: true}),
        },
      },
    })
    region: Region,
  ): Promise<void> {
    await this.regionRepository.updateById(id, region);
  }

  @put('/regions/{id}')
  @response(204, {
    description: 'Region PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() region: Region,
  ): Promise<void> {
    await this.regionRepository.replaceById(id, region);
  }

  @del('/regions/{id}')
  @response(204, {
    description: 'Region DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.regionRepository.deleteById(id);
  }
}
```

---

### 📄 `src/controllers/role.controller.ts`

```typescript
import { inject } from '@loopback/core';
import {
  Count, CountSchema, Filter, FilterExcludingWhere,
  repository, Where,
} from '@loopback/repository';
import {
  post, param, get, getModelSchemaRef, patch, put, del,
  requestBody, response,
  RestBindings, Request,
} from '@loopback/rest';
import { Role } from '../models';
import { RoleRepository, EmployeeRepository } from '../repositories';
import { CurrentUserProfile } from '../interceptors/auth.interceptor';

export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    // ★ Task 5 新增：注入 HTTP Request 以获取当前用户信息
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
  ) { }

  // ==================== ★ 工具方法 ====================

  /** 从 request 获取当前用户信息（由拦截器在 Task 4 中挂载） */
  private getCurrentUser(): CurrentUserProfile | undefined {
    return (this.request as any).currentUser;
  }

  /** 断言当前用户是超级管理员，否则抛出 403 */
  private assertSuperAdmin(): void {
    const user = this.getCurrentUser();
    if (!user?.is_super_admin) {
      throw Object.assign(
        new Error('仅超级管理员可执行此操作'),
        { statusCode: 403 },
      );
    }
  }

  // ==================== ★ Task 5: 写操作 — 需超级管理员权限 ====================

  @post('/roles')
  @response(200, {
    description: 'Role model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Role) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { title: 'NewRole' }),
        },
      },
    })
    role: Role,
  ): Promise<Role> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // 自动分配 role_id（原有逻辑）
    if (role.role_id == null) {
      const maxRoles = await this.roleRepository.find({
        order: ['role_id DESC'],
        limit: 1,
      });
      role.role_id = maxRoles.length > 0 ? (maxRoles[0].role_id ?? 0) + 1 : 1;
    }
    return this.roleRepository.create(role);
  }

  // ==================== ★ Task 6: 读操作 — 按身份过滤 ====================

  @get('/roles/count')
  @response(200, {
    description: 'Role model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能统计自己角色
    if (!user?.is_super_admin) {
      where = { role_id: user?.role_id };
    }
    return this.roleRepository.count(where);
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能查看自己的角色
    if (!user?.is_super_admin) {
      const myRoleId = user?.role_id;
      if (myRoleId == null) return [];
      filter = { ...(filter || {}), where: { role_id: myRoleId } };
    }
    return this.roleRepository.find(filter);
  }

  @get('/roles/{id}')
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Role, { exclude: 'where' }) filter?: FilterExcludingWhere<Role>,
  ): Promise<Role> {
    const user = this.getCurrentUser();
    // ★ 非超级管理员只能查看自己的角色
    if (!user?.is_super_admin && user?.role_id !== id) {
      throw Object.assign(
        new Error('您只能查看自己的角色'),
        { statusCode: 403 },
      );
    }
    return this.roleRepository.findById(id, filter);
  }

  // ==================== ★ Task 5: 批量更新 — 需超级管理员 ====================

  @patch('/roles')
  @response(200, {
    description: 'Role PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();
    return this.roleRepository.updateAll(role, where);
  }

  // ==================== ★ Task 5 + Task 7: 单条更新 — 含防自锁 ====================

  @patch('/roles/{id}')
  @response(204, {
    description: 'Role PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, { partial: true }),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 防自锁 — 不允许取消唯一超级管理员的 is_super_admin
    if (role.is_super_admin === false) {
      const existingRole = await this.roleRepository.findById(id);
      if (existingRole.is_super_admin) {
        const superAdminCount = await this.roleRepository.count({ is_super_admin: true });
        if (superAdminCount.count <= 1) {
          throw Object.assign(
            new Error('不可取消：当前是系统中唯一的超级管理员角色'),
            { statusCode: 400 },
          );
        }
      }
    }

    await this.roleRepository.updateById(id, role);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() role: Role,
  ): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 防自锁
    if (role.is_super_admin === false) {
      const existingRole = await this.roleRepository.findById(id);
      if (existingRole.is_super_admin) {
        const superAdminCount = await this.roleRepository.count({ is_super_admin: true });
        if (superAdminCount.count <= 1) {
          throw Object.assign(
            new Error('不可取消：当前是系统中唯一的超级管理员角色'),
            { statusCode: 400 },
          );
        }
      }
    }

    await this.roleRepository.replaceById(id, role);
  }

  // ==================== ★ Task 5 + Task 7: 删除 — 超管鉴权 + 禁删超管角色 ====================

  @del('/roles/{id}')
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    // ★ 超级管理员鉴权
    this.assertSuperAdmin();

    // ★ Task 7: 不允许删除超级管理员角色
    const role = await this.roleRepository.findById(id);
    if (role.is_super_admin) {
      throw Object.assign(
        new Error('不可删除超级管理员角色'),
        { statusCode: 400 },
      );
    }

    // 原有逻辑：检查是否有员工绑定
    const empCount = await this.employeeRepository.count({ role_id: id });
    if (empCount.count > 0) {
      throw Object.assign(
        new Error(`不可删除，已有 ${empCount.count} 位用户绑定该角色，请先解绑再删除`),
        { statusCode: 400 },
      );
    }

    await this.roleRepository.deleteById(id);
  }
}
```

---

### 📄 `src/datasources/demo.datasource.ts`

```typescript
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
// const config = {
//   name: 'demo',
//   connector: 'sqlite3',
//   // 指定 SQLite 数据库文件的存放路径。
//   // 如果你想使用纯内存数据库，可以将其设为 file: ':memory:'
//   file: './data/demo.sqlite'
// };
const config = {
  name: 'Demo',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'Demo'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DemoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Demo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Demo', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
```

---

### 📄 `src/datasources/index.ts`

```typescript
export * from './demo.datasource';
```

---

### 📄 `src/index.ts`

```typescript
import {ApplicationConfig, BackendDemoApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new BackendDemoApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST || '127.0.0.1',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
```

---

### 📄 `src/interceptors/auth.interceptor.ts`

```typescript
import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  bind,
  asGlobalInterceptor,
} from '@loopback/core';
import { RestBindings, Request } from '@loopback/rest';
import { verifyToken } from '../services/jwt.service';

/**
 * ★ Task 4: 用户信息接口，用于在请求上下文中传递当前用户
 */
export interface CurrentUserProfile {
  employee_id: string;
  name?: string;
  role_id?: number;
  is_super_admin?: boolean;
}

@bind(asGlobalInterceptor('auth'))
export class AuthInterceptor implements Provider<Interceptor> {
  value(): Interceptor {
    return this.intercept.bind(this);
  }

  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ): Promise<InvocationResult> {
    console.log("拦截器被调用")
    let req: Request | undefined;
    try {
      req = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
    } catch {
      // 非 REST 调用时获取不到 request，直接放行
      return next();
    }

    // 如果拿不到 request 对象（非 HTTP 请求触发），直接放行
    if (!req) {
      return next();
    }

    console.log(`[AuthInterceptor] ${req.method} ${req.path}`);

    // 白名单路径
    const publicPaths = ['/login', '/ping', '/explorer', '/hash-password', '/openapi.json', '/forgot-password'];
    const isPublic = publicPaths.some(p => req!.path.startsWith(p));

    // 静态首页也放行
    if (req.path === '/' || req.path === '') {
      return next();
    }

    if (!isPublic) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw Object.assign(new Error('未提供有效的认证令牌'), {
          statusCode: 401,
        });
      }

      const token = authHeader.slice(7);
      try {
        const decoded = verifyToken(token);
        console.log('[AuthInterceptor] JWT 验证通过, 用户:', decoded.employee_id);

        // ★ Task 4 新增：将解码后的用户信息挂载到 request 对象上
        (req as any).currentUser = {
          employee_id: decoded.employee_id,
          name: decoded.name,
          role_id: decoded.role_id,
          is_super_admin: decoded.is_super_admin ?? false,
        } as CurrentUserProfile;

      } catch (err) {
        throw Object.assign(new Error('令牌无效或已过期'), {
          statusCode: 401,
        });
      }
    }

    return next();
  }
}
```

---

### 📄 `src/interceptors/index.ts`

```typescript
export * from './auth.interceptor';
```

---

### 📄 `src/migrate-passwords.ts`

```typescript
import { BackendDemoApplication } from './application';
import { EmployeeRepository } from './repositories';
import { hashPassword } from './services/hash.service';

async function migratePasswords() {
  const app = new BackendDemoApplication();
  await app.boot();
  await app.start();

  const employeeRepo = await app.getRepository(EmployeeRepository);
  const employees = await employeeRepo.find();

  let count = 0;
  for (const emp of employees) {
    // 跳过已经是 bcrypt 格式的密码（bcrypt 哈希以 $2a$ 或 $2b$ 开头）
    if (emp.password && !emp.password.startsWith('$2')) {
      const hashed = await hashPassword(emp.password);
      await employeeRepo.updateById(emp.employee_id, { password: hashed });
      count++;
      console.log(`✅ 已哈希: ${emp.employee_id}`);
    }
  }

  console.log(`\n迁移完成，共处理 ${count} 条记录`);
  await app.stop();
  process.exit(0);
}

migratePasswords().catch(err => {
  console.error('迁移失败:', err);
  process.exit(1);
});
```

---

### 📄 `src/migrate.ts`

```typescript
import {BackendDemoApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new BackendDemoApplication();
  await app.boot();
  await app.migrateSchema({existingSchema});

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
```

---

### 📄 `src/models/department.model.ts`

```typescript
import { Entity, model, property } from '@loopback/repository';

@model()
export class Department extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  dept_id: number;

  @property({
    type: 'string',
  })
  dept_code?: string;

  @property({
    type: 'string',
  })
  dept_desc?: string;
  @property({
    type: 'string',
  })
  dept_desc_a?: string;

  constructor(data?: Partial<Department>) {
    super(data);
  }
}

export interface DepartmentRelations {
  // describe navigational properties here
}

export type DepartmentWithRelations = Department & DepartmentRelations;
```

---

### 📄 `src/models/employee.model.ts`

```typescript
import { Entity, model, property } from '@loopback/repository';

@model()
export class Employee extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  employee_id: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  name_a?: string;

  @property({
    type: 'boolean',
  })
  Sex?: boolean;


  @property({
    type: 'string',
  })
  dept_desc?: string;

  @property({
    type: 'string',
  })
  plant_name?: string;

  @property({
    type: 'string',
  })
  region_name?: string;

  @property({
    type: 'number',
  })
  role_id?: number;

  @property({
    type: 'date',
  })
  hire_date?: string;

  @property({
    type: 'date',
  })
  resin_date?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'boolean',
  })
  hasaccess?: boolean;


  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
```

---

### 📄 `src/models/index.ts`

```typescript
export * from './employee.model';
export * from './department.model';
export * from './plant.model';
export * from './region.model';
export * from './role.model';
```

---

### 📄 `src/models/plant.model.ts`

```typescript
import { Entity, model, property } from '@loopback/repository';

@model()
export class Plant extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  plant_id?: number;
  @property({
    type: 'string',
  })
  site?: string;

  @property({
    type: 'string',
  })
  plant_name?: string;



  constructor(data?: Partial<Plant>) {
    super(data);
  }
}

export interface PlantRelations {
  // describe navigational properties here
}

export type PlantWithRelations = Plant & PlantRelations;
```

---

### 📄 `src/models/region.model.ts`

```typescript
import { Entity, model, property } from '@loopback/repository';

@model()
export class Region extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  region_id?: number;

  @property({
    type: 'string',
  })
  region_name?: string;

  @property({
    type: 'number',
  })
  longitude?: number;

  @property({
    type: 'number',
  })
  latitude?: number;


  @property({
    type: 'string',
  })
  region_name_cn?: string;

  constructor(data?: Partial<Region>) {
    super(data);
  }
}

export interface RegionRelations {
  // describe navigational properties here
}

export type RegionWithRelations = Region & RegionRelations;
```

---

### 📄 `src/models/role.model.ts`

```typescript
import { Entity, model, property } from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  role_id?: number;

  @property({
    type: 'string',
  })
  role_name?: string;

  @property({
    type: 'number',
  })
  home_page_auth?: number;

  @property({
    type: 'number',
  })
  report_page_auth?: number;

  @property({
    type: 'number',
  })
  auth_page_auth?: number;

  @property({
    type: 'string',
  })
  description?: string;

  // ★ Task 2 新增：超级管理员标记
  @property({
    type: 'boolean',
    default: false,
  })
  is_super_admin?: boolean;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
```

---

### 📄 `src/openapi-spec.ts`

```typescript
import {ApplicationConfig} from '@loopback/core';
import {BackendDemoApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[2] ?? '';
  const app = new BackendDemoApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err);
  process.exit(1);
});
```

---

### 📄 `src/repositories/department.repository.ts`

```typescript
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Department, DepartmentRelations} from '../models';

export class DepartmentRepository extends DefaultCrudRepository<
  Department,
  typeof Department.prototype.dept_id,
  DepartmentRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Department, dataSource);
  }
}
```

---

### 📄 `src/repositories/employee.repository.ts`

```typescript
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Employee, EmployeeRelations} from '../models';

export class EmployeeRepository extends DefaultCrudRepository<
  Employee,
  typeof Employee.prototype.employee_id,
  EmployeeRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Employee, dataSource);
  }
}
```

---

### 📄 `src/repositories/index.ts`

```typescript
export * from './department.repository';
export * from './employee.repository';
export * from './plant.repository';
export * from './region.repository';
export * from './role.repository';
```

---

### 📄 `src/repositories/plant.repository.ts`

```typescript
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Plant, PlantRelations} from '../models';

export class PlantRepository extends DefaultCrudRepository<
  Plant,
  typeof Plant.prototype.plant_id,
  PlantRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Plant, dataSource);
  }
}
```

---

### 📄 `src/repositories/region.repository.ts`

```typescript
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Region, RegionRelations} from '../models';

export class RegionRepository extends DefaultCrudRepository<
  Region,
  typeof Region.prototype.region_id,
  RegionRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Region, dataSource);
  }
}
```

---

### 📄 `src/repositories/role.repository.ts`

```typescript
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DemoDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.role_id,
  RoleRelations
> {
  constructor(
    @inject('datasources.Demo') dataSource: DemoDataSource,
  ) {
    super(Role, dataSource);
  }
}
```

---

### 📄 `src/sequence.ts`

```typescript
import {MiddlewareSequence} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {}
```

---

### 📄 `src/services/hash.service.ts`

```typescript
import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * 将明文密码哈希化
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 比对明文密码与哈希值
 */
export async function comparePassword(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}
```

---

### 📄 `src/services/index.ts`

```typescript
export * from './hash.service';
export * from './jwt.service';
```

---

### 📄 `src/services/jwt.service.ts`

```typescript
import * as jwt from 'jsonwebtoken';

// ★ 生产环境请使用环境变量，切勿硬编码
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_CHANGE_ME';
const JWT_EXPIRES_IN = '8h'; // token 有效期

export interface JwtPayload {
  employee_id: string;
  name?: string;
  role_id?: number;
  is_super_admin?: boolean;   // ★ Task 3 新增
  [key: string]: unknown;
}

/**
 * 签发 JWT
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证并解析 JWT，失败则抛出异常
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
```

---

### 📄 `src/__tests__/acceptance/home-page.acceptance.ts`

```typescript
import {Client} from '@loopback/testlab';
import {BackendDemoApplication} from '../..';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let app: BackendDemoApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
```

---

### 📄 `src/__tests__/acceptance/ping.controller.acceptance.ts`

```typescript
import {Client, expect} from '@loopback/testlab';
import {BackendDemoApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: BackendDemoApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
```

---

### 📄 `src/__tests__/acceptance/test-helper.ts`

```typescript
import {BackendDemoApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new BackendDemoApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: BackendDemoApplication;
  client: Client;
}
```

---

### 📄 `tsconfig.json`

```json
{
  "$schema": "http://json.schemastore.org/tsconfig",
  "extends": "@loopback/build/config/tsconfig.common.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

---

