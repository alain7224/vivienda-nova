import { describe, expect, it } from "vitest";
import { matchesSecret } from "./_core/keyLogin";

describe("admin key login secret", () => {
  it("matches the configured secret without exposing its value", () => {
    const configuredKey = process.env.ADMIN_KEY;
    expect(configuredKey, "ADMIN_KEY debe estar configurada para esta prueba").toBeTruthy();
    expect(matchesSecret(configuredKey, configuredKey ?? "")).toBe(true);
    expect(matchesSecret(`${configuredKey}x`, configuredKey ?? "")).toBe(false);
    expect(matchesSecret(undefined, configuredKey ?? "")).toBe(false);
  });

});
