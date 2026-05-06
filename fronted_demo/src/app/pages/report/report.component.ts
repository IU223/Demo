import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeFilter, SelectOption, RoleOption } from '../../models/employee';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzMessageModule,
    NzModalModule,
    NzDividerModule,
    NzTagModule,
    NzFormModule,
    NzSwitchModule,
    NzRadioModule
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  // ===================== 筛选条件 =====================
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedArea: string = '1';
  selectedFactory: string = '1';
  searchText: string = '';

  // ===================== 分页 =====================
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // ===================== 表格数据 =====================
  listOfData: Employee[] = [];
  loading = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  // ===================== 筛选栏下拉选项（含"全部"） =====================
  areaOptions: SelectOption[] = [{ label: '全部', value: '1' }];
  factoryOptions: SelectOption[] = [{ label: '全部', value: '1' }];

  // ===================== 对话框 =====================
  isModalVisible = false;
  isEditMode = false;
  modalTitle = '新增';
  employeeForm!: FormGroup;
  submitting = false;
  currentEmployeeId: string = '';

  // ===================== 对话框下拉选项（不含"全部"） =====================
  modalAreaOptions: SelectOption[] = [];
  modalFactoryOptions: SelectOption[] = [];

  // ★ 部门选项 — 从 API 获取
  deptOptions: SelectOption[] = [];

  // ★ 角色选项 — 从 API 获取
  roleOptions: RoleOption[] = [];

  // ===================== 批量新增 =====================
  batchEmployees: any[] = [];
  currentBatchIndex: number = 0;

  constructor(
    private employeeService: EmployeeService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAreas();
    this.loadFactories();
    this.loadDepartments();   // ★ 初始化加载部门
    this.loadRoles();         // ★ 初始化加载角色
    this.loadData();
  }

  // ===================== 表单初始化 =====================

  private initForm(): void {
    this.employeeForm = this.fb.group({
      employee_id: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      password: ['123456'],
      name: ['', [Validators.required]],
      name_a: [''],
      Sex: [true],
      dept_desc: [null, [Validators.required]],
      region_name: [null, [Validators.required]],
      plant_name: [null, [Validators.required]],
      role_id: [null, [Validators.required]],
      hire_date: [new Date()],
      resin_date: [null],
      status: [true],
      hasaccess: [true]
    });
  }

  private getDefaultEmployeeData(): any {
    return {
      employee_id: '',
      password: '123456',
      name: '',
      name_a: '',
      Sex: true,
      dept_desc: null,
      region_name: null,
      plant_name: null,
      role_id: null,
      hire_date: new Date(),
      resin_date: null,
      status: true,
      hasaccess: true
    };
  }

  // ===================== ★ 下拉列表加载 =====================

  loadAreas(): void {
    this.employeeService.getAreas().subscribe({
      next: (areas) => { this.areaOptions = areas; },
      error: (err) => console.error('加载地区列表失败:', err)
    });
  }

  loadFactories(area?: string): void {
    this.employeeService.getFactories(area).subscribe({
      next: (factories) => { this.factoryOptions = factories; },
      error: (err) => console.error('加载厂别列表失败:', err)
    });
  }

  /**
   * ★ 加载部门列表（从 API 获取）
   */
  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (depts) => {
        this.deptOptions = depts;
        console.log('加载部门列表成功:', this.deptOptions);
      },
      error: (err) => {
        console.error('加载部门列表失败:', err);
        this.message.error('加载部门列表失败');
      }
    });
  }

  /**
   * ★ 加载角色列表（从 API 获取）
   */
  loadRoles(): void {
    this.employeeService.getRoles().subscribe({
      next: (roles) => {
        this.roleOptions = roles;
        console.log('加载角色列表成功:', this.roleOptions);
      },
      error: (err) => {
        console.error('加载角色列表失败:', err);
        this.message.error('加载角色列表失败');
      }
    });
  }

  onAreaChange(area: string): void {
    this.selectedFactory = '1';
    this.loadFactories(area);
  }

  // ===================== 数据加载 =====================

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

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedArea = '1';
    this.selectedFactory = '1';
    this.searchText = '';
    this.loadFactories();
    this.onSearch();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  // ===================== ★ 新增员工对话框 =====================

  onAdd(): void {
    this.isEditMode = false;
    this.modalTitle = '新增';
    this.batchEmployees = [this.getDefaultEmployeeData()];
    this.currentBatchIndex = 0;
    this.loadBatchToForm(0);
    this.loadModalOptions();
    this.isModalVisible = true;
  }

  /**
   * 加载弹框中的下拉选项（地区/厂别不含"全部"，部门/角色直接复用）
   */
  private loadModalOptions(): void {
    // 地区（不含"全部"）
    this.employeeService.getAreas().subscribe(areas => {
      this.modalAreaOptions = areas.filter(a => a.value !== '1');
    });
    // 厂别（不含"全部"）
    this.employeeService.getFactories().subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
    });
  }

  /**
   * 弹框内地区变化 → 联动更新厂别选项
   */
  onModalAreaChange(area: string): void {
    this.employeeForm.patchValue({ plant_name: null });
    this.employeeService.getFactories(area).subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
    });
  }

  // ===================== ★ 批量分页导航 =====================

  private saveFormToBatch(): void {
    this.batchEmployees[this.currentBatchIndex] = { ...this.employeeForm.getRawValue() };
  }

  private loadBatchToForm(index: number): void {
    const data = this.batchEmployees[index];
    this.employeeForm.reset();
    this.employeeForm.patchValue(data);
    if (data.region_name) {
      this.onModalAreaChange(data.region_name);
    }
  }

  onPrevEmployee(): void {
    if (this.currentBatchIndex <= 0) return;
    this.saveFormToBatch();
    this.currentBatchIndex--;
    this.loadBatchToForm(this.currentBatchIndex);
  }

  onNextEmployee(): void {
    this.saveFormToBatch();
    if (this.currentBatchIndex < this.batchEmployees.length - 1) {
      this.currentBatchIndex++;
    } else {
      this.batchEmployees.push(this.getDefaultEmployeeData());
      this.currentBatchIndex = this.batchEmployees.length - 1;
    }
    this.loadBatchToForm(this.currentBatchIndex);
  }

  onDeleteCurrentEmployee(): void {
    if (this.batchEmployees.length <= 1) {
      this.message.warning('至少需要保留一条记录');
      return;
    }
    this.batchEmployees.splice(this.currentBatchIndex, 1);
    if (this.currentBatchIndex >= this.batchEmployees.length) {
      this.currentBatchIndex = this.batchEmployees.length - 1;
    }
    this.loadBatchToForm(this.currentBatchIndex);
    this.message.success('已删除当前记录');
  }

  // ===================== ★ 提交 & 取消 =====================

  handleModalOk(): void {
    this.saveFormToBatch();

    // 逐条校验
    for (let i = 0; i < this.batchEmployees.length; i++) {
      const emp = this.batchEmployees[i];
      if (!emp.employee_id || !emp.name || !emp.dept_desc || !emp.region_name || !emp.plant_name || emp.role_id == null) {
        this.currentBatchIndex = i;
        this.loadBatchToForm(i);
        this.markFormDirty();
        this.message.error(`第 ${i + 1} 条记录信息不完整，请检查必填项`);
        return;
      }
    }

    // 格式化日期
    const employees = this.batchEmployees.map(emp => ({
      ...emp,

      hire_date: emp.hire_date ? this.formatDate(emp.hire_date) : undefined,
      resin_date: emp.resin_date ? this.formatDate(emp.resin_date) : undefined,
    }));
    console.log('准备提交的员工数据:', employees);
    this.submitting = true;

    if (employees.length === 1) {
      this.employeeService.createEmployee(employees[0]).subscribe({
        next: () => {
          this.message.success('新增员工成功！');
          this.isModalVisible = false;
          this.submitting = false;
          this.loadData();
        },
        error: (err) => {
          this.message.error('新增失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });
    } else {
      this.employeeService.createEmployees(employees).subscribe({
        next: (results) => {
          this.message.success(`成功批量新增 ${results.length} 名员工！`);
          this.isModalVisible = false;
          this.submitting = false;
          this.loadData();
        },
        error: (err) => {
          this.message.error('批量新增失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });
    }
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  private markFormDirty(): void {
    Object.values(this.employeeForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString();  // → "2026-05-06T06:30:00.000Z" ✅
  }


  // ===================== 查看 / 编辑 =====================

  onView(data: Employee): void {
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        this.message.info(`查看员工: ${employee.name}`);
      },
      error: () => this.message.error('获取员工详情失败')
    });
  }

  onEdit(data: Employee): void {
    this.message.info(`编辑员工: ${data.name}`);
  }

  // ===================== 删除 =====================

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
          () => this.message.error('删除失败，请稍后重试')
        );
      }
    });
  }

  // ===================== 勾选 =====================

  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => this.updateCheckedSet(item.employee_id, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfData;
    this.checked = listOfEnabledData.length > 0 &&
      listOfEnabledData.every(item => this.setOfCheckedId.has(item.employee_id));
    this.indeterminate = listOfEnabledData.some(item =>
      this.setOfCheckedId.has(item.employee_id)
    ) && !this.checked;
  }
  // ===================== 其他工具函数 =====================
  /**
  * ★ 开始日期的禁用函数：不能晚于已选的结束日期
  */
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endDate) {
      return false;
    }
    // 开始日期不能晚于结束日期
    return startValue.getTime() > this.endDate.getTime();
  };

  /**
   * ★ 结束日期的禁用函数：不能早于已选的开始日期
   */
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startDate) {
      return false;
    }
    // 结束日期不能早于开始日期
    return endValue.getTime() < this.startDate.getTime();
  };

  /**
   * ★ 开始日期变化回调（可选：自动清空不合法的结束日期）
   */
  onStartDateChange(date: Date | null): void {
    this.startDate = date;
    // 如果新开始日期晚于当前结束日期，自动清空结束日期
    if (this.startDate && this.endDate && this.startDate.getTime() > this.endDate.getTime()) {
      this.endDate = null;
    }
  }

  /**
   * ★ 结束日期变化回调
   */
  onEndDateChange(date: Date | null): void {
    this.endDate = date;
    // 如果新结束日期早于当前开始日期，自动清空开始日期
    if (this.startDate && this.endDate && this.endDate.getTime() < this.startDate.getTime()) {
      this.startDate = null;
    }
  }
}
