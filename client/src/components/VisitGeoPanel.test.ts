import { describe, expect, it } from "vitest";
import { clusterLocations, getGeoMapState, getGeoPoints, type GeoLocation } from "./VisitGeoPanel";

const location = (latitude: number | null, longitude: number | null): GeoLocation => ({
  country: "España",
  region: "Alicante",
  city: "Torrevieja",
  latitude,
  longitude,
  visits: 1,
  uniqueVisitors: 1,
  pages: ["/"],
  locales: ["es"],
  lastVisited: new Date("2026-09-02T10:00:00Z"),
});

describe("VisitGeoPanel", () => {
  it("returns no map points when coordinates are unavailable", () => {
    const locations = [location(null, null)];
    expect(getGeoPoints(locations)).toEqual([]);
    expect(getGeoMapState(locations)).toBe("empty");
  });

  it("keeps only complete approximate locations as map points", () => {
    expect(getGeoPoints([location(38.0, -0.7), location(null, -0.7)])).toHaveLength(1);
  });

  it("groups nearby locations to prevent overlapping labels", () => {
    const nearby = { ...location(40.4168, -3.7038), city: "Madrid" };
    const nearbyTwo = { ...location(40.4172, -3.7041), city: "Madrid centro" };
    const distant = { ...location(41.3874, 2.1686), city: "Barcelona" };
    const clusters = clusterLocations([nearby, nearbyTwo, distant]);
    expect(clusters.some((cluster) => cluster.length === 2)).toBe(true);
    expect(clusters.some((cluster) => cluster.length === 1 && cluster[0].city === "Barcelona")).toBe(true);
  });
});
