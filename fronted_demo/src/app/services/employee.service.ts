// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Employee, EmployeeFilter, EmployeeResponse, SelectOption, RoleOption } from '../models/employee';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;
  private apiUrlPlant = `${environment.apiUrl}/plants`;
  private apiUrlRegion = `${environment.apiUrl}/regions`;
  private apiUrlDept = `${environment.apiUrl}/departments`;
  private apiUrlRole = `${environment.apiUrl}/roles`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }
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
    if (filter?.startDate && filter?.endDate) {
      const start = this.formatDate(filter.startDate); // 仅日期部分
      const end = this.formatDate(filter.endDate) + 'T23:59:59'; // 包含当天结束时间
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

  createEmployees(employees: Partial<Employee>[]): Observable<Employee[]> {
    const requests = employees.map(emp => this.createEmployee(emp));
    return forkJoin(requests);
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<void> {
    return this.ensureNotSuperAdmin(id).pipe(
      switchMap(() => this.http.patch<void>(`${this.apiUrl}/${id}`, employee)),
    );
  }


  deleteEmployees(ids: string[]): Observable<{ count: number }> {
    if (!ids || ids.length === 0) {
      return of({ count: 0 });
    }
    return this.ensureNotSuperAdminBatch(ids).pipe(
      switchMap(() => {
        const where = JSON.stringify({ employee_id: { inq: ids } });
        const params = new HttpParams().set('where', where);
        return this.http.patch<{ count: number }>(
          `${this.apiUrl}`, { status: false, resin_date: new Date(), hasaccess: false }, { params },
        );
      }),
    );
  }

  /**
   * 构造与后端 HTTP 错误兼容的错误对象，确保 message.error() 能正确提取消息
   */
  private static forbiddenError(msg: string): Error {
    const err = new Error(msg);
    (err as any).error = { error: { message: msg, statusCode: 403 } };
    (err as any).statusCode = 403;
    return err;
  }

  /** 检查单个目标：若当前用户非超管且目标是超管则拒绝 */
  private ensureNotSuperAdmin(targetId: string): Observable<void> {
    if (this.authService.isSuperAdmin()) {
      return of(undefined);
    }
    return this.http.get<Employee>(`${this.apiUrl}/${targetId}`).pipe(
      switchMap(emp => {
        if (emp.role_id == null) return of(undefined);
        return this.http
          .get<{ is_super_admin?: boolean }>(`${environment.apiUrl}/roles/${emp.role_id}`)
          .pipe(
            map(role => {
              if (role.is_super_admin) {
                throw EmployeeService.forbiddenError('无权修改超级管理员账户');
              }
            }),
            catchError(err => {
              // 若 catch 到的是我们自己抛出的 forbiddenError，继续向上传递
              if (err?.error?.error?.statusCode === 403) throw err;
              // 否则是联网查询失败，降级放行（避免误伤）
              console.warn('[EmployeeService] 超管保护查询失败，降级放行:', err);
              return of(undefined);
            }),
          );
      }),
      catchError(err => {
        if (err?.error?.error?.statusCode === 403) throw err;
        console.warn('[EmployeeService] 获取目标员工失败，降级放行:', err);
        return of(undefined);
      }),
    );
  }

  /** 检查批量目标：若当前用户非超管且任一目标是超管则拒绝 */
  private ensureNotSuperAdminBatch(ids: string[]): Observable<void> {
    if (this.authService.isSuperAdmin()) {
      return of(undefined);
    }
    // ★ 修复：where 是对象，不是预序列化的 JSON 字符串
    const filter = { where: { employee_id: { inq: ids } } };
    const params = new HttpParams().set('filter', JSON.stringify(filter));
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(resp => {
        const employees: Employee[] = Array.isArray(resp) ? resp : (resp?.data || []);
        const roleIds = [...new Set(
          employees.map(e => e.role_id).filter((id): id is number => id != null),
        )];
        return roleIds;
      }),
      switchMap(roleIds => {
        if (roleIds.length === 0) return of(undefined);
        const roleFilter = { where: { role_id: { inq: roleIds }, is_super_admin: true } };
        const roleParams = new HttpParams().set('filter', JSON.stringify(roleFilter));
        return this.http.get<any>(`${environment.apiUrl}/roles`, { params: roleParams }).pipe(
          map(resp => {
            const roles: Array<{ is_super_admin?: boolean }> =
              Array.isArray(resp) ? resp : (resp?.data || []);
            if (roles.length > 0) {
              throw EmployeeService.forbiddenError('批量操作包含超级管理员账户，无权修改');
            }
          }),
        );
      }),
      catchError(err => {
        if (err?.error?.error?.statusCode === 403) throw err;
        console.warn('[EmployeeService] 超管保护批量查询失败，降级放行:', err);
        return of(undefined);
      }),
    );
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
