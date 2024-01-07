import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as common from "./schema/common";
import * as dam from "./schema/dam";
import * as medusa from "./schema/medusa";
import * as user from "./schema/user";

export const schema = { ...common, ...dam, ...medusa, ...user };

export * from "drizzle-orm";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const dbNoSchema = drizzle(client);
export const db = drizzle(client, { schema: schema });

export type User = Partial<typeof schema.users.$inferSelect>;
