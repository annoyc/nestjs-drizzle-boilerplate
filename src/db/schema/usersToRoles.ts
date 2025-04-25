import { relations } from 'drizzle-orm';
import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { users } from './user';
import { roles } from './role';

export const usersToRoles = mysqlTable(
  'users_to_roles',
  {
    userId: int('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    roleId: int('role_id')
      .notNull()
      .references(() => roles.roleId, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersToRoles.userId],
    references: [users.userId],
    relationName: 'user_relation', // 添加唯一关系名称
  }),
  role: one(roles, {
    fields: [usersToRoles.roleId],
    references: [roles.roleId],
    relationName: 'role_relation', // 添加唯一关系名称=
  }),
}));
