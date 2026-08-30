import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Usuarios autenticados; la cuenta propietaria conserva el rol admin. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Vendedores externos y la vía acordada para derivarles visitas o clientes. */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  contactMethod: mysqlEnum("contactMethod", ["direct", "email", "whatsapp", "sms", "phone"]).default("direct").notNull(),
  contactValue: text("contactValue"),
  referralParameter: varchar("referralParameter", { length: 80 }).default("ref").notNull(),
  referralCode: varchar("referralCode", { length: 160 }).default("MARTINEZ").notNull(),
  attributionNote: text("attributionNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("vendors_name_idx").on(table.name)]);

/** Viviendas o productos promocionados. Los archivos viven en almacenamiento y aquí solo se conserva la URL. */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zone: varchar("zone", { length: 140 }).notNull(),
  province: varchar("province", { length: 140 }),
  country: varchar("country", { length: 100 }).default("España").notNull(),
  address: varchar("address", { length: 300 }),
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
  linkMode: mysqlEnum("linkMode", ["capture", "redirect", "both"]).default("redirect").notNull(),
  vendorId: int("vendorId"),
  externalUrl: text("externalUrl"),
  referralParameter: varchar("referralParameter", { length: 80 }).default("ref").notNull(),
  referralCode: varchar("referralCode", { length: 160 }).default("MARTINEZ").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("properties_status_idx").on(table.status),
  index("properties_city_idx").on(table.city),
  index("properties_vendor_idx").on(table.vendorId),
]);

/** Copias multilingües generadas al guardar la ficha en español. */
export const propertyTranslations = mysqlTable("propertyTranslations", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  locale: varchar("locale", { length: 12 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  zone: varchar("zone", { length: 180 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  tag: varchar("tag", { length: 140 }).notNull(),
  description: text("description").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("property_translation_locale_uq").on(table.propertyId, table.locale),
  index("property_translation_locale_idx").on(table.locale),
]);

/** Contactos voluntarios: sobre un inmueble, un producto o una casa a construir desde cero. */
export const propertyLeads = mysqlTable("propertyLeads", {
  id: int("id").autoincrement().primaryKey(),
  leadType: mysqlEnum("leadType", ["property", "construction", "product"]).default("property").notNull(),
  propertyId: int("propertyId"),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  preferredLocation: varchar("preferredLocation", { length: 200 }),
  preferredProvince: varchar("preferredProvince", { length: 140 }),
  budget: varchar("budget", { length: 100 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "sent_to_seller", "in_follow_up", "won", "lost"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("property_leads_property_idx").on(table.propertyId),
  index("property_leads_created_idx").on(table.createdAt),
  index("property_leads_status_idx").on(table.status),
]);

/** Huella de cada salida pública hacia un vendedor; no se almacena IP. */
export const referralClicks = mysqlTable("referralClicks", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  vendorId: int("vendorId"),
  channel: mysqlEnum("channel", ["direct", "email", "whatsapp", "sms", "phone"]).default("direct").notNull(),
  visitorId: varchar("visitorId", { length: 80 }),
  destinationUrl: text("destinationUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("referral_clicks_property_idx").on(table.propertyId),
  index("referral_clicks_created_idx").on(table.createdAt),
]);

/** Visitas pseudónimas para el cuadro de métricas privado. */
export const siteVisits = mysqlTable("siteVisits", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 80 }).notNull(),
  locale: varchar("locale", { length: 12 }).notNull(),
  page: varchar("page", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("site_visits_visitor_idx").on(table.visitorId), index("site_visits_created_idx").on(table.createdAt)]);

/** Operaciones que el administrador confirma después de recibir la información del vendedor externo. */
export const commissionOperations = mysqlTable("commissionOperations", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  propertyId: int("propertyId"),
  vendorId: int("vendorId"),
  operationType: mysqlEnum("operationType", ["property", "construction", "product"]).default("property").notNull(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  province: varchar("province", { length: 140 }).notNull(),
  country: varchar("country", { length: 100 }).default("España").notNull(),
  salePrice: int("salePrice").notNull(),
  commissionPercent: int("commissionPercent").notNull(),
  commissionAmount: int("commissionAmount").notNull(),
  commissionStatus: mysqlEnum("commissionStatus", ["expected", "pending", "paid", "cancelled"]).default("expected").notNull(),
  closedAt: timestamp("closedAt"),
  paidAt: timestamp("paidAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("commission_operations_status_idx").on(table.commissionStatus),
  index("commission_operations_vendor_idx").on(table.vendorId),
  index("commission_operations_closed_idx").on(table.closedAt),
]);

/** Parámetros visuales y funcionales que el propietario puede editar sin cambiar código. */
export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").autoincrement().primaryKey(),
  bannerText: varchar("bannerText", { length: 220 }).default("Vivienda Nova · Selección internacional").notNull(),
  bannerBackground: varchar("bannerBackground", { length: 24 }).default("#d95f42").notNull(),
  bannerColor: varchar("bannerColor", { length: 24 }).default("#fffdf8").notNull(),
  bannerHeight: int("bannerHeight").default(36).notNull(),
  bannerRotationSeconds: int("bannerRotationSeconds").default(5).notNull(),
  cardStyle: mysqlEnum("cardStyle", ["flat", "three_d"]).default("flat").notNull(),
  enabledLocales: varchar("enabledLocales", { length: 1000 }).default("es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;
export type PropertyLead = typeof propertyLeads.$inferSelect;
export type InsertPropertyLead = typeof propertyLeads.$inferInsert;
export type PropertyTranslation = typeof propertyTranslations.$inferSelect;
export type InsertPropertyTranslation = typeof propertyTranslations.$inferInsert;
export type CommissionOperation = typeof commissionOperations.$inferSelect;
export type InsertCommissionOperation = typeof commissionOperations.$inferInsert;
