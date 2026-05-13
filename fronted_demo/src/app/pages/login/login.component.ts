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
import { NzMessageService } from 'ng-zorro-antd/message';  // ★ 改用 NzMessage

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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false;
  isLoading = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,  // ★ 注入消息服务
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
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const { username, password } = this.validateForm.value;

      this.authService.login({ username, password }).subscribe({
        next: () => {
          this.isLoading = false;
          this.message.success('登录成功');
          // ★ token 已在 AuthService.login() 的 tap 中自动存储
          this.router.navigate(['/default/welcome']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('登录失败：', err);
          // ★ 使用 NzMessage 替代 alert
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
}
