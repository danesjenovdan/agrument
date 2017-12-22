BEGIN TRANSACTION;
CREATE TABLE "users" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT NOT NULL,
	`username`	TEXT NOT NULL UNIQUE,
	`password`	TEXT NOT NULL,
	`group`	TEXT NOT NULL DEFAULT 'user',
	`token`	TEXT
);
CREATE TABLE "sessions" ("sid" varchar(255), "sess" text not null, "expired" datetime not null, primary key ("sid"));
CREATE TABLE "posts" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`date`	INTEGER NOT NULL,
	`author`	INTEGER NOT NULL,
	`title`	TEXT NOT NULL,
	`content`	TEXT NOT NULL,
	`description`	TEXT NOT NULL,
	`imageURL`	TEXT NOT NULL,
	`imageCaption`	TEXT NOT NULL,
	`hasEmbed`	INTEGER NOT NULL DEFAULT 0,
	`embedCode`	TEXT,
	`embedHeight`	TEXT,
	`deadline`	INTEGER NOT NULL,
	`rights`	TEXT NOT NULL,
	`type`	TEXT NOT NULL DEFAULT 'pending',
	`imageCaptionURL`	TEXT
);
CREATE TABLE `pinned` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`author`	INTEGER NOT NULL,
	`timestamp`	INTEGER NOT NULL,
	`message`	TEXT NOT NULL
);
CREATE TABLE `votes` (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    `author` INTEGER NOT NULL,
    `post` INTEGER NOT NULL,
    `vote` TEXT NOT NULL
);
COMMIT;