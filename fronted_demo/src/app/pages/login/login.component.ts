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
    NzCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false; // 控制密码是否可见
  isLoading = false;       // 控制按钮的加载状态

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 初始化表单并设置必填校验
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    // 检查表单是否有效
    if (this.validateForm.valid) {
      this.isLoading = true;
      const { username, password } = this.validateForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('登录成功，返回：', res);
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
          }
          this.router.navigate(['/default/welcome']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('登录失败：', err);
          alert('登录失败，请检查用户名或密码');
        }
      });

    } else {
      // 触发所有输入框的错误提示
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
