import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const session = sqliteTable("user_session", {
  id: text("id").notNull().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  // relations
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const users = sqliteTable("users", {
  id: text("id").unique().notNull(),
  emailAddress: text("email_address"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  companyName: text("company_name"),
  role: text("role", { enum: ["user", "admin", "system"] }).default("user"),
  lastLogin: text("last_login"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text("deleted_at"),
});
