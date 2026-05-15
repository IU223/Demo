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
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
  ) {
    this.initAddForm();
  }

  ngOnInit(): void {
    this.loadCurrentUserPermissions();
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
