import { describe, expect, it } from "vitest";
import { isReferenceMimeType, referenceMimeTypes } from "../shared/referenceFiles";

describe("formatos de referencia de construcción", () => {
  it("admite imágenes habituales de móvil y documentos PDF", () => {
    expect(referenceMimeTypes).toContain("image/jpeg");
    expect(referenceMimeTypes).toContain("image/heic");
    expect(referenceMimeTypes).toContain("image/avif");
    expect(referenceMimeTypes).toContain("application/pdf");
  });

  it("rechaza archivos que no son referencias admitidas", () => {
    expect(isReferenceMimeType("video/mp4")).toBe(false);
    expect(isReferenceMimeType("application/zip")).toBe(false);
  });
});
