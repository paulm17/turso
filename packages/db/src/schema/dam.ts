import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";

export const damFile = sqliteTable("dam_file", {
  id: text("id").unique().notNull(),
  parentId: text("parent_id"),
  oldParentId: text("old_parent_id"),
  path: text("path", { mode: "json" }).$type<{ foo: string[] }>().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  comments: text("comments"),
  copyright: text("copyright"),
  filename: text("filename"),
  filesize: integer("filesize").default(0),
  extension: text("extension"),
  md5: text("md5"),
  metaData: text("meta_data", { mode: "json" }).$type<{ foo: string }>(),
  geoData: text("meta_data", { mode: "json" }).$type<{ foo: string }>(),
  publicationDate: text("publication_date"),
  eTag: text("etag"),
  versionId: text("version_id"),
  url: text("url"),
  completed: integer("completed").default(0),
  permDelete: integer("perm_delete").default(0),
  fileType: text("file_type").notNull(),
  filterCountry: text("filter_country"),
  filterOrientation: text("filter_orientation"),
  filterSize: integer("filter_size").default(0),
  filterDpi: integer("filter_dpi").default(0),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  typeId: text("type").references(() => damFileType.id),
  mimeId: text("mime").references(() => damFileMimeType.id),
  userId: text("user").references(() => users.id),
});

export const damFileMimeType = sqliteTable("dam_file_mime_type", {
  id: text("id").unique().notNull(),
  mimeType: text("mime_type").notNull(),
  extension: text("extension").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  typeId: text("type_id").references(() => damFileType.id),
});

export const damFileType = sqliteTable("dam_file_type", {
  id: text("id").unique().notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
});

export const damFileString = sqliteTable("dam_file_string", {
  id: text("id").unique().notNull(),
  tag: text("tag").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  fileId: text("file_id").references(() => damFile.id),
  typeId: text("type_id").references(() => damFileTagType.id),
});

export const damFileTagType = sqliteTable("dam_file_tag_type", {
  id: text("id").unique().notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
});

export const damImage = sqliteTable("dam_image", {
  id: text("id").unique().notNull(),
  width: integer("width").default(0).notNull(),
  height: integer("height").default(0).notNull(),
  url: text("url"),
  base64: text("base64"),
  eTag: text("etag"),
  versionId: text("version_id"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  fileId: text("file_id").references(() => damFile.id),
  sizeId: text("size_id").references(() => damImageSize.id),
});

export const damImageSize = sqliteTable("dam_image_size", {
  id: text("id").unique().notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  size: integer("size").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
});

export const damImageColor = sqliteTable("dam_image_color", {
  id: text("id").unique().notNull(),
  name: text("name").notNull(),
  backgroundColor: text("background_color").notNull(),
  textColor: text("text_color").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
  // relations
  fileId: text("file_id").references(() => damFile.id),
});
