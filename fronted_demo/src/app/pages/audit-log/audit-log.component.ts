import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';

import { forkJoin } from 'rxjs';

import { AuditLogService } from '../../services/audit-log.service';
import {
  AuditLog,
  ACTION_TAG_COLOR,
  ACTION_LABEL,
  ACTION_OPTIONS,
  RESOURCE_TYPE_OPTIONS,
} from '../../models/audit-log';

/** 变更对比行 */
interface DiffRow {
  field: string;
  oldVal: string;
  newVal: string;
  changed: boolean;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzModalModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzEmptyModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule,
  ],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
})
export class AuditLogComponent implements OnInit {

  // ===================== 表格数据 =====================
  listOfData: AuditLog[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 20;

  // ===================== 常量映射 =====================
  actionTagColor = ACTION_TAG_COLOR;
  actionLabel = ACTION_LABEL;
  actionOptions = ACTION_OPTIONS;
  resourceTypeOptions = RESOURCE_TYPE_OPTIONS;

  // ===================== 筛选条件 =====================
  filterDateRange: Date[] = [];
  filterOperator = '';
  filterAction: string | null = null;
  filterResourceType: string | null = null;
  filterKeyword = '';

  // ===================== 详情弹框 =====================
  isDetailVisible = false;
  detailLog: AuditLog | null = null;
  diffRows: DiffRow[] = [];
  parsedOldValue: Record<string, any> | null = null;
  parsedNewValue: Record<string, any> | null = null;

  constructor(
    private auditLogService: AuditLogService,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ===================== 数据加载 =====================

  loadData(): void {
    this.loading = true;

    const where = this.buildWhereClause();

    const filter = {
      where,
      order: ['created_at DESC'],
      skip: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize,
    };

    forkJoin({
      data: this.auditLogService.getLogs(filter),
      total: this.auditLogService.getLogsCount(where),
    }).subscribe({
      next: ({ data, total }) => {
        this.listOfData = data;
        this.total = total;
        this.loading = false;
      },
      error: (err) => {
        const msg = err.error?.error?.message || '加载日志失败';
        this.message.error(msg);
        this.loading = false;
      },
    });
  }

  // ===================== 构建 where 子句 =====================

  private buildWhereClause(): any {
    const where: any = {};

    // 1. 时间范围
    if (this.filterDateRange && this.filterDateRange.length === 2) {
      const [start, end] = this.filterDateRange;
      if (start && end) {
        const startStr = this.formatDate(start);
        const endStr = this.formatDate(end) + 'T23:59:59';
        where.created_at = { between: [startStr, endStr] };
      }
    }

    // 2. 操作人（模糊搜索 operator_id 或 operator_name）
    if (this.filterOperator && this.filterOperator.trim()) {
      const kw = this.filterOperator.trim();
      where.or = [
        { operator_id: { like: `%${kw}%` } },
        { operator_name: { like: `%${kw}%` } },
      ];
    }

    // 3. 操作类型
    if (this.filterAction) {
      where.action = this.filterAction;
    }

    // 4. 资源类型
    if (this.filterResourceType) {
      where.resource_type = this.filterResourceType;
    }

    // 5. 关键词（搜索 resource_id 或 request_path）
    if (this.filterKeyword && this.filterKeyword.trim()) {
      const kw = this.filterKeyword.trim();
      const keywordOr = [
        { resource_id: { like: `%${kw}%` } },
        { request_path: { like: `%${kw}%` } },
      ];

      if (where.or) {
        const operatorOr = where.or;
        delete where.or;
        where.and = [
          { or: operatorOr },
          { or: keywordOr },
        ];
      } else {
        where.or = keywordOr;
      }
    }

    return where;
  }

  // ===================== 筛选操作 =====================

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.filterDateRange = [];
    this.filterOperator = '';
    this.filterAction = null;
    this.filterResourceType = null;
    this.filterKeyword = '';
    this.pageIndex = 1;
    this.loadData();
  }

  // ===================== 分页 =====================

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadData();
  }

  // ===================== 详情弹框 =====================

  onViewDetail(log: AuditLog): void {
    this.detailLog = log;
    this.parsedOldValue = this.safeParseJson(log.old_value);
    this.parsedNewValue = this.safeParseJson(log.new_value);
    this.diffRows = this.computeDiff(this.parsedOldValue, this.parsedNewValue, log.action);
    this.isDetailVisible = true;
  }

  handleDetailClose(): void {
    this.isDetailVisible = false;
    this.detailLog = null;
    this.diffRows = [];
    this.parsedOldValue = null;
    this.parsedNewValue = null;
  }

  get showDiffSection(): boolean {
    if (!this.detailLog) return false;
    const action = this.detailLog.action;
    return ['UPDATE', 'DELETE', 'BATCH_UPDATE'].includes(action)
      && (this.parsedOldValue != null || this.parsedNewValue != null);
  }

  get showNewValueSection(): boolean {
    if (!this.detailLog) return false;
    const action = this.detailLog.action;
    return ['CREATE', 'LOGIN', 'LOGIN_FAILED', 'PASSWORD_CHANGE', 'PASSWORD_RESET'].includes(action)
      && this.parsedNewValue != null;
  }

  // ===================== 变更对比逻辑 =====================

  private computeDiff(
    oldObj: Record<string, any> | null,
    newObj: Record<string, any> | null,
    action: string,
  ): DiffRow[] {
    if (action === 'UPDATE' || action === 'BATCH_UPDATE') {
      if (!newObj) return [];
      const rows: DiffRow[] = [];
      const newKeys = Object.keys(newObj);
      for (const key of newKeys) {
        if (key.startsWith('$')) continue;
        const nv = this.formatValue(newObj[key]);
        const ov = oldObj ? this.formatValue(oldObj[key]) : '-';
        rows.push({ field: key, oldVal: ov, newVal: nv, changed: ov !== nv });
      }
      return rows;
    }

    if (action === 'DELETE') {
      if (!oldObj) return [];
      return Object.keys(oldObj)
        .filter(k => !k.startsWith('$'))
        .map(key => ({
          field: key,
          oldVal: this.formatValue(oldObj[key]),
          newVal: '(已删除)',
          changed: true,
        }));
    }

    return [];
  }

  private safeParseJson(jsonStr?: string): Record<string, any> | null {
    if (!jsonStr) return null;
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
      return { _value: parsed };
    } catch {
      return null;
    }
  }

  private formatValue(val: any): string {
    if (val === undefined) return '-';
    if (val === null) return 'null';
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  // ===================== 工具方法 =====================

  getActionColor(action: string): string {
    return this.actionTagColor[action] || 'default';
  }

  getActionLabel(action: string): string {
    return this.actionLabel[action] || action;
  }

  isSuccess(code?: number): boolean {
    return code != null && code >= 200 && code < 300;
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  getNewValueEntries(): { key: string; value: string }[] {
    if (!this.parsedNewValue) return [];
    return Object.keys(this.parsedNewValue)
      .filter(k => !k.startsWith('$'))
      .map(k => ({ key: k, value: this.formatValue(this.parsedNewValue![k]) }));
  }

  /** 日期禁用：开始不能晚于结束 */
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.filterDateRange?.[1]) return false;
    return startValue.getTime() > this.filterDateRange[1].getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.filterDateRange?.[0]) return false;
    return endValue.getTime() < this.filterDateRange[0].getTime();
  };

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
