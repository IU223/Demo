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
