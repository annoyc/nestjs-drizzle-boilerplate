import { mysqlTable, varchar, datetime, int } from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';
import { z } from 'zod';
import { usersToRoles } from './usersToRoles';

// 角色表定义
export const roles = mysqlTable('roles', {
  roleId: int('role_id').primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 64 }).notNull().default(''),
  createBy: varchar('create_by', { length: 64 }).notNull().default(''),
  createTime: datetime('create_time', { fsp: 6 }).default(
    sql`CURRENT_TIMESTAMP(6)`,
  ),
  updateBy: varchar('update_by', { length: 64 }).notNull().default(''),
  updateTime: datetime('update_time', { fsp: 6 }).default(
    sql`CURRENT_TIMESTAMP(6)`,
  ),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  usersToRoles: many(usersToRoles),
}));

export const insertRoleSchema = z.object({
  roleId: z.number(),
  name: z
    .string()
    .min(1, '角色名至少需要1个字符')
    .max(30, '角色名最多30个字符'),
});

// 类型导出
export type Role = z.infer<typeof insertRoleSchema>;
