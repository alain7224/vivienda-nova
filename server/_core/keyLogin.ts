import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { upsertUser } from "../db";
import { sdk } from "./sdk";

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 6;

function getClientKey(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return firstForwarded?.trim() || req.ip || "unknown";
}

export function matchesSecret(providedValue: unknown, expectedValue: string) {
  const provided = Buffer.from(String(providedValue ?? ""), "utf8");
  const expected = Buffer.from(expectedValue, "utf8");
  if (provided.length !== expected.length) {
    crypto.timingSafeEqual(expected, expected);
    return false;
  }
  return crypto.timingSafeEqual(provided, expected);
}

export function registerKeyLogin(app: Express) {
  app.post("/api/admin/key-login", async (req: Request, res: Response) => {
    const clientKey = getClientKey(req);
    const now = Date.now();
    const state = attempts.get(clientKey) ?? { count: 0, first: now };
    if (now - state.first > WINDOW_MS) {
      state.count = 0;
      state.first = now;
    }
    state.count += 1;
    attempts.set(clientKey, state);

    if (state.count > MAX_ATTEMPTS) {
      return res.status(429).json({ error: "too_many_requests" });
    }

    const { key } = req.body ?? {};
    if (typeof key !== "string" || !key) return res.status(400).json({ error: "missing_key" });
    if (!ENV.adminKey) {
      console.error("[KeyLogin] ADMIN_KEY is not configured");
      return res.status(503).json({ error: "admin_not_configured" });
    }
    const ownerOpenId = ENV.ownerOpenId || "vivienda-nova-admin-key-owner";
    if (!ENV.cookieSecret || !ENV.appId) {
      console.error("[KeyLogin] Session configuration is incomplete");
      return res.status(503).json({ error: "session_not_configured" });
    }
    if (!matchesSecret(key, ENV.adminKey)) return res.status(401).json({ error: "invalid_credentials" });

    try {
      await upsertUser({
        openId: ownerOpenId,
        name: ENV.ownerName,
        loginMethod: "admin-key",
        role: "admin",
        lastSignedIn: new Date(),
      });
      const sessionToken = await sdk.createSessionToken(ownerOpenId, {
        expiresInMs: ONE_YEAR_MS,
        name: ENV.ownerName,
      });
      res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
      attempts.delete(clientKey);
      return res.json({ success: true });
    } catch (error) {
      console.error("[KeyLogin] Failed to create admin session", error);
      return res.status(500).json({ error: "internal_error" });
    }
  });
}
