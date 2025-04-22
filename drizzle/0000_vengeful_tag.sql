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
	`phone` varchar(11) NOT NULL DEFAULT '',
	`sex` char(1) NOT NULL DEFAULT '0',
	`password` varchar(200) NOT NULL DEFAULT '',
	`create_by` varchar(64) NOT NULL DEFAULT '',
	`create_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	`update_by` varchar(64) NOT NULL DEFAULT '',
	`update_time` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
