import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { forkJoin } from 'rxjs';

import { AuditLogService } from '../../services/audit-log.service';
import { AuditLog, ACTION_TAG_COLOR, ACTION_LABEL } from '../../models/audit-log';

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

    const where: any = {};

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

  // ===================== 工具方法 =====================

  /** 获取操作类型的 Tag 颜色 */
  getActionColor(action: string): string {
    return this.actionTagColor[action] || 'default';
  }

  /** 获取操作类型的中文标签 */
  getActionLabel(action: string): string {
    return this.actionLabel[action] || action;
  }

  /** 判断状态码是否为成功 */
  isSuccess(code?: number): boolean {
    return code != null && code >= 200 && code < 300;
  }

  /** 格式化时间（yyyy-MM-dd HH:mm:ss） */
  formatTime(dateStr?: string): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
}
