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
