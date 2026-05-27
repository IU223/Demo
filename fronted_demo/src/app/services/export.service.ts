import { Injectable } from '@angular/core';
import { ChatMessage } from '../models/chat-message';

/**
 * 对话导出服务
 *
 * 职责：将 AI 对话消息格式化为 Markdown 文档并触发浏览器下载
 */
@Injectable({ providedIn: 'root' })
export class ExportService {

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

    this.downloadFile(lines.join('\n'), title);
  }

  exportSingleMessage(content: string, title?: string): void {
    const header = `# AI 分析报告\n\n> 导出时间：${this.formatDate(new Date())}\n\n---\n\n`;
    this.downloadFile(header + content, title);
  }

  private downloadFile(content: string, title?: string): void {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const filename = `${title || '分析报告'}_${timestamp}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
