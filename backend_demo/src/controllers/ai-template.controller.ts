import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  get,
  response,
  RestBindings,
  Request,
} from '@loopback/rest';
import { AnalysisTemplate } from '../models';
import { AnalysisTemplateRepository } from '../repositories';

/**
 * AI 分析模板控制器
 *
 * Step 10：GET /ai/templates → 获取预置分析模板列表
 * Step 12：GET /ai/insights  → 获取 AI 自动发现的异常/预警数据（待实现）
 */
export class AiTemplateController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @repository(AnalysisTemplateRepository)
    private analysisTemplateRepository: AnalysisTemplateRepository,
  ) { }

  // ==================== Step 10: GET /ai/templates ====================

  @get('/ai/templates')
  @response(200, {
    description: 'Array of AnalysisTemplate instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              template_id: { type: 'number' },
              title: { type: 'string' },
              prompt: { type: 'string' },
              category: { type: 'string' },
              sort_order: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async getTemplates(): Promise<AnalysisTemplate[]> {
    return this.analysisTemplateRepository.find({
      order: ['sort_order ASC', 'template_id ASC'],
    });
  }

  // ==================== Step 12 实现（待填充） ====================
  // GET /ai/insights
}
