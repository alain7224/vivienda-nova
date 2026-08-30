ALTER TABLE `propertyLeads` ADD `latitude` varchar(32);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `longitude` varchar(32);--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `referenceImages` text;--> statement-breakpoint
ALTER TABLE `propertyLeads` ADD `attributionCode` varchar(160) DEFAULT 'MARTINEZ' NOT NULL;