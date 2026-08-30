import { describe, expect, it } from "vitest";
import { getDefaultPublicSiteSettings } from "./db";

describe("getDefaultPublicSiteSettings", () => {
  it("provides a complete public configuration before any admin settings are saved", () => {
    expect(getDefaultPublicSiteSettings()).toEqual({
      bannerText: "Vivienda Nova · Selección internacional",
      bannerBackground: "#d95f42",
      bannerColor: "#fffdf8",
      bannerHeight: 36,
      bannerRotationSeconds: 5,
      cardStyle: "flat",
      enabledLocales: "es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH",
    });
  });
});
