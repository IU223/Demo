import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatSession } from '../../../models/chat-session';

@Component({
  selector: 'app-ai-history-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzInputModule,
  ],
  templateUrl: './ai-history-drawer.component.html',
  styleUrls: ['./ai-history-drawer.component.scss'],
})
export class AiHistoryDrawerComponent {
  @Input() sessions: ChatSession[] = [];
  @Input() currentSessionId: number | null = null;
  @Input() loading = false;
  @Input() isSuperAdmin = false; // ★ Step 7 新增

  @Output() sessionSelected = new EventEmitter<ChatSession>();
  @Output() sessionDeleted = new EventEmitter<number>();
  @Output() newChat = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  // ★ Step 7: 超管用户筛选
  filterKeyword = '';

  /** 根据筛选关键词过滤会话列表 */
  get filteredSessions(): ChatSession[] {
    if (!this.isSuperAdmin || !this.filterKeyword.trim()) {
      return this.sessions;
    }
    const kw = this.filterKeyword.trim().toLowerCase();
    return this.sessions.filter(s =>
      (s.employee_id || '').toLowerCase().includes(kw) ||
      (s.title || '').toLowerCase().includes(kw)
    );
  }

  onSelectSession(session: ChatSession): void {
    this.sessionSelected.emit(session);
  }

  onDeleteSession(sessionId: number): void {
    this.sessionDeleted.emit(sessionId);
  }

  onNewChat(): void {
    this.newChat.emit();
  }

  onBack(): void {
    this.back.emit();
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const sessionDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const pad = (n: number) => String(n).padStart(2, '0');
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    if (sessionDay.getTime() === today.getTime()) {
      return `今天 ${time}`;
    }
    if (sessionDay.getTime() === yesterday.getTime()) {
      return `昨天 ${time}`;
    }
    if (d.getFullYear() === now.getFullYear()) {
      return `${d.getMonth() + 1}月${d.getDate()}日 ${time}`;
    }
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }
}
