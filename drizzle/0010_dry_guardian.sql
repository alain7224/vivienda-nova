CREATE TABLE `propertyInviteLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tokenHash` varchar(64) NOT NULL,
	`label` varchar(160) NOT NULL,
	`createdByUserId` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `propertyInviteLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `propertyInviteLinks_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE INDEX `property_invite_links_active_idx` ON `propertyInviteLinks` (`revokedAt`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `property_invite_links_creator_idx` ON `propertyInviteLinks` (`createdByUserId`);