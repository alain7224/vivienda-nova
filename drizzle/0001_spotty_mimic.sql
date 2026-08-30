CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`referralParameter` varchar(80) NOT NULL DEFAULT 'ref',
	`referralCode` varchar(160),
	`attributionNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `properties` ADD `vendorId` int;--> statement-breakpoint
CREATE INDEX `vendors_name_idx` ON `vendors` (`name`);--> statement-breakpoint
CREATE INDEX `properties_vendor_idx` ON `properties` (`vendorId`);