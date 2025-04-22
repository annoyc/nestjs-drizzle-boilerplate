ALTER TABLE `users` ADD `phone` varchar(11) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phonenumber`;