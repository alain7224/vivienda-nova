CREATE TABLE `commissionOperations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`propertyId` int,
	`vendorId` int,
	`operationType` enum('property','construction','product') NOT NULL DEFAULT 'property',
	`clientName` varchar(160) NOT NULL,
	`title` varchar(220) NOT NULL,
	`address` varchar(300) NOT NULL,
	`city` varchar(140) NOT NULL,
	`province` varchar(140) NOT NULL,
	`country` varchar(100) NOT NULL DEFAULT 'España',
	`salePrice` int NOT NULL,
	`commissionPercent` int NOT NULL,
	`commissionAmount` int NOT NULL,
	`commissionStatus` enum('expected','pending','paid','cancelled') NOT NULL DEFAULT 'expected',
	`closedAt` timestamp,
	`paidAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commissionOperations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propertyTranslations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyId` int NOT NULL,
	`locale` varchar(12) NOT NULL,
	`title` varchar(240) NOT NULL,
	`city` varchar(140) NOT NULL,
	`zone` varchar(180) NOT NULL,
	`type` varchar(100) NOT NULL,
	`tag` varchar(140) NOT NULL,
	`description` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `propertyTranslations_id` PRIMARY KEY(`id`),
	CONSTRAINT `property_translation_locale_uq` UNIQUE(`propertyId`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bannerText` varchar(220) NOT NULL DEFAULT 'Vivienda Nova · Selección internacional',
	`bannerBackground` varchar(24) NOT NULL DEFAULT '#d95f42',
	`bannerColor` varchar(24) NOT NULL DEFAULT '#fffdf8',
	`bannerHeight` int NOT NULL DEFAULT 36,
	`bannerRotationSeconds` int NOT NULL DEFAULT 5,
	`cardStyle` enum('flat','three_d') NOT NULL DEFAULT 'flat',
	`enabledLocales` varchar(1000) NOT NULL DEFAULT 'es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteVisits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(80) NOT NULL,
	`locale` varchar(12) NOT NULL,
	`page` varchar(200) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `siteVisits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `properties` MODIFY COLUMN `linkMode` enum('capture','redirect','both') NOT NULL DEFAULT 'redirect';--> statement-breakpoint
ALTER TABLE `properties` MODIFY COLUMN `referralCode` varchar(160) NOT NULL DEFAULT 'MARTINEZ';--> statement-breakpoint
ALTER TABLE `propertyLeads` MODIFY COLUMN `propertyId` int;--> statement-breakpoint
ALTER TABLE `propertyLeads` MODIFY COLUMN `status` enum('new','contacted','sent_to_seller','in_follow_up','won','lost') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `vendors` MODIFY COLUMN `referralCode` varchar(160) NOT NULL DEFAULT 'MARTINEZ';--> statement-breakpoint
ALTER TABLE `properties` ADD `province` varchar(140);--> statement-breakpoint
ALTER TABLE `properties` ADD `country` varchar(100) DEFAULT 'España' NOT NULL;--> statement-breakpoint
ALTER TABLE `properties` ADD `address` varchar(300);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `leadType` enum('property','construction','product') DEFAULT 'property' NOT NULL;--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `preferredLocation` varchar(200);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `preferredProvince` varchar(140);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `budget` varchar(100);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `referralClicks` ADD `vendorId` int;--> statement-breakpoint
ALTER TABLE `referralClicks` ADD `channel` enum('direct','email','whatsapp','sms','phone') DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE `referralClicks` ADD `visitorId` varchar(80);--> statement-breakpoint
ALTER TABLE `vendors` ADD `contactMethod` enum('direct','email','whatsapp','sms','phone') DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` ADD `contactValue` text;--> statement-breakpoint
CREATE INDEX `commission_operations_status_idx` ON `commissionOperations` (`commissionStatus`);--> statement-breakpoint
CREATE INDEX `commission_operations_vendor_idx` ON `commissionOperations` (`vendorId`);--> statement-breakpoint
CREATE INDEX `commission_operations_closed_idx` ON `commissionOperations` (`closedAt`);--> statement-breakpoint
CREATE INDEX `property_translation_locale_idx` ON `propertyTranslations` (`locale`);--> statement-breakpoint
CREATE INDEX `site_visits_visitor_idx` ON `siteVisits` (`visitorId`);--> statement-breakpoint
CREATE INDEX `site_visits_created_idx` ON `siteVisits` (`createdAt`);--> statement-breakpoint
CREATE INDEX `property_leads_status_idx` ON `propertyLeads` (`status`);