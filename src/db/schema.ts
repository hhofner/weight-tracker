import { InferModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weights = sqliteTable("weights", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  weight: integer("weight").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export const authKeys = sqliteTable("auth_keys", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
});

export type Weight = InferModel<typeof weights>;
export type AuthKey = InferModel<typeof authKeys>;
