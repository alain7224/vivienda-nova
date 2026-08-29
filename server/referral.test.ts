import { describe, expect, it } from "vitest";
import { buildReferralUrl } from "./referral";

describe("buildReferralUrl", () => {
  it("preserva los parámetros existentes y añade el código de referencia", () => {
    expect(buildReferralUrl("https://vendedor.example/piso?campaign=verano", "ref", "nova-142"))
      .toBe("https://vendedor.example/piso?campaign=verano&ref=nova-142");
  });

  it("rechaza destinos que no sean enlaces web", () => {
    expect(() => buildReferralUrl("javascript:alert(1)", "ref", "nova")).toThrow("HTTP o HTTPS");
  });
});
