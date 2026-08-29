/**
 * Construye un enlace de salida verificando que el destino sea HTTP(S) y añadiendo
 * solo el parámetro de referencia definido por el administrador.
 */
export function buildReferralUrl(destination: string, parameter?: string | null, code?: string | null) {
  const url = new URL(destination);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("El enlace externo debe usar HTTP o HTTPS.");
  }

  if (parameter?.trim() && code?.trim()) {
    url.searchParams.set(parameter.trim(), code.trim());
  }
  return url.toString();
}
