import { describe, expect, it } from "vitest";
import { roleUpdateForUpsert } from "./db";

describe("roleUpdateForUpsert", () => {
  it("does not overwrite an existing technical admin when role is omitted", () => {
    expect(roleUpdateForUpsert("vivienda-nova-admin-key-owner", undefined, "oauth-owner")).toEqual({});
  });

  it("keeps explicit roles and promotes the configured OAuth owner", () => {
    expect(roleUpdateForUpsert("any-user", "admin", "oauth-owner")).toEqual({ role: "admin" });
    expect(roleUpdateForUpsert("oauth-owner", undefined, "oauth-owner")).toEqual({ role: "admin" });
  });
});
