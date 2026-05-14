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
