import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 引入 SDK 配置与生成的函数
import { ApiConfiguration } from '../sdk/api-configuration';
import {
  findEmployeeControllerController,
  findByIdEmployeeControllerController,
  createEmployeeControllerController,
  updateByIdEmployeeControllerController,
  deleteByIdEmployeeControllerController,
  countEmployeeControllerController,
  updateAllEmployeeControllerController,
  replaceByIdEmployeeControllerController
} from '../sdk/functions';

// 引入 SDK 生成的类型定义
import {
  Employee,
  EmployeePartial,
  NewEmployee,
  EmployeeWithRelations,
  LoopbackCount
} from '../sdk/models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeControlService {
  constructor(
    private http: HttpClient,
    private config: ApiConfiguration
  ) { }

  /**
   * 获取员工列表 (支持过滤)
   * @param filter LoopBack 格式的 filter 对象 (可包含 where, skip, limit, order 等)
   */
  getEmployees(filter?: any): Observable<EmployeeWithRelations[]> {
    return findEmployeeControllerController(this.http, this.config.rootUrl, { filter })
      .pipe(map(response => response.body));
  }

  /**
   * 获取员工总数 (支持条件)
   * @param where LoopBack 格式的 where 条件对象
   */
  getEmployeeCount(where?: any): Observable<number> {
    return countEmployeeControllerController(this.http, this.config.rootUrl, { where })
      .pipe(map(response => response.body.count ?? 0));
  }

  /**
   * 根据 ID 获取员工详情
   * @param id 员工工号
   * @param filter 可选的 filter 对象
   */
  getEmployeeById(id: string, filter?: any): Observable<EmployeeWithRelations> {
    return findByIdEmployeeControllerController(this.http, this.config.rootUrl, { id, filter })
      .pipe(map(response => response.body));
  }

  /**
   * 新增员工
   * @param employee 新员工数据
   */
  createEmployee(employee: NewEmployee): Observable<Employee> {
    return createEmployeeControllerController(this.http, this.config.rootUrl, { body: employee })
      .pipe(map(response => response.body));
  }

  /**
   * 局部更新员工信息 (PATCH)
   * @param id 员工工号
   * @param employee 需更新的字段数据
   */
  updateEmployee(id: string, employee: EmployeePartial): Observable<void> {
    return updateByIdEmployeeControllerController(this.http, this.config.rootUrl, { id, body: employee })
      .pipe(map(() => void 0));
  }

  /**
   * 替换员工完整信息 (PUT)
   * @param id 员工工号
   * @param employee 完整的员工数据
   */
  replaceEmployee(id: string, employee: Employee): Observable<void> {
    return replaceByIdEmployeeControllerController(this.http, this.config.rootUrl, { id, body: employee })
      .pipe(map(() => void 0));
  }

  /**
   * 删除员工
   * @param id 员工工号
   */
  deleteEmployee(id: string): Observable<void> {
    return deleteByIdEmployeeControllerController(this.http, this.config.rootUrl, { id })
      .pipe(map(() => void 0));
  }

  /**
   * 批量更新员工信息
   * @param where 更新条件
   * @param employee 需更新的字段数据
   */
  updateAllEmployees(where: any, employee: EmployeePartial): Observable<number> {
    return updateAllEmployeeControllerController(this.http, this.config.rootUrl, { where, body: employee })
      .pipe(map(response => response.body.count ?? 0));
  }
}
