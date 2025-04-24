import { relations } from 'drizzle-orm';
import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { users } from './user';
import { roles } from './role';

export const usersToRoles = mysqlTable(
  'users_to_roles',
  {
    userId: int('user_id')
      .notNull()
      .references(() => users.userId),
    roleId: int('role_id')
      .notNull()
      .references(() => roles.roleId),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersToRoles.userId],
    references: [users.userId],
  }),
  role: one(roles, {
    fields: [usersToRoles.roleId],
    references: [roles.roleId],
  }),
}));
