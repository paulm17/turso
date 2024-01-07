import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { geoCountry } from "./common";
import { damFile } from "./dam";
import { users } from "./user";

export const medusaCategories = sqliteTable("medusa_categories", {
  id: text("id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  pageTitle: text("page_title"),
  metaDescription: text("meta_description"),
  slug: text("slug").notNull(),
  enabled: integer("enabled", { mode: "boolean" }),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
  parentId: text("parent_id").references(() => medusaCategories.id),
});

export const medusaCategoryImages = sqliteTable("medusa_category_images", {
  id: text("id").unique(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  categoryId: text("category_id").references(() => medusaCategories.id),
  damFileId: text("dam_file_id").references(() => damFile.id),
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaDiscounts = sqliteTable("medusa_discounts", {
  id: text("id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  discountType: text("discount_type", {
    enum: ["orderTotal", "shipping", "productOrCategory"],
  })
    .default("orderTotal")
    .notNull(),
  amountType: text("amount_type", { enum: ["amount", "percentage"] })
    .default("amount")
    .notNull(),
  amount: integer("amount").notNull(),
  reqMinOrderTotal: integer("req_min_order_total").default(0),
  reqMinProductTotal: integer("req_min_product_total").default(0),
  reqMaxProductTotal: integer("req_max_product_total").default(0),
  maxDiscountAmt: integer("max_discount_amt").default(0),
  addProductToCard: integer("add_product_to_card", { mode: "boolean" })
    .default(false)
    .notNull(),
  limitQty: integer("limit_qty").default(0),
  limitCustomer: integer("limit_customer").default(0),
  startsAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  expiresAt: text("deleted_at"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaDiscountIncludeCategories = sqliteTable(
  "medusa_discount_include_categories",
  {
    id: text("id").unique(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    discountId: text("discount_id").references(() => medusaDiscounts.id),
    categoryId: text("category_id").references(() => medusaCategories.id),
  },
);

export const medusaDiscountExcludeCategories = sqliteTable(
  "medusa_discount_exclude_categories",
  {
    id: text("id").unique(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    discountId: text("discount_id").references(() => medusaDiscounts.id),
    categoryId: text("category_id").references(() => medusaCategories.id),
  },
);

export const medusaDiscountProducts = sqliteTable("medusa_discount_products", {
  id: text("id").unique(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  discountId: text("discount_id").references(() => medusaDiscounts.id),
  productId: text("product_id").references(() => medusaProducts.id),
});

export const MedusaGiftCards = sqliteTable("medusa_gift_cards", {
  id: text("id").unique(),
  code: text("code").notNull(),
  balance: real("balance").default(0),
  state: text("state", {
    enum: ["new", "spent", "partiallySpent", "redeemed", "disabled"],
  }),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const MedusaGiftCardTimeline = sqliteTable(
  "medusa_gift_card_timelines",
  {
    id: text("id").unique(),
    snapshot: text("snapshot", { mode: "json" }),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    giftCardId: text("gift_card_id").references(() => MedusaGiftCards.id),
  },
);

export const medusaProducts = sqliteTable("medusa_products", {
  id: text("id").unique(),
  name: text("name").notNull(),
  subTitle: text("sub_title").notNull(),
  sku: text("sku").notNull(),
  description: text("description").notNull(),
  handle: text("handle").notNull(),
  isGiftCard: integer("is_gift_card", { mode: "boolean" })
    .default(false)
    .notNull(),
  weight: integer("weight").default(0),
  height: integer("height").default(0),
  length: integer("length").default(0),
  hsCode: text("hs_code").notNull(),
  midCode: text("mid_code").notNull(),
  material: text("material").notNull(),
  metadata: text("metadata").notNull(),
  discountable: integer("discountable", { mode: "boolean" })
    .default(false)
    .notNull(),
  state: text("state", {
    enum: ["draft", "proposed", "published", "rejected"],
  })
    .default("draft")
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  brandId: text("brand_id").references(() => medusaProductBrands.id),
  collectionId: text("collection_id").references(
    () => medusaProductCollections.id,
  ),
  colorId: text("color_id").references(() => medusaProductColors.id),
  celebrationId: text("celebration_id").references(
    () => medusaProductCelebrations.id,
  ),
  countryId: text("country_id").references(() => geoCountry.id),
  madeById: text("made_by_id").references(() => medusaProductMadeBy.id),
  madeWhenId: text("made_when_id").references(() => medusaProductMadeWhen.id),
  occasionId: text("occasion_id").references(() => medusaProductOccasions.id),
  pricingTypeId: text("pricing_type_id").references(
    () => medusaProductPricingTypes.id,
  ),
  productTypeId: text("product_type_id").references(
    () => medusaProductTypes.id,
  ),
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductBrands = sqliteTable("medusa_product_brands", {
  id: text("id").unique(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductCelebrations = sqliteTable(
  "medusa_product_celebrations",
  {
    id: text("id").unique(),
    name: text("name").notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    storeId: text("store_id").references(() => medusaStores.id),
  },
);

export const medusaProductCollections = sqliteTable(
  "medusa_product_collections",
  {
    id: text("id").unique(),
    name: text("name").notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    storeId: text("store_id").references(() => medusaStores.id),
  },
);

export const medusaProductColors = sqliteTable("medusa_product_colors", {
  id: text("id").unique(),
  name: text("name").notNull(),
  hex: text("hex").notNull(),
  red: integer("red").default(0).notNull(),
  green: integer("green").default(0).notNull(),
  blue: integer("blue").default(0).notNull(),
  hue: real("hue").default(0).notNull(),
  saturation: real("saturation").default(0).notNull(),
  lightness: real("lightness").default(0).notNull(),
  textColor: text("text_color").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductImages = sqliteTable("medusa_product_images", {
  id: text("id").unique(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  damFileId: text("dam_file_id").references(() => damFile.id),
  productId: text("product_id").references(() => medusaProducts.id),
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductMadeBy = sqliteTable("medusa_product_madeby", {
  id: text("id").unique(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductMadeWhen = sqliteTable("medusa_product_madewhen", {
  id: text("id").unique(),
  label: text("label").notNull(),
  text: text("text").notNull(),
  value: text("value").notNull(),
  pos: integer("pos").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductOccasions = sqliteTable("medusa_product_occasions", {
  id: text("id").unique(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaProductPricingTypes = sqliteTable(
  "medusa_product_pricing_types",
  {
    id: text("id").unique(),
    label: text("label").notNull(),
    pos: integer("pos").default(0).notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    storeId: text("store_id").references(() => medusaStores.id),
  },
);

export const medusaProductTypes = sqliteTable("medusa_product_types", {
  id: text("id").unique(),
  label: text("label").notNull(),
  text: text("text").notNull(),
  value: text("value").notNull(),
  pos: integer("pos").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaPromotions = sqliteTable("medusa_promotions", {
  id: text("id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  discountType: text("discount_type", {
    enum: ["orderTotal", "shipping", "productOrCategory"],
  })
    .default("orderTotal")
    .notNull(),
  amountType: text("amount_type", { enum: ["amount", "percentage"] })
    .default("amount")
    .notNull(),
  amount: integer("amount").notNull(),
  reqMinOrderTotal: integer("req_min_order_total").default(0),
  reqMinProductTotal: integer("req_min_product_total").default(0),
  reqMaxProductTotal: integer("req_max_product_total").default(0),
  maxDiscountAmt: integer("max_discount_amt").default(0),
  addProductToCard: integer("add_product_to_card", { mode: "boolean" })
    .default(false)
    .notNull(),
  limitQty: integer("limit_qty").default(0),
  limitCustomer: integer("limit_customer").default(0),
  startsAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  expiresAt: text("deleted_at"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  storeId: text("store_id").references(() => medusaStores.id),
});

export const medusaPromotionIncludeCategories = sqliteTable(
  "medusa_promotion_include_categories",
  {
    id: text("id").unique(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    discountId: text("discount_id").references(() => medusaPromotions.id),
    categoryId: text("category_id").references(() => medusaCategories.id),
  },
);

export const medusaPromotionExcludeCategories = sqliteTable(
  "medusa_promotion_exclude_categories",
  {
    id: text("id").unique(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    discountId: text("discount_id").references(() => medusaPromotions.id),
    categoryId: text("category_id").references(() => medusaCategories.id),
  },
);

export const medusaPromotionProducts = sqliteTable(
  "medusa_promotion_products",
  {
    id: text("id").unique(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
    // relations
    discountId: text("discount_id").references(() => medusaPromotions.id),
    productId: text("product_id").references(() => medusaProducts.id),
  },
);

export const medusaStores = sqliteTable("medusa_stores", {
  id: text("id").unique(),
  name: text("name").notNull(),
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
});
