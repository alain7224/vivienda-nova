CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(180) NOT NULL,
	`city` varchar(100) NOT NULL,
	`zone` varchar(140) NOT NULL,
	`type` varchar(80) NOT NULL,
	`price` varchar(80) NOT NULL,
	`priceValue` int NOT NULL,
	`bedrooms` int NOT NULL,
	`bathrooms` int NOT NULL,
	`surface` int NOT NULL,
	`description` text NOT NULL,
	`imageUrl` text NOT NULL,
	`tag` varchar(100) NOT NULL DEFAULT 'Nueva oportunidad',
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`linkMode` enum('capture','redirect','both') NOT NULL DEFAULT 'both',
	`externalUrl` text,
	`referralParameter` varchar(80) NOT NULL DEFAULT 'ref',
	`referralCode` varchar(160),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `properties_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `propertyLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`message` text NOT NULL,
	`status` enum('new','contacted','referred') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referralClicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`destinationUrl` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referralClicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `properties_status_idx` ON `properties` (`status`);--> statement-breakpoint
CREATE INDEX `properties_city_idx` ON `properties` (`city`);--> statement-breakpoint
CREATE INDEX `property_leads_property_idx` ON `propertyLeads` (`propertyId`);--> statement-breakpoint
CREATE INDEX `property_leads_created_idx` ON `propertyLeads` (`createdAt`);--> statement-breakpoint
CREATE INDEX `referral_clicks_property_idx` ON `referralClicks` (`propertyId`);--> statement-breakpoint
CREATE INDEX `referral_clicks_created_idx` ON `referralClicks` (`createdAt`);