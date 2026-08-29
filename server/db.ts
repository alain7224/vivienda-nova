import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertProperty,
  InsertPropertyLead,
  InsertUser,
  properties,
  propertyLeads,
  referralClicks,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).where(eq(properties.status, "published")).orderBy(desc(properties.createdAt));
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
  return db.insert(properties).values(values);
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

export async function createReferralClick(propertyId: number, destinationUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(referralClicks).values({ propertyId, destinationUrl });
}

export async function getAdminOverview() {
  const [propertyRows, leadRows, clickRows] = await Promise.all([
    listAdminProperties(),
    listPropertyLeads(),
    (async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(referralClicks);
    })(),
  ]);

  return {
    properties: propertyRows.length,
    published: propertyRows.filter((property) => property.status === "published").length,
    leads: leadRows.length,
    clicks: clickRows.length,
  };
}
