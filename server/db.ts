import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  commissionOperations,
  InsertCommissionOperation,
  InsertProperty,
  InsertPropertyLead,
  InsertPropertyTranslation,
  InsertUser,
  InsertVendor,
  InsertPropertyInviteLink,
  propertyInviteLinks,
  properties,
  propertyLeads,
  propertyTranslations,
  referralClicks,
  siteSettings,
  siteVisits,
  users,
  vendors,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { VisitGeo } from "./geo";

let _db: ReturnType<typeof drizzle> | null = null;

/** Valores seguros para que el escaparate funcione antes de que el administrador guarde ajustes. */
export function getDefaultPublicSiteSettings() {
  return {
    bannerText: "Vivienda Nova · Selección internacional",
    bannerBackground: "#d95f42",
    bannerColor: "#fffdf8",
    bannerHeight: 36,
    bannerRotationSeconds: 5,
    cardStyle: "flat" as const,
    enabledLocales: "es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH",
    heroVideos: JSON.stringify([{
      label: "Costa Blanca Norte",
      url: "/manus-storage/chalet-piscina-recorrido_14603e97.mp4",
    }]),
    heroImageUrl: "/manus-storage/chalet-minimalista-piscina_3bd4eca8.jpg",
    contactPhone: "",
    ownerName: "Vivienda Nova",
    businessMode: "real_estate" as const,
    midPageCta: "Compra con claridad · Información directa del vendedor",
  };
}

/** En modo catálogo, una ficha puede publicarse para consulta directa sin vendedor externo. */
export function requiresExternalSellerForPublishedEntry(mode?: "real_estate" | "catalog" | null) {
  return mode !== "catalog";
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export function roleUpdateForUpsert(openId: string, requestedRole: InsertUser["role"], ownerOpenId: string) {
  if (requestedRole !== undefined) return { role: requestedRole };
  if (openId === ownerOpenId) return { role: "admin" as const };
  return {} as const;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  });
  const roleUpdate = roleUpdateForUpsert(user.openId, user.role, ENV.ownerOpenId);
  if ("role" in roleUpdate) {
    values.role = roleUpdate.role;
    updateSet.role = roleUpdate.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createPropertyInviteLink(values: InsertPropertyInviteLink) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.insert(propertyInviteLinks).values(values);
  const rows = await db.select({ id: propertyInviteLinks.id }).from(propertyInviteLinks).where(eq(propertyInviteLinks.tokenHash, values.tokenHash)).limit(1);
  if (!rows[0]) throw new Error("No se pudo recuperar el enlace creado.");
  return rows[0].id;
}

export async function listPropertyInviteLinks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propertyInviteLinks).orderBy(desc(propertyInviteLinks.createdAt));
}

export async function getActivePropertyInviteLink(tokenHash: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(propertyInviteLinks).where(and(eq(propertyInviteLinks.tokenHash, tokenHash), isNull(propertyInviteLinks.revokedAt), gt(propertyInviteLinks.expiresAt, new Date()))).limit(1);
  return rows[0];
}

export async function touchPropertyInviteLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(propertyInviteLinks).set({ lastUsedAt: new Date(), updatedAt: new Date() }).where(eq(propertyInviteLinks.id, id));
}

export async function revokePropertyInviteLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(propertyInviteLinks).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(propertyInviteLinks.id, id));
}

export async function listPublishedProperties(locale?: string) {
  const db = await getDb();
  if (!db) return [];
  const settings = await getSiteSettings();
  const requiresExternalSeller = requiresExternalSellerForPublishedEntry(settings?.businessMode);
  const rows = (await db.select().from(properties).where(eq(properties.status, "published")).orderBy(desc(properties.createdAt)))
    .filter((property) => !requiresExternalSeller || (property.linkMode !== "capture" && Boolean(property.externalUrl)));
  if (!locale || locale === "es" || rows.length === 0) return rows;
  const translations = await db.select().from(propertyTranslations).where(eq(propertyTranslations.locale, locale));
  const translationByProperty = new Map(translations.map((translation) => [translation.propertyId, translation]));
  return rows.map((property) => {
    const translation = translationByProperty.get(property.id);
    return translation ? { ...property, title: translation.title, city: translation.city, zone: translation.zone, type: translation.type, tag: translation.tag, description: translation.description } : property;
  });
}

