import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { readCsv } from "./PropertyImporter";

describe("CSV de L & R Costa Homes", () => {
  it("contiene cinco fichas válidas, trazables y solo en borrador", () => {
    const raw = readFileSync(new URL("../../../lr-costa-homes-5-borradores.csv", import.meta.url), "utf8");
    const result = readCsv(raw);

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(5);
    expect(result.rows.every((property) => property.status === "draft")).toBe(true);
    expect(result.rows.every((property) => property.externalUrl?.startsWith("https://lrcostahomes.com/es/property/"))).toBe(true);
  });
});
