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

  it("accepts the configured secret through the running login endpoint", async () => {
    const configuredKey = process.env.ADMIN_KEY;
    expect(configuredKey, "ADMIN_KEY debe estar configurada para esta prueba").toBeTruthy();
    const response = await fetch("http://localhost:3000/api/admin/key-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: configuredKey }),
    });
    expect(response.status).toBe(200);
    expect((await response.json()) as { success?: boolean }).toEqual({ success: true });
    expect(response.headers.get("set-cookie")).toBeTruthy();
  });
});