export async function listAdminProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).orderBy(desc(properties.updatedAt));
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result[0];
}

export async function createProperty(values: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const result = await db.insert(properties).values(values);
  return Number((result as unknown as { insertId: number }).insertId);
}

export async function updateProperty(id: number, values: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(properties).set({ ...values, updatedAt: new Date() }).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(properties).where(eq(properties.id, id));
}

export async function replacePropertyTranslations(propertyId: number, translations: Omit<InsertPropertyTranslation, "propertyId">[]) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.delete(propertyTranslations).where(eq(propertyTranslations.propertyId, propertyId));
  if (translations.length) await db.insert(propertyTranslations).values(translations.map((translation) => ({ ...translation, propertyId })));
}

export async function listVendors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendors).orderBy(desc(vendors.updatedAt));
}

export async function getVendorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
  return result[0];
}

export async function createVendor(values: InsertVendor) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(vendors).values(values);
}

export async function updateVendor(id: number, values: Partial<InsertVendor>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(vendors).set({ ...values, updatedAt: new Date() }).where(eq(vendors.id, id));
}

export async function countPropertiesForVendor(vendorId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ id: properties.id }).from(properties).where(eq(properties.vendorId, vendorId));
  return rows.length;
}

export async function deleteVendor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(vendors).where(eq(vendors.id, id));
}

export async function createPropertyLead(values: InsertPropertyLead) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(propertyLeads).values(values);
}

export async function listPropertyLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propertyLeads).orderBy(desc(propertyLeads.createdAt));
}

export async function getPropertyLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(propertyLeads).where(eq(propertyLeads.id, id)).limit(1);
  return rows[0];
}

export async function updatePropertyLeadStatus(id: number, status: "new" | "contacted" | "sent_to_seller" | "in_follow_up" | "won" | "lost") {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(propertyLeads).set({ status, updatedAt: new Date() }).where(eq(propertyLeads.id, id));
}

export async function createReferralClick(propertyId: number, destinationUrl: string, vendorId?: number | null, channel: "direct" | "email" | "whatsapp" | "sms" | "phone" = "direct", visitorId?: string | null) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(referralClicks).values({ propertyId, destinationUrl, vendorId: vendorId || null, channel, visitorId: visitorId || null });
}

export async function listReferralClicks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referralClicks).orderBy(desc(referralClicks.createdAt));
}

export async function createSiteVisit(visitorId: string, locale: string, page: string, geo?: VisitGeo) {
  const db = await getDb();
  if (!db) return;
  return db.insert(siteVisits).values({ visitorId, locale, page, country: geo?.country ?? null, region: geo?.region ?? null, city: geo?.city ?? null, latitude: geo?.latitude ?? null, longitude: geo?.longitude ?? null, entrySource: geo?.entrySource ?? null });
}

export async function listSiteVisits() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteVisits).orderBy(desc(siteVisits.createdAt));
}

