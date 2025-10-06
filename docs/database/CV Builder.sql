CREATE TABLE `User` (
  `_id` string PRIMARY KEY,
  `displayName` string,
  `avatar` string,
  `email` string UNIQUE,
  `slug` string,
  `createdAt` Date
);

CREATE TABLE `Account` (
  `_id` string PRIMARY KEY,
  `email` string,
  `password` string,
  `provider` string,
  `isVerified` boolean
);

CREATE TABLE `KeyStore` (
  `_id` string PRIMARY KEY,
  `userId` string,
  `hashedRefreshToken` string,
  `refreshTokensUsed` string[]
);

CREATE TABLE `Information` (
  `_id` string,
  `label` string,
  `value` String,
  `order` number
);

CREATE TABLE `CV` (
  `_id` string PRIMARY KEY,
  `userId` string,
  `avatar` string,
  `information` Information[],
  `overview` string,
  `heading` string,
  `subHeading` string,
  `lastEdited` Date,
  `createdAt` Date
);

CREATE TABLE `EducationItem` (
  `_id` string,
  `schoolName` string,
  `degree` string,
  `major` string,
  `startDate` Date,
  `endDate` Date,
  `order` number
);

CREATE TABLE `EducationSection` (
  `_id` string PRIMARY KEY,
  `cvId` string,
  `educationItems` EducationItem[]
);

CREATE TABLE `ExperienceItem` (
  `_id` string,
  `startDate` Date,
  `endDate` Date,
  `company` string,
  `position` string,
  `description` string,
  `order` number
);

CREATE TABLE `ExperienceSection` (
  `_id` string PRIMARY KEY,
  `cvId` string,
  `experienceItems` ExperienceItem[]
);

CREATE TABLE `Project` (
  `_id` string PRIMARY KEY,
  `title` string,
  `subTitle` string,
  `information` Information[],
  `order` number
);

CREATE TABLE `ProjectSection` (
  `_id` string,
  `cvId` string,
  `projects` Project[]
);

CREATE TABLE `Skill` (
  `_id` string,
  `label` string,
  `value` string
);

CREATE TABLE `SkillsSection` (
  `_id` string,
  `cvId` string,
  `skills` Skill[]
);

ALTER TABLE `KeyStore` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`_id`);

ALTER TABLE `CV` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`_id`);

ALTER TABLE `Information` ADD FOREIGN KEY (`_id`) REFERENCES `CV` (`information`);

ALTER TABLE `EducationSection` ADD FOREIGN KEY (`cvId`) REFERENCES `CV` (`_id`);

ALTER TABLE `EducationItem` ADD FOREIGN KEY (`_id`) REFERENCES `EducationSection` (`educationItems`);

ALTER TABLE `ExperienceSection` ADD FOREIGN KEY (`cvId`) REFERENCES `CV` (`_id`);

ALTER TABLE `ExperienceItem` ADD FOREIGN KEY (`_id`) REFERENCES `ExperienceSection` (`experienceItems`);

ALTER TABLE `Project` ADD FOREIGN KEY (`_id`) REFERENCES `ProjectSection` (`projects`);

ALTER TABLE `Account` ADD FOREIGN KEY (`email`) REFERENCES `User` (`email`);

ALTER TABLE `ProjectSection` ADD FOREIGN KEY (`cvId`) REFERENCES `CV` (`_id`);

ALTER TABLE `Skill` ADD FOREIGN KEY (`_id`) REFERENCES `SkillsSection` (`skills`);

ALTER TABLE `SkillsSection` ADD FOREIGN KEY (`cvId`) REFERENCES `CV` (`_id`);
