import { mysqlTable, int, varchar, datetime } from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';
import { z } from 'zod';
import { usersToRoles } from './usersToRoles';

// 用户表定义
export const users = mysqlTable('users', {
  userId: int('user_id').primaryKey().autoincrement().notNull(),
  // roleId: int('role_id').notNull().default(1),
  userName: varchar('user_name', { length: 30 }).notNull(),
  // phone: varchar('phone', { length: 11 }).notNull().default(''),
  // sex: char('sex', { length: 1 }).notNull().default('0'),
  password: varchar('password', { length: 200 }).notNull().default(''),
  createBy: varchar('create_by', { length: 64 }).notNull().default(''),
  createTime: datetime('create_time', { fsp: 6 }).default(
    sql`CURRENT_TIMESTAMP(6)`,
  ),
  updateBy: varchar('update_by', { length: 64 }).notNull().default(''),
  updateTime: datetime('update_time', { fsp: 6 }).default(
    sql`CURRENT_TIMESTAMP(6)`,
  ),
});

// 用户表关系
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  usersToRoles: many(usersToRoles),
}));

// 帖子表定义
export const posts = mysqlTable('posts', {
  id: int('posts_id').primaryKey().autoincrement().notNull(),
  title: varchar('posts_title', { length: 30 }).notNull(),
  content: varchar('posts_content', { length: 225 }).notNull(),
  authorId: int('author_id').notNull(),
});

// 帖子表关系
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.userId],
  }),
}));

// 使用纯 Zod 定义验证 schema
export const insertPostSchema = z.object({
  title: z
    .string({
      required_error: '标题是必填项',
      invalid_type_error: '标题必须是字符串',
    })
    .min(1, '标题不能为空')
    .max(30, '标题最多30个字符'),
  content: z
    .string({
      required_error: '内容是必填项',
      invalid_type_error: '内容必须是字符串',
    })
    .min(1, '内容不能为空')
    .max(225, '内容最多225个字符'),
  authorId: z
    .number({
      required_error: '作者ID是必填项',
      invalid_type_error: '作者ID必须是数字',
    })
    .int('作者ID必须是整数')
    .min(1, '作者ID必须是正整数'),
});

export const insertUserSchema = z.object({
  userId: z.number(),
  userName: z
    .string()
    .min(2, '用户名至少需要2个字符')
    .max(30, '用户名最多30个字符'),
  // phone: z.string().regex(/^1[3-9]\d{9}$/, '手机号格式不正确'),
  // sex: z.enum(['0', '1', '2'], {
  //   errorMap: () => ({ message: '性别必须是：0-未知，1-男，2-女' }),
  // }),
  password: z.string().min(6, '密码至少6个字符').max(20, '密码最多20个字符'),
});

// 类型导出
export type User = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type CreatePostDto = z.infer<typeof insertPostSchema>;
