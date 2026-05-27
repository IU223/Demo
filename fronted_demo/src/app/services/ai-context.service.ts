import { Injectable } from '@angular/core';

/**
 * AI 数据上下文服务（全局单例）
 *
 * 职责：
 *   1. 收集当前页面的仪表盘聚合统计数据
 *   2. 将数据提供给 AI 面板，随消息一起发送给后端
 *   3. 页面切换时由组件在 ngOnDestroy 中清理
 */
@Injectable({ providedIn: 'root' })
export class AiContextService {
  private contextMap = new Map<string, any>();

  registerContext(key: string, data: any): void {
    this.contextMap.set(key, data);
  }

  unregisterContext(key: string): void {
    this.contextMap.delete(key);
  }

  getFullContext(): Record<string, any> {
    if (this.contextMap.size === 0) return {};
    const result: Record<string, any> = {};
    this.contextMap.forEach((v, k) => (result[k] = v));
    return result;
  }

  hasContext(): boolean {
    return this.contextMap.size > 0;
  }

  clearContext(): void {
    this.contextMap.clear();
  }
}
