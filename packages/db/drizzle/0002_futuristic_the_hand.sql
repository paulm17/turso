ALTER TABLE dam_image ADD `file_id` text REFERENCES dam_file(id);--> statement-breakpoint
ALTER TABLE dam_image ADD `size_id` text REFERENCES dam_image_size(id);--> statement-breakpoint
ALTER TABLE dam_image_color ADD `file_id` text REFERENCES dam_file(id);--> statement-breakpoint
ALTER TABLE medusa_gift_card_timelines ADD `gift_card_id` text REFERENCES medusa_gift_cards(id);--> statement-breakpoint
ALTER TABLE medusa_gift_cards ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_categories ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_categories ADD `parent_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_category_images ADD `category_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_category_images ADD `dam_file_id` text REFERENCES dam_file(id);--> statement-breakpoint
ALTER TABLE medusa_category_images ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_discount_exclude_categories ADD `discount_id` text REFERENCES medusa_discounts(id);--> statement-breakpoint
ALTER TABLE medusa_discount_exclude_categories ADD `category_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_discount_include_categories ADD `discount_id` text REFERENCES medusa_discounts(id);--> statement-breakpoint
ALTER TABLE medusa_discount_include_categories ADD `category_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_discount_products ADD `discount_id` text REFERENCES medusa_discounts(id);--> statement-breakpoint
ALTER TABLE medusa_discount_products ADD `product_id` text REFERENCES medusa_products(id);--> statement-breakpoint
ALTER TABLE medusa_discounts ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_brands ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_celebrations ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_collections ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_colors ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_images ADD `dam_file_id` text REFERENCES dam_file(id);--> statement-breakpoint
ALTER TABLE medusa_product_images ADD `product_id` text REFERENCES medusa_products(id);--> statement-breakpoint
ALTER TABLE medusa_product_images ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_madeby ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_madewhen ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_occasions ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_pricing_types ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_product_types ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `brand_id` text REFERENCES medusa_product_brands(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `collection_id` text REFERENCES medusa_product_collections(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `color_id` text REFERENCES medusa_product_colors(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `celebration_id` text REFERENCES medusa_product_celebrations(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `country_id` text REFERENCES geo_country(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `made_by_id` text REFERENCES medusa_product_madeby(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `made_when_id` text REFERENCES medusa_product_madewhen(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `occasion_id` text REFERENCES medusa_product_occasions(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `pricing_type_id` text REFERENCES medusa_product_pricing_types(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `product_type_id` text REFERENCES medusa_product_types(id);--> statement-breakpoint
ALTER TABLE medusa_products ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
ALTER TABLE medusa_promotion_exclude_categories ADD `discount_id` text REFERENCES medusa_promotions(id);--> statement-breakpoint
ALTER TABLE medusa_promotion_exclude_categories ADD `category_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_promotion_include_categories ADD `discount_id` text REFERENCES medusa_promotions(id);--> statement-breakpoint
ALTER TABLE medusa_promotion_include_categories ADD `category_id` text REFERENCES medusa_categories(id);--> statement-breakpoint
ALTER TABLE medusa_promotions ADD `store_id` text REFERENCES medusa_stores(id);--> statement-breakpoint
CREATE UNIQUE INDEX `geo_country_id_unique` ON `geo_country` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `language_id_unique` ON `language` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_file_string_id_unique` ON `dam_file_string` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_file_tag_type_id_unique` ON `dam_file_tag_type` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_file_type_id_unique` ON `dam_file_type` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_image_id_unique` ON `dam_image` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_image_color_id_unique` ON `dam_image_color` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_image_size_id_unique` ON `dam_image_size` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `key_id_unique` ON `key` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_id_unique` ON `session` (`id`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/