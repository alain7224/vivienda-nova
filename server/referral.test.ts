import { describe, expect, it } from "vitest";
import { buildReferralChannelUrl, buildReferralUrl } from "./referral";

describe("buildReferralUrl", () => {
  it("preserva los parámetros existentes y añade el código de referencia", () => {
    expect(buildReferralUrl("https://vendedor.example/piso?campaign=verano", "ref", "nova-142"))
      .toBe("https://vendedor.example/piso?campaign=verano&ref=nova-142");
  });

  it("rechaza destinos que no sean enlaces web", () => {
    expect(() => buildReferralUrl("javascript:alert(1)", "ref", "nova")).toThrow("HTTP o HTTPS");
  });

  it("prepara un enlace de WhatsApp sin enviar un mensaje automáticamente", () => {
    expect(buildReferralChannelUrl("whatsapp", "+34 600 000 000", "Interesado referido por MARTINEZ"))
      .toBe("https://wa.me/34600000000?text=Interesado%20referido%20por%20MARTINEZ");
  });
});
