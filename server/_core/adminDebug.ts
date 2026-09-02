import type { Express, Request, Response } from "express";
import { ENV } from "./env";

// Temporary debug endpoint that reveals only whether critical env vars are set.
// Returns: { adminKeySet: boolean, ownerOpenIdSet: boolean }
// DOES NOT return any secret values.
export function registerAdminDebug(app: Express) {
  app.get("/api/admin/config-status", (req: Request, res: Response) => {
    try {
      const adminKeySet = !!ENV.adminKey;
      const ownerOpenIdSet = !!ENV.ownerOpenId;
      return res.json({ adminKeySet, ownerOpenIdSet });
    } catch (err) {
      console.error("[AdminDebug] error:", err);
      return res.status(500).json({ error: "internal_error" });
    }
  });
}
