-- Drop only the unused identifiers requested by the API model cleanup.
ALTER TABLE `class_content`
    DROP INDEX `slug`,
    DROP COLUMN `code`,
    DROP COLUMN `version`,
    DROP COLUMN `slug`;

ALTER TABLE `equipment`
    DROP INDEX `equipment_slug`,
    DROP COLUMN `slug`;
