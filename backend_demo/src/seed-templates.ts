import { BackendDemoApplication } from './application';
import { AnalysisTemplateRepository } from './repositories';

/**
 * 种子数据脚本：预插入分析模板
 *
 * 运行方式：npm run seed:templates
 *
 * 逻辑：
 *   - 如果 analysis_templates 表为空 → 插入 4 条预置模板
 *   - 如果已有数据 → 跳过，不重复插入
 */
async function seedTemplates() {
    const app = new BackendDemoApplication();
    await app.boot();
    await app.start();

    const templateRepo = await app.getRepository(AnalysisTemplateRepository);

    // 检查是否已有数据
    const existing = await templateRepo.count();
    if (existing.count > 0) {
        console.log(`[Seed] analysis_templates 已有 ${existing.count} 条记录，跳过插入`);
        await app.stop();
        process.exit(0);
        return;
    }

    // 预置模板数据
    const templates = [
        {
            title: '人员结构分析',
            category: 'structure',
            prompt: '请从在职/离职人数、厂别分布、性别比例等维度分析当前人员结构',
            sort_order: 1,
        },
        {
            title: '离职趋势分析',
            category: 'trend',
            prompt: '请分析近 6 个月的入职/离职趋势，识别异常月份并给出建议',
            sort_order: 2,
        },
        {
            title: '地区分布对比',
            category: 'region',
            prompt: '请分析各地区人员分布特征，并对比差异',
            sort_order: 3,
        },
        {
            title: '部门健康度',
            category: 'department',
            prompt: '请评估各部门的人员健康度，标注高风险部门',
            sort_order: 4,
        },
    ];

    for (const tpl of templates) {
        await templateRepo.create(tpl);
        console.log(`✅ 已插入模板: ${tpl.title}`);
    }

    console.log(`\n[Seed] 成功插入 ${templates.length} 条分析模板`);
    await app.stop();
    process.exit(0);
}

seedTemplates().catch(err => {
    console.error('[Seed] 插入失败:', err);
    process.exit(1);
});
