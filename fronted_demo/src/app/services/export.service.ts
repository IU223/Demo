import { Injectable } from '@angular/core';
import { ChatMessage } from '../models/chat-message';
import { Employee } from '../models/employee';

/**
 * 导出服务：支持 AI 对话导出（Markdown）以及员工数据导出（XLSX / CSV）
 */
@Injectable({ providedIn: 'root' })
export class ExportService {

  // ═══════════════════════════════════════════════════
  // 员工导出列定义（可按需调整）
  // ═══════════════════════════════════════════════════
  private readonly employeeColumns = [
    { key: 'employee_id', header: '工号' },
    { key: 'name', header: '姓名' },
    { key: 'name_a', header: '英文姓名' },
    { key: 'Sex', header: '性别' },
    { key: 'region_name', header: '地区' },
    { key: 'plant_name', header: '厂别' },
    { key: 'dept_desc', header: '部门' },
    { key: 'hire_date', header: '入职时间' },
    { key: 'resin_date', header: '离职时间' },
    { key: 'status', header: '状态' },
  ];

  /** 导出员工数据（格式：xlsx | csv） */
  exportEmployees(employees: Employee[], format: 'xlsx' | 'csv', filename?: string): void {
    if (!employees || employees.length === 0) return;

    const headers = this.employeeColumns.map(c => c.header);
    const rows = employees.map(emp =>
      this.employeeColumns.map(col => this.formatCell(col.key, (emp as any)[col.key]))
    );

    const finalFilename = this.buildFilename(filename || '员工数据', format);

    if (format === 'xlsx') {
      void this.exportAsXlsx(headers, rows, finalFilename);
    } else {
      this.exportAsCsv(headers, rows, finalFilename);
    }
  }

  // ───────────────────── XLSX 导出 ─────────────────────
  private async exportAsXlsx(headers: string[], rows: string[][], filename: string): Promise<void> {
    const XLSX = await import('xlsx');
    const sheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet['!cols'] = headers.map((h, i) => {
      let maxLen = h.length;
      for (const row of rows) {
        const cellLen = (row[i] || '').length;
        if (cellLen > maxLen) maxLen = cellLen;
      }
      return { wch: Math.min(maxLen * 2 + 4, 40) };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '员工数据');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    this.triggerDownload(blob, filename);
  }

  // ───────────────────── CSV 导出 ─────────────────────
  private exportAsCsv(headers: string[], rows: string[][], filename: string): void {
    const BOM = '\uFEFF';
    const headerLine = headers.join(',');
    const dataLines = rows.map(row => row.map(cell => this.escapeCsvCell(cell)).join(','));
    const csvContent = BOM + headerLine + '\n' + dataLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, filename);
  }

  // ───────────────────── 工具方法 ─────────────────────
  private formatCell(key: string, value: any): string {
    if (value === null || value === undefined) return '';
    if (key === 'Sex') {
      if (value === true) return '男';
      if (value === false) return '女';
      return String(value);
    }
    if (key === 'status') {
      return value ? '在职' : '离职';
    }
    if (key === 'hire_date' || key === 'resin_date') {
      if (!value) return '';
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    return String(value);
  }

  private escapeCsvCell(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  private buildFilename(prefix: string, ext: string): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    return `${prefix}_${timestamp}.${ext}`;
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ═══════════════════════════════════════════════════
  // 原有 AI 导出方法（保留并做轻微重命名/适配）
  // ═══════════════════════════════════════════════════
  exportConversation(messages: ChatMessage[], title?: string): void {
    const lines: string[] = [];
    lines.push('# AI 分析报告\n');
    lines.push(`> 导出时间：${this.formatDate(new Date())}\n`);
    lines.push('---\n');

    for (const msg of messages) {
      if (msg.role === 'user') {
        lines.push('### 💬 用户提问\n');
        lines.push(msg.content + '\n');
        lines.push('');
      } else if (msg.role === 'assistant') {
        lines.push('### 🤖 AI 分析\n');
        lines.push(msg.content + '\n');
        lines.push('');
      }
      lines.push('---\n');
    }

    this.downloadMarkdown(lines.join('\n'), title);
  }

  exportSingleMessage(content: string, title?: string): void {
    const header = `# AI 分析报告\n\n> 导出时间：${this.formatDate(new Date())}\n\n---\n\n`;
    this.downloadMarkdown(header + content, title);
  }

  private downloadMarkdown(content: string, title?: string): void {
    const filename = this.buildFilename(title || '分析报告', 'md');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    this.triggerDownload(blob, filename);
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

}
