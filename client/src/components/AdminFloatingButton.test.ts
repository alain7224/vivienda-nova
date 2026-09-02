import { describe, expect, it } from "vitest";
import { completeAdminKeyLogin } from "@/lib/adminSession";

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
    getItem: (key: string) => values.get(key) ?? null,
  };
}

describe("AdminFloatingButton session handoff", () => {
  it("removes the old Manus token, activates admin-key and navigates to admin", () => {
    const storage = createStorage({ "manus-cookie": "stale-preview-token" });
    const navigation: string[] = [];

    completeAdminKeyLogin(storage, (path) => navigation.push(path));

    expect(storage.getItem("manus-cookie")).toBeNull();
    expect(storage.getItem("vivienda-nova-admin-key")).toBe("1");
    expect(navigation).toEqual(["/admin"]);
  });
});
