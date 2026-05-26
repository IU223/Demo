import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  RestBindings,
  Request,
} from '@loopback/rest';
import {ChatSessionRepository, ChatMessageRepository} from '../repositories';

/**
 * AI 会话管理控制器（空壳）
 *
 * 拆分为独立 Controller，仅包含会话 CRUD 端点。
 *
 * Step 6 填充：
 *   GET    /ai/sessions       → 列表
 *   GET    /ai/sessions/:id   → 详情
 *   PATCH  /ai/sessions/:id   → 更新标题
 *   DELETE /ai/sessions/:id   → 软删除
 *
 * Step 7 填充：
 *   权限隔离逻辑（applyUserFilter）
 */
export class AiSessionController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(ChatSessionRepository)
    private chatSessionRepository: ChatSessionRepository,
    @repository(ChatMessageRepository)
    private chatMessageRepository: ChatMessageRepository,
  ) {}

  // ==================== Step 6 实现 ====================
  // GET    /ai/sessions
  // GET    /ai/sessions/:id
  // PATCH  /ai/sessions/:id
  // DELETE /ai/sessions/:id

  // ==================== Step 7 实现 ====================
  // private applyUserFilter(where?) — 权限隔离
}
