import { describe, expect, it } from "vitest";

describe("admin key configuration", () => {
  it("accepts the configured secret at the running endpoint without exposing it", async () => {
    const secret = process.env.ADMIN_KEY;
    expect(secret).toBeTruthy();

    const response = await fetch("http://localhost:3000/api/admin/key-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: secret }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.headers.get("set-cookie")).toContain("app_session_id=");
  }, 15_000);
});
