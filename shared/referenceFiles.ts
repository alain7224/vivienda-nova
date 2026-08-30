/** Formatos aceptados para referencias visuales y documentos de construcción. */
export const referenceMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;

export type ReferenceMimeType = (typeof referenceMimeTypes)[number];

export function isReferenceMimeType(value: string): value is ReferenceMimeType {
  return referenceMimeTypes.includes(value as ReferenceMimeType);
}
