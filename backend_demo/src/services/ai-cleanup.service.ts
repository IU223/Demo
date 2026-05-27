import {ChatSessionRepository, ChatMessageRepository} from '../repositories';

/**
 * AI 对话数据清理
 *
 * 物理删除已软删除超过 90 天的会话及其关联消息。
 * 通过外部脚本定期调用：node ./dist/cleanup-sessions.js
 */
export async function cleanupExpiredSessions(
  sessionRepo: ChatSessionRepository,
  messageRepo: ChatMessageRepository,
  retentionDays = 90,
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const expired = await sessionRepo.find({
    where: {
      is_deleted: true,
      updated_at: {lt: cutoffDate.toISOString()},
    },
  });

  let deletedCount = 0;

  for (const session of expired) {
    if (session.session_id == null) continue;

    await messageRepo.deleteAll({session_id: session.session_id});
    await sessionRepo.deleteById(session.session_id);
    deletedCount++;

    console.log(
      `[AI Cleanup] 已清理会话 session_id=${session.session_id}` +
        ` | title="${session.title}" | employee=${session.employee_id}`,
    );
  }

  console.log(`[AI Cleanup] 清理完成，共删除 ${deletedCount} 个过期会话`);
  return deletedCount;
}
