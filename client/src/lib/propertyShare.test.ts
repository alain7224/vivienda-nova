import { describe, expect, it } from "vitest";
import { getCopy, locales } from "./i18n";
import { createPropertyShareTargets, createPropertyShareText, createPropertyShareUrl } from "./propertyShare";

describe("property sharing", () => {
  const property = { slug: "villa-marina", title: "Villa Marina", city: "Altea", price: "890.000 €" };

  it("creates a public URL that restores the shared property", () => {
    expect(createPropertyShareUrl("https://viviendanova.es/?preview=1", property.slug)).toBe("https://viviendanova.es/?property=villa-marina#viviendas");
  });

  it("creates encoded social-network destinations from property data", () => {
    const url = createPropertyShareUrl("https://viviendanova.es", property.slug);
    const text = createPropertyShareText(property);
    const targets = createPropertyShareTargets(url, text);
    expect(text).toContain("Villa Marina");
    expect(targets.whatsapp).toContain("wa.me");
    expect(targets.facebook).toContain(encodeURIComponent(url));
    expect(targets.x).toContain(encodeURIComponent(text));
  });

  it("provides translated sharing labels for every public locale", () => {
    for (const locale of locales) {
      const copy = getCopy(locale.code);
      expect(copy.share).not.toHaveLength(0);
      expect(copy.copyLink).not.toHaveLength(0);
      expect(copy.linkCopied).not.toHaveLength(0);
    }
  });
});
