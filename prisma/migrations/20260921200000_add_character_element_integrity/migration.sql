ALTER TABLE `character_element_values`
    ADD UNIQUE INDEX `character_element_values_character_id_element_id_key` (`character_id`, `element_id`);

ALTER TABLE `content_element_options`
    ADD UNIQUE INDEX `content_element_options_id_element_id_key` (`id`, `element_id`);

ALTER TABLE `character_element_options`
    DROP FOREIGN KEY `fk_character_option_option`;

ALTER TABLE `character_element_options`
    DROP INDEX `fk_character_option_option`;

ALTER TABLE `character_element_options`
    ADD INDEX `fk_character_option_option_element` (`option_id`, `element_id`),
    ADD CONSTRAINT `fk_character_option_option_element`
        FOREIGN KEY (`option_id`, `element_id`)
        REFERENCES `content_element_options` (`id`, `element_id`)
        ON DELETE CASCADE
        ON UPDATE RESTRICT;
