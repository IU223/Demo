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
