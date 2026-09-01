import { describe, expect, it } from "vitest";
import { getBusinessModeCopy } from "./businessMode";
import { getCopy } from "./i18n";

describe("getBusinessModeCopy", () => {
  it("keeps the real-estate vocabulary by default", () => {
    expect(getBusinessModeCopy("real_estate", "es", getCopy("es")).homes).toBe("Viviendas");
  });

  it("switches public labels to the selected catalogue language", () => {
    const copy = getBusinessModeCopy("catalog", "es", getCopy("es"));
    expect(copy.homes).toBe("Productos");
    expect(copy.viewSeller).toBe("Consultar producto");
  });
});
