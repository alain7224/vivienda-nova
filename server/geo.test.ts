import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { resolveVisitGeo } from "./geo";

describe("resolveVisitGeo", () => {
  it("uses trusted edge headers and stores only a referrer host for local requests", async () => {
    const request = {
      ip: "127.0.0.1",
      headers: {
        "cf-ipcountry": "ES",
        "x-vercel-ip-country-region": "VC",
        "x-vercel-ip-city": "Torrevieja",
        "x-vercel-ip-latitude": "37.978",
        "x-vercel-ip-longitude": "-0.682",
        referer: "https://www.google.com/search?q=vivienda",
      },
    } as unknown as Request;

    await expect(resolveVisitGeo(request)).resolves.toEqual({
      country: "ES",
      region: "VC",
      city: "Torrevieja",
      latitude: 37.978,
      longitude: -0.682,
      entrySource: "www.google.com",
    });
  });

  it("does not persist or expose a private development address", async () => {
    const request = { ip: "::1", headers: {} } as unknown as Request;
    await expect(resolveVisitGeo(request)).resolves.toEqual({ country: null, region: null, city: null, latitude: null, longitude: null, entrySource: null });
  });
});
