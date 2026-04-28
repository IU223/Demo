// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeFilter, EmployeeResponse, SelectOption } from '../models/employee';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;
  private apiUrlPlant = `${environment.apiUrl}/plant`;
  private apiUrlRegion = `${environment.apiUrl}/region`;

  constructor(private http: HttpClient) { }

  /**
   * 获取员工列表
   */
  getEmployees(filter?: EmployeeFilter): Observable<EmployeeResponse> {
    let params = new HttpParams();

    // 构建 LoopBack 4 filter
    const loopbackFilter: any = {
      where: {},
      skip: filter?.skip || 0,
      limit: filter?.limit || 10,
      order: ['hire_date DESC']
    };

    // 日期范围筛选
    if (filter?.startDate || filter?.endDate) {
      loopbackFilter.where.hire_date = {};
      if (filter.startDate) {
        loopbackFilter.where.hire_date.gte = filter.startDate.toISOString().split('T')[0];
      }
      if (filter.endDate) {
        loopbackFilter.where.hire_date.lte = filter.endDate.toISOString().split('T')[0];
      }
    }

    // 搜索文本（工号、姓名、部门）
    if (filter?.searchText && filter.searchText.trim()) {
      loopbackFilter.where.or = [
        { employee_id: { like: `%${filter.searchText}%` } },
        { name: { like: `%${filter.searchText}%` } },
      ];
    }

    params = params.set('filter', JSON.stringify(loopbackFilter));

    // 添加地区和厂别筛选（通过关联查询）
    if (filter?.area && filter.area !== '1') {
      params = params.set('area', filter.area);
    }
    if (filter?.factory && filter.factory !== '1') {
      params = params.set('factory', filter.factory);
    }

    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
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
   * 更新员工
   */
  updateEmployee(id: string, employee: Partial<Employee>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * 删除单个员工
   */
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * 批量删除员工
   */
  deleteEmployees(ids: string[]): Observable<{ count: number }> {
    return this.http.delete<{ count: number }>(`${this.apiUrl}/batch`, {
      body: { ids }
    });
  }

  /**
   * 获取地区列表
   */
  getAreas(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(`${this.apiUrlRegion}`);
  }

  /**
   * 获取厂别列表
   */
  getFactories(area?: string): Observable<SelectOption[]> {
    let params = new HttpParams();
    if (area && area !== '1') {
      params = params.set('area', area);
    }
    return this.http.get<SelectOption[]>(`${this.apiUrlPlant}`, { params });
  }
}
