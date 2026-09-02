ALTER TABLE `siteVisits` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `siteVisits` ADD `region` varchar(140);--> statement-breakpoint
ALTER TABLE `siteVisits` ADD `city` varchar(140);--> statement-breakpoint
ALTER TABLE `siteVisits` ADD `latitude` double;--> statement-breakpoint
ALTER TABLE `siteVisits` ADD `longitude` double;--> statement-breakpoint
ALTER TABLE `siteVisits` ADD `entrySource` varchar(320);--> statement-breakpoint
CREATE INDEX `site_visits_geo_idx` ON `siteVisits` (`country`,`region`,`city`);