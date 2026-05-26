import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * AI 面板控制服务（全局单例）
 *
 * 职责：
 *   1. 控制 AI 面板的打开/关闭状态
 *   2. 管理面板打开时的上下文（Step 9 图表级分析）
 */
@Injectable({ providedIn: 'root' })
export class AiPanelService {
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  private _contextType: string | null = null;
  private _contextData: any = null;
  private _autoMessage: string | null = null;

  get isOpen$(): Observable<boolean> {
    return this._isOpen$.asObservable();
  }

  get isOpen(): boolean {
    return this._isOpen$.getValue();
  }

  open(): void {
    this._isOpen$.next(true);
  }

  close(): void {
    this._isOpen$.next(false);
  }

  toggle(): void {
    this._isOpen$.next(!this._isOpen$.getValue());
  }

  openWithContext(chartType: string, chartData: any): void {
    this._contextType = chartType;
    this._contextData = chartData;
    this._isOpen$.next(true);
  }

  getContextType(): string | null {
    return this._contextType;
  }

  getContextData(): any {
    return this._contextData;
  }

  setAutoMessage(msg: string): void {
    this._autoMessage = msg;
  }

  consumeAutoMessage(): string | null {
    const msg = this._autoMessage;
    this._autoMessage = null;
    return msg;
  }

  clearContext(): void {
    this._contextType = null;
    this._contextData = null;
    this._autoMessage = null;
  }
}
