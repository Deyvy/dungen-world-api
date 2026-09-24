ALTER TABLE `classes`
    ADD COLUMN `damage_dice` TINYINT NULL;

UPDATE `classes`
SET `damage_dice` = 10
WHERE `id` = 1;

UPDATE `classes`
SET `damage_dice` = 4
WHERE `id` = 2;

ALTER TABLE `classes`
    MODIFY COLUMN `damage_dice` TINYINT NOT NULL;
