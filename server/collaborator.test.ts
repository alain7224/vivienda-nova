import { describe, expect, it } from "vitest";
import { buildCollaboratorUrl, createCollaboratorToken, forceCollaboratorDraft, hashCollaboratorToken } from "./collaborator";

describe("collaborator links", () => {
  it("creates a high-entropy token and stores only its hash", () => {
    const first = createCollaboratorToken();
    const second = createCollaboratorToken();
    expect(first.token.length).toBeGreaterThanOrEqual(40);
    expect(first.tokenHash).toHaveLength(64);
    expect(first.tokenHash).toBe(hashCollaboratorToken(first.token));
    expect(first.tokenHash).not.toBe(first.token);
    expect(first.token).not.toBe(second.token);
  });

  it("forces office submissions to remain drafts without seller destinations", () => {
    const draft = forceCollaboratorDraft({ status: "published", linkMode: "redirect", vendorId: 77, externalUrl: "https://seller.example/listing" });
    expect(draft.status).toBe("draft");
    expect(draft.linkMode).toBe("capture");
    expect(draft.vendorId).toBeNull();
    expect(draft.externalUrl).toBeNull();
  });

  it("keeps the provided https origin and rejects insecure public origins", () => {
    const url = buildCollaboratorUrl("https://viviendanova.casa/", "token-seguro");
    expect(url).toBe("https://viviendanova.casa/oficina/token-seguro");
    expect(() => buildCollaboratorUrl("http://example.com", "token-seguro")).toThrow();
  });
});
