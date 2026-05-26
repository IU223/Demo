import {
  Component, Input, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat-message';

/**
 * AI 消息列表子组件
 *
 * 职责：
 *   1. 渲染消息列表（用户消息在右，AI 消息在左）
 *   2. 自动滚动到最新消息
 *   3. 显示 AI 正在输入的 typing 动画
 */
@Component({
  selector: 'app-ai-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chat-list.component.html',
  styleUrls: ['./ai-chat-list.component.scss'],
})
export class AiChatListComponent implements OnChanges, AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() isWaiting = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private shouldScroll = false;

  ngOnChanges(_changes: SimpleChanges): void {
    this.shouldScroll = true;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // ignore scroll errors
    }
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
