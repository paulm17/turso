CREATE TABLE `geo_country` (
	`id` text NOT NULL,
	`country_code` text NOT NULL,
	`country_iso3` text NOT NULL,
	`country_name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `language` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `dam_file` (
	`id` text NOT NULL,
	`parent_id` text,
	`old_parent_id` text,
	`path` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`comments` text,
	`copyright` text,
	`filename` text,
	`filesize` integer DEFAULT 0,
	`extension` text,
	`md5` text,
	`meta_data` text,
	`publication_date` text,
	`etag` text,
	`version_id` text,
	`url` text,
	`completed` integer DEFAULT 0,
	`perm_delete` integer DEFAULT 0,
	`file_type` text NOT NULL,
	`filter_country` text,
	`filter_orientation` text,
	`filter_size` integer DEFAULT 0,
	`filter_dpi` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`type` text,
	`mime` text,
	`user` text,
	FOREIGN KEY (`type`) REFERENCES `dam_file_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mime`) REFERENCES `dam_file_mime_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dam_file_mime_type` (
	`id` text NOT NULL,
	`mime_type` text NOT NULL,
	`extension` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`type_id` text,
	FOREIGN KEY (`type_id`) REFERENCES `dam_file_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dam_file_string` (
	`id` text NOT NULL,
	`tag` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`file_id` text,
	`type_id` text,
	FOREIGN KEY (`file_id`) REFERENCES `dam_file`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`type_id`) REFERENCES `dam_file_tag_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dam_file_tag_type` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `dam_file_type` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `dam_image` (
	`id` text NOT NULL,
	`width` integer DEFAULT 0 NOT NULL,
	`height` integer DEFAULT 0 NOT NULL,
	`url` text,
	`base64` text,
	`etag` text,
	`version_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `dam_image_color` (
	`id` text NOT NULL,
	`name` text NOT NULL,
	`background_color` text NOT NULL,
	`text_color` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `dam_image_size` (
	`id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_gift_card_timelines` (
	`id` text,
	`snapshot` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_gift_cards` (
	`id` text,
	`code` text NOT NULL,
	`balance` real DEFAULT 0,
	`state` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_categories` (
	`id` text,
	`name` text NOT NULL,
	`description` text,
	`page_title` text,
	`meta_description` text,
	`slug` text NOT NULL,
	`enabled` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_category_images` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_discount_exclude_categories` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_discount_include_categories` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_discount_products` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_discounts` (
	`id` text,
	`name` text NOT NULL,
	`description` text,
	`discount_type` text DEFAULT 'orderTotal' NOT NULL,
	`amount_type` text DEFAULT 'amount' NOT NULL,
	`amount` integer NOT NULL,
	`req_min_order_total` integer DEFAULT 0,
	`req_min_product_total` integer DEFAULT 0,
	`req_max_product_total` integer DEFAULT 0,
	`max_discount_amt` integer DEFAULT 0,
	`add_product_to_card` integer DEFAULT false NOT NULL,
	`limit_qty` integer DEFAULT 0,
	`limit_customer` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `medusa_product_brands` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_celebrations` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_collections` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_colors` (
	`id` text,
	`name` text NOT NULL,
	`hex` text NOT NULL,
	`red` integer DEFAULT 0 NOT NULL,
	`green` integer DEFAULT 0 NOT NULL,
	`blue` integer DEFAULT 0 NOT NULL,
	`hue` real DEFAULT 0 NOT NULL,
	`saturation` real DEFAULT 0 NOT NULL,
	`lightness` real DEFAULT 0 NOT NULL,
	`text_color` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_images` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_madeby` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_madewhen` (
	`id` text,
	`label` text NOT NULL,
	`text` text NOT NULL,
	`value` text NOT NULL,
	`pos` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_occasions` (
	`id` text,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_pricing_types` (
	`id` text,
	`label` text NOT NULL,
	`pos` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_product_types` (
	`id` text,
	`label` text NOT NULL,
	`text` text NOT NULL,
	`value` text NOT NULL,
	`pos` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_products` (
	`id` text,
	`name` text NOT NULL,
	`sub_title` text NOT NULL,
	`sku` text NOT NULL,
	`description` text NOT NULL,
	`handle` text NOT NULL,
	`is_gift_card` integer DEFAULT false NOT NULL,
	`weight` integer DEFAULT 0,
	`height` integer DEFAULT 0,
	`length` integer DEFAULT 0,
	`hs_code` text NOT NULL,
	`mid_code` text NOT NULL,
	`material` text NOT NULL,
	`metadata` text NOT NULL,
	`discountable` integer DEFAULT false NOT NULL,
	`state` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_promotion_exclude_categories` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_promotion_include_categories` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `medusa_promotion_products` (
	`id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`discount_id` text,
	`product_id` text,
	FOREIGN KEY (`discount_id`) REFERENCES `medusa_promotions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `medusa_products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medusa_promotions` (
	`id` text,
	`name` text NOT NULL,
	`description` text,
	`discount_type` text DEFAULT 'orderTotal' NOT NULL,
	`amount_type` text DEFAULT 'amount' NOT NULL,
	`amount` integer NOT NULL,
	`req_min_order_total` integer DEFAULT 0,
	`req_min_product_total` integer DEFAULT 0,
	`req_max_product_total` integer DEFAULT 0,
	`max_discount_amt` integer DEFAULT 0,
	`add_product_to_card` integer DEFAULT false NOT NULL,
	`limit_qty` integer DEFAULT 0,
	`limit_customer` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `medusa_stores` (
	`id` text,
	`name` text NOT NULL,
	`user_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `key` (
	`id` text NOT NULL,
	`hashed_password` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text NOT NULL,
	`active_expires` integer,
	`idle_expires` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text,
	`email_address` text,
	`first_name` text,
	`last_name` text,
	`company_name` text,
	`role` text DEFAULT 'user',
	`last_login` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dam_file_id_unique` ON `dam_file` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dam_file_mime_type_id_unique` ON `dam_file_mime_type` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_gift_card_timelines_id_unique` ON `medusa_gift_card_timelines` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_gift_cards_id_unique` ON `medusa_gift_cards` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_categories_id_unique` ON `medusa_categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_category_images_id_unique` ON `medusa_category_images` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_discount_exclude_categories_id_unique` ON `medusa_discount_exclude_categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_discount_include_categories_id_unique` ON `medusa_discount_include_categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_discount_products_id_unique` ON `medusa_discount_products` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_discounts_id_unique` ON `medusa_discounts` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_brands_id_unique` ON `medusa_product_brands` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_celebrations_id_unique` ON `medusa_product_celebrations` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_collections_id_unique` ON `medusa_product_collections` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_colors_id_unique` ON `medusa_product_colors` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_images_id_unique` ON `medusa_product_images` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_madeby_id_unique` ON `medusa_product_madeby` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_madewhen_id_unique` ON `medusa_product_madewhen` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_occasions_id_unique` ON `medusa_product_occasions` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_pricing_types_id_unique` ON `medusa_product_pricing_types` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_product_types_id_unique` ON `medusa_product_types` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_products_id_unique` ON `medusa_products` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_promotion_exclude_categories_id_unique` ON `medusa_promotion_exclude_categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_promotion_include_categories_id_unique` ON `medusa_promotion_include_categories` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_promotion_products_id_unique` ON `medusa_promotion_products` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_promotions_id_unique` ON `medusa_promotions` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `medusa_stores_id_unique` ON `medusa_stores` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);