import { describe, expect, it } from "vitest";
import { getPage, pageCount, parsePropertyOrder, sortProperties } from "./propertyOrdering";

const properties = [
  { id: 1, title: "Piso urbano", type: "Piso", zone: "Centro", city: "Madrid", tag: "Oportunidad", priceValue: 180000, surface: 60, bedrooms: 2, imageGallery: [] },
  { id: 2, title: "Chalet en la playa", type: "Chalet", zone: "Costa Blanca", city: "Torrevieja", tag: "Piscina", priceValue: 420000, surface: 140, bedrooms: 4, imageGallery: ["/manus-storage/chalet.jpg"] },
  { id: 3, title: "Villa interior", type: "Villa", zone: "Campo", city: "Murcia", tag: "Nueva", priceValue: 350000, surface: 160, bedrooms: 3, imageGallery: [] },
];

describe("property ordering and pagination", () => {
  it("returns complete groups of nine and replaces pages without growing the item count", () => {
    const many = Array.from({ length: 19 }, (_, index) => ({ ...properties[0], id: index + 1 }));
    expect(pageCount(many)).toBe(3);
    expect(getPage(many, 0)).toHaveLength(9);
    expect(getPage(many, 1)).toHaveLength(9);
    expect(getPage(many, 2)).toHaveLength(1);
  });

  it("prioritizes attractive beach and chalet homes in featured mode", () => {
    expect(sortProperties(properties, "featured", [])[0].id).toBe(2);
  });

  it("honours the manual order and ignores malformed JSON", () => {
    expect(parsePropertyOrder("[3, 1]")).toEqual([3, 1]);
    expect(parsePropertyOrder("not-json")).toEqual([]);
    expect(sortProperties(properties, "manual", [3, 1, 2]).map((property) => property.id)).toEqual([3, 1, 2]);
  });
});
