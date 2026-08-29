import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Viviendas editables por el administrador. Las imágenes se guardan en S3 y aquí solo se almacena su URL. */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zone: varchar("zone", { length: 140 }).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  price: varchar("price", { length: 80 }).notNull(),
  priceValue: int("priceValue").notNull(),
  bedrooms: int("bedrooms").notNull(),
  bathrooms: int("bathrooms").notNull(),
  surface: int("surface").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  tag: varchar("tag", { length: 100 }).default("Nueva oportunidad").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  linkMode: mysqlEnum("linkMode", ["capture", "redirect", "both"]).default("both").notNull(),
  externalUrl: text("externalUrl"),
  referralParameter: varchar("referralParameter", { length: 80 }).default("ref").notNull(),
  referralCode: varchar("referralCode", { length: 160 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("properties_status_idx").on(table.status),
  index("properties_city_idx").on(table.city),
]);

/** Solicitudes hechas antes de visitar al vendedor o para recibir información del inmueble. */
export const propertyLeads = mysqlTable("propertyLeads", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "referred"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("property_leads_property_idx").on(table.propertyId),
  index("property_leads_created_idx").on(table.createdAt),
]);

/** Huella de cada clic de salida. No se almacena IP ni datos técnicos de visitantes. */
export const referralClicks = mysqlTable("referralClicks", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  destinationUrl: text("destinationUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("referral_clicks_property_idx").on(table.propertyId),
  index("referral_clicks_created_idx").on(table.createdAt),
]);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type PropertyLead = typeof propertyLeads.$inferSelect;
export type InsertPropertyLead = typeof propertyLeads.$inferInsert;
