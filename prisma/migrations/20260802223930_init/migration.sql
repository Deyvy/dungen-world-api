-- CreateTable
CREATE TABLE `character_bonds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `text` TEXT NOT NULL,
    `is_example` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_bond_character`(`character_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_content` (
    `character_id` INTEGER NOT NULL,
    `content_id` INTEGER NOT NULL,
    `acquired_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_character_content_content`(`content_id`),
    PRIMARY KEY (`character_id`, `content_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_element_options` (
    `character_id` INTEGER NOT NULL,
    `element_id` INTEGER NOT NULL,
    `option_id` INTEGER NOT NULL,

    INDEX `fk_character_option_element`(`element_id`),
    INDEX `fk_character_option_option`(`option_id`),
    PRIMARY KEY (`character_id`, `element_id`, `option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_element_values` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `character_id` INTEGER NOT NULL,
    `element_id` INTEGER NOT NULL,
    `value` TEXT NULL,

    INDEX `fk_value_character`(`character_id`),
    INDEX `fk_value_element`(`element_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `character_spells` (
    `character_id` INTEGER NOT NULL,
    `spell_id` INTEGER NOT NULL,
    `known` BOOLEAN NULL DEFAULT true,
    `prepared` BOOLEAN NULL DEFAULT false,

    INDEX `fk_character_spell_spell`(`spell_id`),
    PRIMARY KEY (`character_id`, `spell_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `characters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `level` TINYINT NULL DEFAULT 1,
    `appearance` TEXT NULL,
    `hp_current` TINYINT NULL,
    `strength` TINYINT NULL,
    `dexterity` TINYINT NULL,
    `constitution` TINYINT NULL,
    `intelligence` TINYINT NULL,
    `wisdom` TINYINT NULL,
    `charisma` TINYINT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_character_class`(`class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `type` ENUM('ALIGNMENT', 'RACE', 'MOVE', 'EQUIPMENT') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `code` VARCHAR(100) NULL,
    `slug` VARCHAR(150) NULL,
    `content` MEDIUMTEXT NULL,
    `move_type` ENUM('INITIAL', 'ADVANCED') NULL,
    `level_required` TINYINT NULL,
    `metadata` LONGTEXT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `sort_order` INTEGER NULL DEFAULT 0,
    `version` INTEGER NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `slug`(`slug`),
    INDEX `fk_content_class`(`class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `appearance` TEXT NULL,
    `hit_points` TINYINT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_element_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `element_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NULL,
    `sort_order` INTEGER NULL DEFAULT 0,

    INDEX `fk_option_element`(`element_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_elements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_id` INTEGER NOT NULL,
    `type` ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'CHECKBOX_GROUP', 'RADIO_GROUP', 'SELECT') NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `code` VARCHAR(100) NULL,
    `min_select` TINYINT NULL,
    `max_select` TINYINT NULL,
    `metadata` LONGTEXT NULL,
    `sort_order` INTEGER NULL DEFAULT 0,

    INDEX `fk_element_content`(`content_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spell_lists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    INDEX `fk_spell_list_class`(`class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spells` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `spell_list_id` INTEGER NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NULL,
    `spell_level` TINYINT NOT NULL,
    `description` MEDIUMTEXT NULL,
    `metadata` LONGTEXT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `sort_order` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `slug`(`slug`),
    INDEX `fk_spell_list`(`spell_list_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `character_bonds` ADD CONSTRAINT `fk_bond_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_content` ADD CONSTRAINT `fk_character_content_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_content` ADD CONSTRAINT `fk_character_content_content` FOREIGN KEY (`content_id`) REFERENCES `class_content`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_element_options` ADD CONSTRAINT `fk_character_option_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_element_options` ADD CONSTRAINT `fk_character_option_element` FOREIGN KEY (`element_id`) REFERENCES `content_elements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_element_options` ADD CONSTRAINT `fk_character_option_option` FOREIGN KEY (`option_id`) REFERENCES `content_element_options`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_element_values` ADD CONSTRAINT `fk_value_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_element_values` ADD CONSTRAINT `fk_value_element` FOREIGN KEY (`element_id`) REFERENCES `content_elements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_spells` ADD CONSTRAINT `fk_character_spell_character` FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `character_spells` ADD CONSTRAINT `fk_character_spell_spell` FOREIGN KEY (`spell_id`) REFERENCES `spells`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `fk_character_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `class_content` ADD CONSTRAINT `fk_content_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `content_element_options` ADD CONSTRAINT `fk_option_element` FOREIGN KEY (`element_id`) REFERENCES `content_elements`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `content_elements` ADD CONSTRAINT `fk_element_content` FOREIGN KEY (`content_id`) REFERENCES `class_content`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `spell_lists` ADD CONSTRAINT `fk_spell_list_class` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `spells` ADD CONSTRAINT `fk_spell_list` FOREIGN KEY (`spell_list_id`) REFERENCES `spell_lists`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
