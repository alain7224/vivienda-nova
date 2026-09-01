import type { Express, Request, Response } from "express";
import crypto from "crypto";
import { ENV } from "./env";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Very small in-memory rate limiter per IP. This is intentionally simple
// to avoid adding external dependencies. It's suitable for low-traffic
// administrative access; for high-security production consider using a
// persistent store (Redis) and more advanced protections.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 6;

export function registerKeyLogin(app: Express) {
  app.post("/api/admin/key-login", async (req: Request, res: Response) => {
    try {
      const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "unknown";
      const now = Date.now();
      const prev = attempts.get(ip) ?? { count: 0, first: now };
      if (now - prev.first > WINDOW_MS) {
        prev.count = 0;
        prev.first = now;
      }
      prev.count++;
      attempts.set(ip, prev);
      if (prev.count > MAX_ATTEMPTS) {
        return res.status(429).json({ error: "too_many_requests" });
      }

      const { key } = req.body ?? {};
      if (!key) return res.status(400).json({ error: "missing_key" });

      if (!ENV.adminKey) {
        console.error("[KeyLogin] ADMIN_KEY is not configured in environment");
        return res.status(500).json({ error: "server_misconfigured" });
      }

      // Use timingSafeEqual to avoid timing attacks
      const provided = Buffer.from(String(key));
      const expected = Buffer.from(String(ENV.adminKey));

      // If lengths differ, do a fake timingSafeEqual to normalise timing
      if (provided.length !== expected.length) {
        // run a harmless comparison to keep timing similar
        crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(expected));
        return res.status(401).json({ error: "invalid_credentials" });
      }

      let match = false;
      try {
        match = crypto.timingSafeEqual(provided, expected);
      } catch (err) {
        match = false;
      }

      if (!match) return res.status(401).json({ error: "invalid_credentials" });

      const adminOpenId = ENV.ownerOpenId;
      if (!adminOpenId) {
        console.error("[KeyLogin] OWNER_OPEN_ID (ownerOpenId) is not configured");
        return res.status(500).json({ error: "owner_not_configured" });
      }

      // Create a session token using existing SDK so the cookie format and
      // verification remain identical to the OAuth flow already implemented.
      const sessionToken = await sdk.createSessionToken(adminOpenId, { expiresInMs: ONE_YEAR_MS });
      const cookieOptions = getSessionCookieOptions(req);

      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return res.json({ success: true });
    } catch (err) {
      console.error("[KeyLogin] unexpected error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  });
}
