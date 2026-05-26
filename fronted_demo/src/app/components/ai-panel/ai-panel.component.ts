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
 * Step 5 改动：
 *   - onMessageSent() 从非流式切换为 SSE 流式
 *   - 新增 currentStreamAbort / streamSub 用于流取消 & 清理
 *   - clearChat() / ngOnDestroy() 增加流取消逻辑
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

  /** 当前活跃的流取消函数 */
  private currentStreamAbort: (() => void) | null = null;
  /** 当前活跃的流订阅 */
  private streamSub: Subscription | null = null;

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
    this.abortCurrentStream();
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

  // ==================== 流式对话 ====================

  onMessageSent(text: string): void {
    if (this.isWaiting) return;

    // 1. 添加用户消息
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    // 2. 添加 AI 消息占位符（内容为空，流式逐步填充）
    const aiMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    };

    this.messages = [...this.messages, userMsg, aiMsg];
    this.isWaiting = true;

    // 3. 发起流式请求
    const { stream$, abort } = this.aiService.chatStream({ message: text });
    this.currentStreamAbort = abort;

    this.streamSub = stream$.subscribe({
      next: (chunk: string) => {
        const msgs = [...this.messages];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant') {
          lastMsg.content += chunk;
          this.messages = msgs;
        }
      },

      error: (err: any) => {
        this.isWaiting = false;
        this.currentStreamAbort = null;
        this.streamSub = null;

        const status = err?.status;
        if (status === 401) return;

        let errorText = '⚠️ 抱歉，回复生成失败。';
        if (status === 503) {
          errorText = '⚠️ AI 服务繁忙，请稍后重试。';
        } else if (status === 0 || !navigator.onLine) {
          errorText = '⚠️ 网络连接已断开，请检查网络后重试。';
        } else if (err?.message) {
          errorText = `⚠️ ${err.message}`;
        }

        const msgs = [...this.messages];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant' && !lastMsg.content) {
          lastMsg.content = errorText;
          this.messages = msgs;
        } else {
          const errorMsg: ChatMessage = {
            role: 'assistant',
            content: errorText,
            created_at: new Date().toISOString(),
          };
          this.messages = [...this.messages, errorMsg];
        }
      },

      complete: () => {
        this.isWaiting = false;
        this.currentStreamAbort = null;
        this.streamSub = null;
      },
    });
  }

  // ==================== 清空对话 ====================

  clearChat(): void {
    this.abortCurrentStream();
    this.isWaiting = false;
    this.messages = [];
    this.aiPanelService.clearContext();
  }

  // ==================== 私有工具方法 ====================

  private abortCurrentStream(): void {
    if (this.currentStreamAbort) {
      this.currentStreamAbort();
      this.currentStreamAbort = null;
    }
    if (this.streamSub) {
      this.streamSub.unsubscribe();
      this.streamSub = null;
    }
  }
}
