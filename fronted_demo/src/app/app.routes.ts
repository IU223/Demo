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
