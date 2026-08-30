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

/** Construye el canal elegido sin enviar mensajes ni iniciar llamadas de forma automática. */
export function buildReferralChannelUrl(method: "direct" | "email" | "whatsapp" | "sms" | "phone", value: string, message: string, parameter?: string | null, code?: string | null) {
  if (method === "direct") return buildReferralUrl(value, parameter, code);
  if (method === "email") return `mailto:${encodeURIComponent(value)}?subject=${encodeURIComponent("Nuevo interesado referido por MARTINEZ")}&body=${encodeURIComponent(message)}`;
  if (method === "phone") return `tel:${value.replace(/[^+0-9]/g, "")}`;
  if (method === "sms") return `sms:${value.replace(/[^+0-9]/g, "")}?body=${encodeURIComponent(message)}`;
  const number = value.replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
