import crypto from "crypto";

export function createCollaboratorToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, tokenHash: hashCollaboratorToken(token) };
}

export function hashCollaboratorToken(token: string) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

export function buildCollaboratorUrl(origin: string, token: string) {
  const parsed = new URL(origin);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
    throw new Error("El origen del enlace no es válido.");
  }
  return `${parsed.origin}/oficina/${encodeURIComponent(token)}`;
}

export function forceCollaboratorDraft<T extends object>(values: T) {
  return { ...values, status: "draft" as const, linkMode: "capture" as const, vendorId: null, externalUrl: null };
}
