import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ChatSession } from '../../../models/chat-session';

@Component({
  selector: 'app-ai-history-drawer',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzSpinModule,
    NzPopconfirmModule,
  ],
  templateUrl: './ai-history-drawer.component.html',
  styleUrls: ['./ai-history-drawer.component.scss'],
})
export class AiHistoryDrawerComponent {
  @Input() sessions: ChatSession[] = [];
  @Input() currentSessionId: number | null = null;
  @Input() loading = false;

  @Output() sessionSelected = new EventEmitter<ChatSession>();
  @Output() sessionDeleted = new EventEmitter<number>();
  @Output() newChat = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  onSelectSession(session: ChatSession): void {
    this.sessionSelected.emit(session);
  }

  // ★ 修复：移除 event 参数，nzOnConfirm 不传递事件对象
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
    if (isNaN(d.getTime())) return '';

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
