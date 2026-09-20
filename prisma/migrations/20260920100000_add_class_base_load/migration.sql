ALTER TABLE `classes`
    ADD COLUMN `base_load` TINYINT NULL;

UPDATE `classes`
SET `base_load` = 12
WHERE `id` = 1 AND `name` = 'Guerrero';

UPDATE `classes`
SET `base_load` = 7
WHERE `id` = 2 AND `name` = 'Mago';

ALTER TABLE `classes`
    MODIFY COLUMN `base_load` TINYINT NOT NULL;
