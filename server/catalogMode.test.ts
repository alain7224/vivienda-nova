import { describe, expect, it } from "vitest";
import { requiresExternalSellerForPublishedEntry } from "./db";

describe("requiresExternalSellerForPublishedEntry", () => {
  it("keeps the seller requirement in real-estate mode", () => {
    expect(requiresExternalSellerForPublishedEntry("real_estate")).toBe(true);
  });

  it("allows a published catalogue entry to use direct enquiries", () => {
    expect(requiresExternalSellerForPublishedEntry("catalog")).toBe(false);
  });
});
