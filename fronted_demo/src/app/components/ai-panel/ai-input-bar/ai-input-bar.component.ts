import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

/**
 * AI 输入框子组件
 *
 * 职责：
 *   1. 文本输入
 *   2. 发送消息事件
 *   3. Enter 发送，Shift+Enter 换行
 */
@Component({
  selector: 'app-ai-input-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzIconModule],
  templateUrl: './ai-input-bar.component.html',
  styleUrls: ['./ai-input-bar.component.scss'],
})
export class AiInputBarComponent {
  @Input() disabled = false;
  @Output() messageSent = new EventEmitter<string>();

  inputText = '';

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.disabled) return;
    this.messageSent.emit(text);
    this.inputText = '';
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
}
