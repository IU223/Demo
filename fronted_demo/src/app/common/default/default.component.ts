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
