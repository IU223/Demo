import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AiPanelService } from '../../services/ai-panel.service';
import { AiService } from '../../services/ai.service';
import { ChatMessage } from '../../models/chat-message';
import { ChatSession } from '../../models/chat-session';
import { AiChatListComponent } from './ai-chat-list/ai-chat-list.component';
import { AiInputBarComponent } from './ai-input-bar/ai-input-bar.component';
import { AiHistoryDrawerComponent } from './ai-history-drawer/ai-history-drawer.component';

/**
 * AI 面板容器组件
 *
 * Step 6 改动：
 *   - 新增会话管理（sessions, currentSessionId）
 *   - 新增历史抽屉切换（showHistory）
 *   - onMessageSent() 传递 session_id，订阅 sessionId$
 *   - 加载历史会话消息
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
    AiHistoryDrawerComponent,
  ],
  templateUrl: './ai-panel.component.html',
  styleUrls: ['./ai-panel.component.scss'],
})
export class AiPanelComponent implements OnInit, OnDestroy {
  isVisible = false;
  messages: ChatMessage[] = [];
  isWaiting = false;

  // 会话管理
  sessions: ChatSession[] = [];
  currentSessionId: number | null = null;
  showHistory = false;
  sessionsLoading = false;

  private subscription = new Subscription();
  private currentStreamAbort: (() => void) | null = null;
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
        if (open) this.loadSessions();
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
      if (this.showHistory) { this.showHistory = false; }
      else { this.closePanel(); }
    }
  }

  closePanel(): void { this.aiPanelService.close(); }

  // ==================== 会话管理 ====================

  loadSessions(): void {
    this.sessionsLoading = true;
    this.aiService.getSessions().subscribe({
      next: sessions => { this.sessions = sessions; this.sessionsLoading = false; },
      error: () => { this.sessionsLoading = false; },
    });
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory) this.loadSessions();
  }

  onSessionSelected(session: ChatSession): void {
    if (session.session_id === this.currentSessionId) { this.showHistory = false; return; }

    this.abortCurrentStream();
    this.currentSessionId = session.session_id!;
    this.showHistory = false;
    this.isWaiting = false;

    this.aiService.getSessionDetail(session.session_id!).subscribe({
      next: data => {
        this.messages = data.messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            message_id: m.message_id,
            session_id: m.session_id,
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
            created_at: m.created_at,
          }));
      },
      error: () => this.message.error('加载对话历史失败'),
    });
  }

  onDeleteSession(sessionId: number): void {
    this.aiService.deleteSession(sessionId).subscribe({
      next: () => {
        this.sessions = this.sessions.filter(s => s.session_id !== sessionId);
        if (this.currentSessionId === sessionId) this.onNewChat();
        this.message.success('对话已删除');
      },
      error: () => this.message.error('删除失败'),
    });
  }

  onNewChat(): void {
    this.abortCurrentStream();
    this.currentSessionId = null;
    this.messages = [];
    this.isWaiting = false;
    this.showHistory = false;
  }

  // ==================== 流式对话 ====================

  onMessageSent(text: string): void {
    if (this.isWaiting) return;

    const userMsg: ChatMessage = { role: 'user', content: text, created_at: new Date().toISOString() };
    const aiMsg: ChatMessage = { role: 'assistant', content: '', created_at: new Date().toISOString() };

    this.messages = [...this.messages, userMsg, aiMsg];
    this.isWaiting = true;

    const { stream$, abort, sessionId$ } = this.aiService.chatStream({
      message: text,
      session_id: this.currentSessionId || undefined,
    });
    this.currentStreamAbort = abort;

    this.subscription.add(
      sessionId$.subscribe(id => {
        this.currentSessionId = id;
        this.loadSessions();
      }),
    );

    this.streamSub = stream$.subscribe({
      next: (chunk: string) => {
        const msgs = [...this.messages];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant') { lastMsg.content += chunk; this.messages = msgs; }
      },
      error: (err: any) => {
        this.isWaiting = false;
        this.currentStreamAbort = null;
        this.streamSub = null;

        const status = err?.status;
        if (status === 401) return;

        let errorText = '⚠️ 抱歉，回复生成失败。';
        if (status === 503) errorText = '⚠️ AI 服务繁忙，请稍后重试。';
        else if (status === 0 || !navigator.onLine) errorText = '⚠️ 网络连接已断开，请检查网络后重试。';
        else if (err?.message) errorText = `⚠️ ${err.message}`;

        const msgs = [...this.messages];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === 'assistant' && !lastMsg.content) {
          lastMsg.content = errorText; this.messages = msgs;
        } else {
          this.messages = [...this.messages, { role: 'assistant', content: errorText, created_at: new Date().toISOString() }];
        }
      },
      complete: () => {
        this.isWaiting = false;
        this.currentStreamAbort = null;
        this.streamSub = null;
      },
    });
  }

  clearChat(): void {
    this.onNewChat();
    this.aiPanelService.clearContext();
  }

  // ==================== 私有 ====================

  private abortCurrentStream(): void {
    if (this.currentStreamAbort) { this.currentStreamAbort(); this.currentStreamAbort = null; }
    if (this.streamSub) { this.streamSub.unsubscribe(); this.streamSub = null; }
  }
}