export async function getVisitGeoSummary() {
  const rows = await listSiteVisits();
  type Bucket = { country: string | null; region: string | null; city: string | null; latitude: number | null; longitude: number | null; visits: number; visitorIds: Set<string>; pages: Set<string>; locales: Set<string>; lastVisited: Date };
  const buckets = new Map<string, Bucket>();
  for (const row of rows) {
    const country = row.country || "Desconocido";
    const region = row.region || "Sin región";
    const city = row.city || "Sin municipio";
    const key = `${country}|${region}|${city}`;
    const bucket = buckets.get(key) ?? { country: row.country, region: row.region, city: row.city, latitude: row.latitude, longitude: row.longitude, visits: 0, visitorIds: new Set<string>(), pages: new Set<string>(), locales: new Set<string>(), lastVisited: row.createdAt };
    bucket.visits += 1;
    bucket.visitorIds.add(row.visitorId);
    bucket.pages.add(row.page);
    bucket.locales.add(row.locale);
    if (row.createdAt > bucket.lastVisited) bucket.lastVisited = row.createdAt;
    if (bucket.latitude === null && row.latitude !== null) bucket.latitude = row.latitude;
    if (bucket.longitude === null && row.longitude !== null) bucket.longitude = row.longitude;
    buckets.set(key, bucket);
  }
  const locations = Array.from(buckets.values()).map((bucket) => ({ country: bucket.country, region: bucket.region, city: bucket.city, latitude: bucket.latitude, longitude: bucket.longitude, visits: bucket.visits, uniqueVisitors: bucket.visitorIds.size, pages: Array.from(bucket.pages), locales: Array.from(bucket.locales), lastVisited: bucket.lastVisited })).sort((first, second) => second.visits - first.visits);
  const aggregate = (field: "country" | "region" | "city") => {
    const result = new Map<string, { name: string; visits: number; uniqueVisitors: Set<string> }>();
    for (const row of rows) {
      const name = row[field] || "Desconocido";
      const current = result.get(name) ?? { name, visits: 0, uniqueVisitors: new Set<string>() };
      current.visits += 1;
      current.uniqueVisitors.add(row.visitorId);
      result.set(name, current);
    }
    return Array.from(result.values()).map((item) => ({ name: item.name, visits: item.visits, uniqueVisitors: item.uniqueVisitors.size })).sort((first, second) => second.visits - first.visits);
  };
  return { locations, countries: aggregate("country"), regions: aggregate("region"), cities: aggregate("city") };
}

export async function listCommissionOperations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(commissionOperations).orderBy(desc(commissionOperations.createdAt));
}

export async function createCommissionOperation(values: InsertCommissionOperation) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(commissionOperations).values(values);
}

export async function updateCommissionOperation(id: number, values: Partial<InsertCommissionOperation>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(commissionOperations).set({ ...values, updatedAt: new Date() }).where(eq(commissionOperations.id, id));
}

export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(siteSettings).limit(1);
  return rows[0];
}

/** Nunca devuelve undefined: se utiliza en la ruta pública para evitar errores de caché del cliente. */
export async function getPublicSiteSettings() {
  return (await getSiteSettings()) ?? getDefaultPublicSiteSettings();
}

export async function updateSiteSettings(values: Partial<typeof siteSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const current = await getSiteSettings();
  if (current) return db.update(siteSettings).set({ ...values, updatedAt: new Date() }).where(eq(siteSettings.id, current.id));
  return db.insert(siteSettings).values(values);
}

export async function getAdminOverview() {
  const [propertyRows, leadRows, clickRows, visitRows, operationRows] = await Promise.all([
    listAdminProperties(), listPropertyLeads(), listReferralClicks(), listSiteVisits(), listCommissionOperations(),
  ]);
  return {
    properties: propertyRows.length,
    published: propertyRows.filter((property) => property.status === "published").length,
    leads: leadRows.length,
    clicks: clickRows.length,
    visitors: new Set(visitRows.map((visit) => visit.visitorId)).size,
    visits: visitRows.length,
    expectedCommission: operationRows.filter((operation) => operation.commissionStatus === "expected").reduce((total, operation) => total + operation.commissionAmount, 0),
    pendingCommission: operationRows.filter((operation) => operation.commissionStatus === "pending").reduce((total, operation) => total + operation.commissionAmount, 0),
    paidCommission: operationRows.filter((operation) => operation.commissionStatus === "paid").reduce((total, operation) => total + operation.commissionAmount, 0),
  };
}
