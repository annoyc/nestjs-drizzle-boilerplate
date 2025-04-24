CREATE TABLE `posts` (
	`posts_id` int AUTO_INCREMENT NOT NULL,
	`posts_title` varchar(30) NOT NULL,
	`posts_content` varchar(225) NOT NULL,
	`author_id` int NOT NULL,
	CONSTRAINT `posts_posts_id` PRIMARY KEY(`posts_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`user_name` varchar(30) NOT NULL,
	`password` varchar(200) NOT NULL DEFAULT '',
	`create_by` varchar(64) NOT NULL DEFAULT '',
	`create_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	`update_by` varchar(64) NOT NULL DEFAULT '',
	`update_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`role_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL DEFAULT '',
	`create_by` varchar(64) NOT NULL DEFAULT '',
	`create_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	`update_by` varchar(64) NOT NULL DEFAULT '',
	`update_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `roles_role_id` PRIMARY KEY(`role_id`)
);
--> statement-breakpoint
CREATE TABLE `users_to_roles` (
	`user_id` int NOT NULL,
	`role_id` int NOT NULL,
	CONSTRAINT `users_to_roles_user_id_role_id_pk` PRIMARY KEY(`user_id`,`role_id`)
);
--> statement-breakpoint
ALTER TABLE `users_to_roles` ADD CONSTRAINT `users_to_roles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_to_roles` ADD CONSTRAINT `users_to_roles_role_id_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE no action ON UPDATE no action;