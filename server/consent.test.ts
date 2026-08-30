import { describe, expect, it } from "vitest";
import { createLeadConsentTimestamps } from "./consent";

describe("createLeadConsentTimestamps", () => {
  it("requires both privacy and referral consent before saving a public lead", () => {
    expect(() => createLeadConsentTimestamps({ privacyAccepted: false, referralConsent: true })).toThrow("política de privacidad");
    expect(() => createLeadConsentTimestamps({ privacyAccepted: true, referralConsent: false })).toThrow("derivación");
  });

  it("records both consent timestamps when the visitor has accepted", () => {
    const consent = createLeadConsentTimestamps({ privacyAccepted: true, referralConsent: true });
    expect(consent.privacyAcceptedAt).toBeInstanceOf(Date);
    expect(consent.referralConsentAt).toBeInstanceOf(Date);
  });
});
