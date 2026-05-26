import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AiPanelService } from '../../services/ai-panel.service';
import { AiService } from '../../services/ai.service';
import { ChatMessage } from '../../models/chat-message';
import { AiChatListComponent } from './ai-chat-list/ai-chat-list.component';
import { AiInputBarComponent } from './ai-input-bar/ai-input-bar.component';

/**
 * AI 面板容器组件
 *
 * 挂载在 DefaultComponent（主布局）上，使用 position: fixed 覆盖模式。
 *
 * 组件层级：
 *   AiPanelComponent (容器)
 *   ├── AiChatListComponent       @Input() messages, @Input() isWaiting
 *   └── AiInputBarComponent       @Output() messageSent
 */
@Component({
  selector: 'app-ai-panel',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    AiChatListComponent,
    AiInputBarComponent,
  ],
  templateUrl: './ai-panel.component.html',
  styleUrls: ['./ai-panel.component.scss'],
})
export class AiPanelComponent implements OnInit, OnDestroy {
  isVisible = false;
  messages: ChatMessage[] = [];
  isWaiting = false;

  private subscription = new Subscription();

  constructor(
    private aiPanelService: AiPanelService,
    private aiService: AiService,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.aiPanelService.isOpen$.subscribe(open => {
        this.isVisible = open;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) {
      this.closePanel();
    }
  }

  closePanel(): void {
    this.aiPanelService.close();
  }

  onMessageSent(text: string): void {
    if (this.isWaiting) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    this.messages = [...this.messages, userMsg];

    this.isWaiting = true;

    this.aiService.chat({ message: text }).subscribe({
      next: (res) => {
        const aiMsg: ChatMessage = {
          role: 'assistant',
          content: res.content,
          created_at: new Date().toISOString(),
        };
        this.messages = [...this.messages, aiMsg];
        this.isWaiting = false;
      },
      error: (err) => {
        this.isWaiting = false;
        const status = err.status || err.statusCode;
        if (status === 401) return;

        let errorText = '⚠️ 抱歉，回复生成失败。';
        if (status === 503) {
          errorText = '⚠️ AI 服务繁忙，请稍后重试。';
        } else if (status === 400) {
          errorText = '⚠️ ' + (err.error?.error?.message || '请求参数有误');
        } else if (status === 0 || !navigator.onLine) {
          errorText = '⚠️ 网络连接已断开，请检查网络后重试。';
        }

        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: errorText,
          created_at: new Date().toISOString(),
        };
        this.messages = [...this.messages, errorMsg];
      },
    });
  }

  clearChat(): void {
    this.messages = [];
    this.aiPanelService.clearContext();
  }
}
