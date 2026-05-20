import { BackendDemoApplication } from './application';
import { EmployeeRepository } from './repositories';
import { hashPassword } from './services/hash.service';

async function migratePasswords() {
  const app = new BackendDemoApplication();
  await app.boot();
  await app.start();

  const employeeRepo = await app.getRepository(EmployeeRepository);
  const employees = await employeeRepo.find();

  let count = 0;
  for (const emp of employees) {
    // 跳过已经是 bcrypt 格式的密码（bcrypt 哈希以 $2a$ 或 $2b$ 开头）
    if (emp.password && !emp.password.startsWith('$2')) {
      const hashed = await hashPassword(emp.password);
      await employeeRepo.updateById(emp.employee_id, { password: hashed });
      count++;
      console.log(`✅ 已哈希: ${emp.employee_id}`);
    }
  }

  console.log(`\n迁移完成，共处理 ${count} 条记录`);
  await app.stop();
  process.exit(0);
}

migratePasswords().catch(err => {
  console.error('迁移失败:', err);
  process.exit(1);
});
