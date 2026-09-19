-- CreateTable
CREATE TABLE `equipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NULL,
    `description` TEXT NULL,
    `metadata` LONGTEXT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `sort_order` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `equipment_slug`(`slug`),
    INDEX `idx_equipment_active`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Link class creation options to canonical equipment. Existing rows remain
-- unlinked until a reviewed data migration maps them to catalog records.
ALTER TABLE `class_content` ADD COLUMN `equipment_id` INTEGER NULL;
CREATE INDEX `fk_class_content_equipment` ON `class_content`(`equipment_id`);

-- CreateTable
CREATE TABLE `character_equipment` (
    `character_id` INTEGER NOT NULL,
    `equipment_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `uses_remaining` INTEGER NULL,

    INDEX `fk_character_equipment_equipment`(`equipment_id`),
    PRIMARY KEY (`character_id`, `equipment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `class_content` ADD CONSTRAINT `fk_class_content_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_equipment` ADD CONSTRAINT `fk_character_equipment_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
ALTER TABLE `character_equipment` ADD CONSTRAINT `fk_character_equipment_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
