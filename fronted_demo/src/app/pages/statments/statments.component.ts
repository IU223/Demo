import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

import { EmployeeControlService } from '../../services/employee-controller.service';
import { EmployeeWithRelations } from '../../sdk/models';

@Component({
  selector: 'app-employee',
  standalone: true,
  // ★ 引入必需的模块：FormsModule, NzDatePickerModule, NzButtonModule
  imports: [CommonModule, FormsModule, NzTableModule, NzDatePickerModule, NzButtonModule],
  template: `
    <!-- ★ 新增：时间查询工具栏 -->
    <div style="margin-bottom: 16px; display: flex; gap: 8px; align-items: center;">
      <label>入职时间：</label>
      <nz-range-picker [(ngModel)]="filterDateRange" nzFormat="yyyy-MM-dd"></nz-range-picker>
      <button nz-button nzType="primary" (click)="loadEmployees()">查询</button>
      <button nz-button nzType="default" (click)="reset()">重置</button>
    </div>

    <!-- 数据表格 -->
    <nz-table #basicTable [nzData]="employees" [nzLoading]="loading">
      <thead>
        <tr>
          <th>工号</th>
          <th>姓名</th>
          <th>部门</th>
          <th>入职时间</th>
        </tr>
      </thead>
      <tbody>
        <tr \*ngFor="let data of basicTable.data">
          <td>{{ data.employee_id }}</td>
          <td>{{ data.name }}</td>
          <td>{{ data.dept_desc }}</td>
          <td>{{ data.hire_date | date:'yyyy-MM-dd' }}</td>
        </tr>
      </tbody>
    </nz-table>
  `
})
export class EmployeeComponent implements OnInit {
  employees: EmployeeWithRelations[] = [];
  loading = false;

  // ★ 新增：用于双向绑定时间选择器的数组 [开始时间, 结束时间]
  filterDateRange: Date[] = [];

  constructor(
    private employeeControlService: EmployeeControlService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * 重置查询条件
   */
  reset(): void {
    this.filterDateRange = [];
    this.loadEmployees();
  }

  /**
   * 工具方法：格式化时间为 YYYY-MM-DD
   */
  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  /**
   * 调用服务查询员工数据（含时间过滤）
   */
  loadEmployees(): void {
    this.loading = true;

    // 1. 初始化基础 where 条件
    const where: any = {
      // status: true // 默认只查在职
    };

    // 2. ★ 判断是否选择了时间范围，若有则加入 between 查询
    if (this.filterDateRange && this.filterDateRange.length === 2) {
      const start = this.formatDate(this.filterDateRange[0]) + 'T00:00:00';
      const end = this.formatDate(this.filterDateRange[1]) + 'T23:59:59'; // 包含当天结束

      // LoopBack 4 语法：字段名: { between: [start, end] }
      where.hire_date = {
        between: [start, end]
      };
    }

    // 3. 构建完整的 filter 对象
    const filter = {
      where: where,
      limit: 10,
      skip: 0,
      order: ['hire_date DESC']
    };
    console.log('查询条件 filter:', JSON.stringify(filter));
    // 4. 发起请求
    this.employeeControlService.getEmployees(JSON.stringify(filter)).subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('获取员工数据失败:', err);
        this.message.error('加载失败，请检查网络！');
        this.loading = false;
      }
    });
  }
}
