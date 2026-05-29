import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatMessage } from '../../../models/chat-message';
import { AiTemplateBarComponent, AnalysisTemplate } from '../ai-template-bar/ai-template-bar.component';  // ★ 新增

/**
 * AI 消息列表子组件
 *
 * Step 11 改动：
 *   - 动态加载 marked + dompurify（不计入 initial bundle）
 *   - AI 回复以 Markdown 渲染，含缓存优化
 */
@Component({
  selector: 'app-ai-chat-list',
  standalone: true,
  imports: [CommonModule, AiTemplateBarComponent],    // ★ 新增
  templateUrl: './ai-chat-list.component.html',
  styleUrls: ['./ai-chat-list.component.scss'],
})
export class AiChatListComponent implements OnChanges, AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() isWaiting = false;

  // ★ 新增：模板相关 Input/Output
  @Input() templates: AnalysisTemplate[] = [];
  @Input() templatesLoading = false;
  @Input() templatesDisabled = false;
  @Output() templateSelected = new EventEmitter<AnalysisTemplate>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  renderedMessages: SafeHtml[] = [];

  private shouldScroll = false;
  private marked: any = null;
  private DOMPurify: any = null;
  private libsLoaded = false;
  private libsLoading = false;
  private renderCache = new Map<string, SafeHtml>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateRenderedMessages();
    this.shouldScroll = true;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ★ 新增：模板选择事件转发
  onTemplateSelect(template: AnalysisTemplate): void {
    this.templateSelected.emit(template);
  }

  // ==================== Markdown 渲染 ====================

  private updateRenderedMessages(): void {
    if (!this.libsLoaded) {
      if (!this.libsLoading) {
        this.loadMarkdownLibs();
      }
      this.renderedMessages = this.messages.map(m =>
        this.toSafeHtml(this.escapeHtml(m.content || '')),
      );
      return;
    }
    this.doRender();
  }

  private async loadMarkdownLibs(): Promise<void> {
    this.libsLoading = true;
    try {
      const [markedMod, dpMod] = await Promise.all([
        import('marked'),
        import('dompurify'),
      ]);
      this.marked = markedMod.marked;
      this.DOMPurify = (dpMod as any)['default'] ?? dpMod;
      this.libsLoaded = true;
      this.doRender();
    } catch (err) {
      console.warn('[Markdown] 加载渲染库失败，使用纯文本显示', err);
      this.libsLoading = false;
    }
  }

  private doRender(): void {
    this.renderedMessages = this.messages.map((msg, i) => {
      if (msg.role !== 'assistant' || !msg.content) {
        return this.toSafeHtml('');
      }

      const isStreaming = this.isWaiting && i === this.messages.length - 1;

      if (!isStreaming) {
        const cached = this.renderCache.get(msg.content);
        if (cached) return cached;
      }

      try {
        const rawHtml = this.marked.parse(msg.content) as string;
        const cleanHtml = this.DOMPurify.sanitize(rawHtml);
        const safeHtml = this.toSafeHtml(cleanHtml);

        if (!isStreaming) {
          this.renderCache.set(msg.content, safeHtml);
        }

        return safeHtml;
      } catch {
        return this.toSafeHtml(this.escapeHtml(msg.content));
      }
    });
  }

  // ==================== 工具方法 ====================

  private toSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch { /* ignore */ }
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
