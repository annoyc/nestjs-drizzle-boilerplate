ALTER TABLE `users_to_roles` DROP FOREIGN KEY `users_to_roles_user_id_users_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `users_to_roles` DROP FOREIGN KEY `users_to_roles_role_id_roles_role_id_fk`;
--> statement-breakpoint
ALTER TABLE `users_to_roles` ADD CONSTRAINT `users_to_roles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_to_roles` ADD CONSTRAINT `users_to_roles_role_id_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE cascade ON UPDATE no action;