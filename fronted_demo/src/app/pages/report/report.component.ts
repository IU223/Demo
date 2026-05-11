import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
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
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  viewForm!: FormGroup;
  isViewVisible = false;
  viewEmployee: any = {};
  viewSexText = '';
  viewRoleLabel = '';
  // ===================== 对话框下拉选项（不含"全部"） =====================
  modalAreaOptions: SelectOption[] = [];
  modalFactoryOptions: SelectOption[] = [];
  deptOptions: SelectOption[] = [];
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
    this.initViewForm(); // ← 新增
  }

  ngOnInit(): void {
    this.loadAreas();
    this.loadFactories();
    this.loadDepartments();
    this.loadRoles();
    this.loadData();
  }

  // ===================== 表单初始化 =====================

  private initForm(): void {
    this.employeeForm = this.fb.group({
      employee_id: ['', {
        validators: [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)],
        asyncValidators: [this.employeeIdExistsValidator()],
        updateOn: 'blur'
      }],
      password: ['123456'],
      name: ['', [Validators.required, Validators.pattern(/^[\u4e00-\u9fff\u3400-\u4dbf]+$/)]],
      name_a: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
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
  /** 初始化只读表单（所有控件默认禁用） */
  private initViewForm(): void {
    this.viewForm = this.fb.group({
      employee_id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      name_a: [{ value: '', disabled: true }],
      Sex: [{ value: true, disabled: true }],
      dept_desc: [{ value: null, disabled: true }],
      region_name: [{ value: null, disabled: true }],
      plant_name: [{ value: null, disabled: true }],
      role_id: [{ value: null, disabled: true }],
      status: [{ value: true, disabled: true }],
    });
  }

  /** 异步校验器：检测工号是否已存在（在 blur 时触发） */
  private employeeIdExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const val = control.value;
      if (!val) return of(null);
      // 在编辑模式且未更改工号时视为有效
      if (this.isEditMode && this.currentEmployeeId && val === this.currentEmployeeId) {
        return of(null);
      }
      return this.employeeService.getEmployeeById(val).pipe(
        map(() => ({ employeeExists: true })),
        catchError(() => of(null))
      );
    };
  }

  // private getDefaultEmployeeData(): any {
  //   return {
  //     employee_id: '',
  //     password: '123456',
  //     name: '',
  //     name_a: '',
  //     Sex: true,
  //     dept_desc: null,
  //     region_name: null,
  //     plant_name: null,
  //     role_id: null,
  //     hire_date: new Date(),
  //     resin_date: null,
  //     status: true,
  //     hasaccess: true
  //   };
  // }
  private getDefaultEmployeeData(): any {
    return {
      employee_id: 'Z2604000',
      password: '123456',
      name: '伟',
      name_a: 'xuwei',
      Sex: true,
      dept_desc: '智慧制造应用系统发展二部',
      region_name: '中山',
      plant_name: 'zs3',
      role_id: 1,
      hire_date: new Date(),
      resin_date: null,
      status: true,
      hasaccess: true
    };
  }
  // =====================下拉列表加载 =====================
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
    // 同时请求数据页和总数，确保分页 total 正确
    forkJoin({
      page: this.employeeService.getEmployees(filter),
      total: this.employeeService.getEmployeesCount(filter)
    }).subscribe({
      next: ({ page, total }) => {
        this.listOfData = page.data;
        this.total = total ?? page.total ?? page.data.length;
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

  // =====================  新增员工对话框 =====================

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
  onModalAreaChange(area: string, preferredPlant?: string): void {
    // 加载指定地区的厂别选项，异步完成后恢复或校验 plant_name
    this.employeeService.getFactories(area).subscribe(factories => {
      this.modalFactoryOptions = factories.filter(f => f.value !== '1');
      // 如果调用时传入了首选厂别，则尝试恢复（可能是 value 或 label）
      if (preferredPlant) {
        const foundByValue = this.modalFactoryOptions.find(f => f.value === preferredPlant);
        if (foundByValue) {
          this.employeeForm.patchValue({ plant_name: foundByValue.value });
        } else {
          const foundByLabel = this.modalFactoryOptions.find(f => f.label === preferredPlant);
          if (foundByLabel) {
            this.employeeForm.patchValue({ plant_name: foundByLabel.value });
          }
        }
      } else {
        // 若当前表单中的 plant_name 不在新选项中，则清空以避免不一致
        const current = this.employeeForm.get('plant_name')?.value;
        if (current && !this.modalFactoryOptions.find(f => f.value === current || f.label === current)) {
          this.employeeForm.patchValue({ plant_name: null });
        }
      }
    });
  }

  // =====================  批量分页导航 =====================

  private saveFormToBatch(): void {
    this.batchEmployees[this.currentBatchIndex] = { ...this.employeeForm.getRawValue() };
  }

  private loadBatchToForm(index: number): void {
    const data = this.batchEmployees[index];
    this.employeeForm.reset();
    this.employeeForm.patchValue(data);
    if (data.region_name) {
      this.onModalAreaChange(data.region_name, data.plant_name);
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
  /**
   * ★ 计算可见页码（含省略号），类似 Ant Design Pagination 算法
   */
  getVisiblePages(): (number | string)[] {
    const total = this.batchEmployees.length;
    const current = this.currentBatchIndex + 1;

    // 总页数 <= 7 时全部显示
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (current <= 4) {
      // 靠近开头：显示前5页 + ... + 末页
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      // 靠近末尾：首页 + ... + 后5页
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      // 居中：首页 + ... + 当前±1 + ... + 末页
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  /**
   * 跳转到指定批次页
   */
  goToPage(page: number | string): void {
    if (typeof page === 'string') return;           // 省略号不可点
    const index = (page as number) - 1;
    if (index === this.currentBatchIndex) return;    // 当前页不重复加载
    this.saveFormToBatch();
    this.currentBatchIndex = index;
    this.loadBatchToForm(index);
  }

  // =====================  提交 & 取消 =====================

  handleModalOk(): void {
    // ======================== 编辑模式 ========================
    if (this.isEditMode) {
      // 标记所有字段以触发校验展示
      this.markFormDirty();

      // 检查启用状态的字段是否有效
      const controls = this.employeeForm.controls;
      let hasError = false;
      Object.keys(controls).forEach(key => {
        const ctrl = controls[key];
        if (ctrl.enabled && ctrl.invalid) {
          hasError = true;
        }
      });

      if (hasError) {
        this.message.error('请检查表单中的必填项和格式');
        return;
      }

      // getRawValue 能获取包含 disabled 字段（employee_id）的完整数据
      const formData = this.employeeForm.getRawValue();
      const updateData: any = {
        name: formData.name,
        name_a: formData.name_a,
        Sex: formData.Sex,
        dept_desc: formData.dept_desc,
        region_name: formData.region_name,
        plant_name: formData.plant_name,
        role_id: formData.role_id,
        password: formData.password,
        hire_date: formData.hire_date ? this.formatDate(formData.hire_date) : undefined,
        resin_date: formData.resin_date ? this.formatDate(formData.resin_date) : undefined,
        status: formData.status,
        hasaccess: formData.hasaccess
      };

      // 移除 undefined 字段，避免覆盖后端已有数据
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log('准备更新的员工数据:', this.currentEmployeeId, updateData);
      this.submitting = true;

      this.employeeService.updateEmployee(this.currentEmployeeId, updateData).subscribe({
        next: () => {
          this.message.success('员工信息修改成功！');
          this.isModalVisible = false;
          this.submitting = false;
          // 恢复工号字段可编辑
          this.employeeForm.get('employee_id')?.enable();
          this.loadData();
        },
        error: (err) => {
          this.message.error('修改失败：' + (err.error?.error?.message || '请稍后重试'));
          this.submitting = false;
        }
      });

      return; // ★ 编辑模式到此结束，不走下面的新增逻辑
    }

    // ======================== 新增模式（原有逻辑不变） ========================
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

    return d.toISOString();
  }


  // ===================== 查看 / 编辑 =====================

  onView(data: Employee): void {
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        const emp: any = employee as any;
        console.log('emp:', emp);

        // ★ 关键修复：先加载地区 & 厂别选项，再填充表单
        const areas$ = this.employeeService.getAreas();
        const factories$ = emp.region_name
          ? this.employeeService.getFactories(emp.region_name)
          : of([] as SelectOption[]);

        forkJoin({ areas: areas$, factories: factories$ }).subscribe({
          next: ({ areas, factories }) => {
            // 1. 填充下拉选项（不含"全部"）
            this.modalAreaOptions = areas.filter(a => a.value !== '1');
            this.modalFactoryOptions = factories.filter(f => f.value !== '1');

            // 2. 性别文本
            const sexVal = emp.Sex;
            this.viewSexText = (sexVal === undefined || sexVal === null)
              ? '' : (sexVal ? '男' : '女');

            // 3. 角色标签
            this.viewRoleLabel = '';
            if (emp.role_id != null) {
              const rid = typeof emp.role_id === 'number' ? emp.role_id : Number(emp.role_id);
              const found = this.roleOptions.find(r => r.value === rid);
              this.viewRoleLabel = found ? found.label : String(emp.role_id);
            }

            // 4. ★ 选项就绪后，再 patchValue
            this.viewForm.patchValue({
              employee_id: emp.employee_id ?? '',
              name: emp.name ?? '',
              name_a: emp.name_a ?? '',
              Sex: emp.Sex ?? true,
              dept_desc: emp.dept_desc ?? null,
              region_name: emp.region_name ?? null,
              plant_name: emp.plant_name ?? null,
              role_id: emp.role_id ?? null,
              status: emp.status ?? true,
              hasaccess: emp.hasaccess ?? true
            });

            this.viewEmployee = emp;
            this.isViewVisible = true;
          },
          error: () => this.message.error('加载选项数据失败')
        });
      },
      error: () => this.message.error('获取员工详情失败')
    });
  }
  handleViewCancel(): void {
    this.isViewVisible = false;
  }

  onEdit(data: Employee): void {
    this.isEditMode = true;
    this.modalTitle = '编辑';
    this.currentEmployeeId = data.employee_id;

    // 先获取最新的完整员工数据
    this.employeeService.getEmployeeById(data.employee_id).subscribe({
      next: (employee) => {
        const emp: any = employee as any;

        // 加载弹框下拉选项（地区 & 厂别）
        const areas$ = this.employeeService.getAreas();
        const factories$ = emp.region_name
          ? this.employeeService.getFactories(emp.region_name)
          : of([] as SelectOption[]);

        forkJoin({ areas: areas$, factories: factories$ }).subscribe({
          next: ({ areas, factories }) => {
            // 1. 填充弹框下拉选项（不含"全部"）
            this.modalAreaOptions = areas.filter(a => a.value !== '1');
            this.modalFactoryOptions = factories.filter(f => f.value !== '1');

            // 2. 重置表单并填充数据
            this.employeeForm.reset();
            this.employeeForm.patchValue({
              employee_id: emp.employee_id ?? '',
              password: emp.password ?? '123456',
              name: emp.name ?? '',
              name_a: emp.name_a ?? '',
              Sex: emp.Sex ?? true,
              dept_desc: emp.dept_desc ?? null,
              region_name: emp.region_name ?? null,
              plant_name: emp.plant_name ?? null,
              role_id: emp.role_id ?? null,
              status: emp.status ?? true,
            });

            // 3. ★ 编辑模式下禁用工号字段（不可修改主键）
            this.employeeForm.get('employee_id')?.disable();

            // 4. 清除所有校验状态（避免残留红框）
            Object.values(this.employeeForm.controls).forEach(control => {
              control.markAsPristine();
              control.markAsUntouched();
              control.updateValueAndValidity({ onlySelf: true });
            });

            // 5. 打开弹框
            this.isModalVisible = true;
          },
          error: () => this.message.error('加载选项数据失败')
        });
      },
      error: () => this.message.error('获取员工详情失败')
    });
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
        console.log('准备删除的员工ID列表:', ids);
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

}
