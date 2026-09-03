import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_MS, matchesSecret } from "./_core/keyLogin";

describe("admin key login secret", () => {
  it("keeps the admin session at exactly 30 minutes", () => {
    expect(ADMIN_SESSION_MS).toBe(30 * 60 * 1000);
  });

  it("matches the configured secret without exposing its value", () => {
    const configuredKey = process.env.ADMIN_KEY;
    expect(configuredKey, "ADMIN_KEY debe estar configurada para esta prueba").toBeTruthy();
    expect(matchesSecret(configuredKey, configuredKey ?? "")).toBe(true);
    expect(matchesSecret(`${configuredKey}x`, configuredKey ?? "")).toBe(false);
    expect(matchesSecret(undefined, configuredKey ?? "")).toBe(false);
  });

});
