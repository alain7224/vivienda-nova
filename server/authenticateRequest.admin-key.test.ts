import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";
import * as db from "./db";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";

const technicalAdmin: User = {
  id: 999999,
  openId: "vivienda-nova-admin-key-owner",
  name: "Vivienda Nova",
  email: null,
  loginMethod: "admin-key",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

afterEach(() => vi.restoreAllMocks());

describe("sdk.authenticateRequest with ADMIN_KEY identity", () => {
  it("keeps role admin when authentication refreshes lastSignedIn", async () => {
    let storedUser: User = { ...technicalAdmin };
    const getUser = vi.spyOn(db, "getUserByOpenId").mockImplementation(async () => storedUser);
    const upsertUser = vi.spyOn(db, "upsertUser").mockImplementation(async (input) => {
      storedUser = {
        ...storedUser,
        ...(input.name !== undefined ? { name: input.name ?? null } : {}),
        ...(input.loginMethod !== undefined ? { loginMethod: input.loginMethod ?? null } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        lastSignedIn: input.lastSignedIn ?? new Date(),
      };
    });
    vi.spyOn(sdk as any, "verifySession").mockResolvedValue({
      openId: technicalAdmin.openId,
      appId: ENV.appId,
      name: technicalAdmin.name ?? "Vivienda Nova",
    });

    const user = await sdk.authenticateRequest({ headers: { cookie: "app_session_id=admin-session" } } as any);

    expect(getUser).toHaveBeenCalledWith(technicalAdmin.openId);
    expect(upsertUser).toHaveBeenCalledWith(expect.objectContaining({ openId: technicalAdmin.openId }));
    expect(upsertUser.mock.calls[0]?.[0]).not.toHaveProperty("role");
    expect(user.role).toBe("admin");
    expect(storedUser.role).toBe("admin");
  });
});
