import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  RestBindings,
  Request,
} from '@loopback/rest';
import {AnalysisTemplateRepository} from '../repositories';

/**
 * AI 分析模板 + 智能洞察控制器（空壳）
 *
 * Step 10 填充：
 *   GET /ai/templates    → 获取预置分析模板列表
 *
 * Step 12 填充：
 *   GET /ai/insights     → 获取 AI 自动发现的异常/预警数据
 */
export class AiTemplateController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(AnalysisTemplateRepository)
    private analysisTemplateRepository: AnalysisTemplateRepository,
  ) {}

  // ==================== Step 10 实现 ====================
  // GET /ai/templates

  // ==================== Step 12 实现 ====================
  // GET /ai/insights
}
