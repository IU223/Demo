// report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';


import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeFilter, SelectOption } from '../../models/employee';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzMessageModule,
    NzModalModule,
    NzDividerModule,
    NzTagModule
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  // 筛选条件
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedArea: string = '1';
  selectedFactory: string = '1';
  searchText: string = '';

  // 分页
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // 表格数据
  listOfData: Employee[] = [];
  loading = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  // 下拉选项
  areaOptions: SelectOption[] = [{ label: '全部', value: '1' }];
  factoryOptions: SelectOption[] = [{ label: '全部', value: '1' }];

  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.loadAreas();
    this.loadFactories();
    this.loadData();
  }

  /**
   * 加载地区列表
   */
  loadAreas(): void {
    this.employeeService.getAreas().subscribe({
      next: (areas) => {
        this.areaOptions = areas;
      },
      error: (error) => {
        console.error('加载地区列表失败:', error);
      }
    });
  }

  /**
   * 加载厂别列表
   */
  loadFactories(area?: string): void {
    this.employeeService.getFactories(area).subscribe({
      next: (factories) => {
        this.factoryOptions = factories;
      },
      error: (error) => {
        console.error('加载厂别列表失败:', error);
      }
    });
  }

  /**
   * 地区变化时更新厂别列表
   */
  onAreaChange(area: string): void {
    this.selectedFactory = '1';
    this.loadFactories(area);
    this.onSearch();
  }

  /**
   * 加载数据
   */
  loadData(): void {
    this.loading = true;

    const filter: EmployeeFilter = {
      startDate: this.startDate,
      endDate: this.endDate,
      area: this.selectedArea,
      factory: this.selectedFactory,
      searchText: this.searchText,
      skip: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize
    };

    this.employeeService.getEmployees(filter).subscribe({
      next: (response) => {
        this.listOfData = response.data;
        this.total = response.total;
        this.loading = false;
        this.refreshCheckedStatus();
      },
      error: (error) => {
        console.error('加载数据失败:', error);
        this.message.error('加载数据失败，请稍后重试');
        this.loading = false;
      }
    });
  }

  /**
   * 搜索
   */
  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }
  /**
   * 重置筛选条件
   */
  onReset(): void {
    // 1. 清空绑定的模型值
    this.startDate = null;
    this.endDate = null;
    this.selectedArea = '1';  // 恢复为"全部"
    this.selectedFactory = '1'; // 恢复为"全部"
    this.searchText = '';

    // 2. 重新加载厂别列表（恢复默认状态）
    this.loadFactories();

    // 3. 触发搜索，加载全部数据
    this.onSearch();
  }

  /**
   * 分页变化
   */
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  /**
   * 删除选中项
   */
  onDelete(): void {
    if (this.setOfCheckedId.size === 0) {
      this.message.warning('请选择要删除的项');
      return;
    }

    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除选中的 ${this.setOfCheckedId.size} 条记录吗？此操作不可恢复。`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => {
        const ids = Array.from(this.setOfCheckedId);
        return this.employeeService.deleteEmployees(ids).toPromise().then(
          (result) => {
            this.message.success(`成功删除 ${result?.count || ids.length} 条记录`);
            this.setOfCheckedId.clear();
            this.loadData();
          },
          (error) => {
            console.error('删除失败:', error);
            this.message.error('删除失败，请稍后重试');
          }
        );
      }
    });
  }

  /**
   * 新增
   */
  onAdd(): void {
    // 打开新增对话框
    this.message.info('打开新增员工对话框');
    // TODO: 实现新增对话框
  }

  /**
   * 查看
   */
  onView(data: Employee): void {
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        console.log('员工详情:', employee);
        this.message.info(`查看员工: ${employee.name}`);
        // TODO: 打开查看对话框显示详细信息
      },
      error: (error) => {
        console.error('获取员工详情失败:', error);
        this.message.error('获取员工详情失败');
      }
    });
  }

  /**
   * 编辑
   */
  onEdit(data: Employee): void {
    console.log('编辑员工:', data);
    this.message.info(`编辑员工: ${data.name}`);
    // TODO: 打开编辑对话框
  }

  /**
   * 全选/取消全选
   */
  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item =>
      this.updateCheckedSet(item.employee_id, checked)
    );
    this.refreshCheckedStatus();
  }

  /**
   * 单选
   */
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  /**
   * 更新选中集合
   */
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  /**
   * 刷新选中状态
   */
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfData;
    this.checked = listOfEnabledData.length > 0 &&
      listOfEnabledData.every(item => this.setOfCheckedId.has(item.employee_id));
    this.indeterminate = listOfEnabledData.some(item => this.setOfCheckedId.has(item.employee_id)) &&
      !this.checked;
  }
}
