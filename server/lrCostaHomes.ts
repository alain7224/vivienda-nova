import { storagePut } from "./storage";

const ALLOWED_HOSTS = new Set(["lrcostahomes.com", "www.lrcostahomes.com"]);
const MAX_HTML_BYTES = 2_000_000;
const MAX_IMAGES = 30;

export type LrCostaDraft = {
  slug: string;
  title: string;
  city: string;
  zone: string;
  province: string;
  country: string;
  type: string;
  price: string;
  priceValue: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  description: string;
  imageUrl: string;
  imageGallery: string[];
  tag: string;
  status: "published";
  linkMode: "capture";
  vendorId: null;
  externalUrl: string;
  referralParameter: string;
  referralCode: string;
};

function clean(value: string | undefined, fallback: string, max = 5000) {
  return (value || fallback).replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim().slice(0, max);
}

function meta(html: string, property: string) {
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return pattern.exec(html)?.[1];
}

function allMetaImages(html: string) {
  const values = [...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  const imgAttrs = [...html.matchAll(/<(?:img|source)[^>]+(?:src|data-src|data-lazy-src|srcset)=["']([^"']+)["'][^>]*>/gi)].flatMap((match) => match[1].split(/\s*,\s*/).map((value) => value.trim().split(/\s+/)[0]));
  const jsonLd = [...html.matchAll(/"(?:image|contentUrl)"\s*:\s*"(https?:\/\/[^" ]+)"/gi)].map((match) => match[1].replace(/\\\//g, "/"));
  return [...new Set([...values, ...imgAttrs, ...jsonLd])].filter((value) => /^https?:\/\//i.test(value) && /lrcostahomes\.com\/wp-content\/uploads\//i.test(value) && !/(?:cropped|l-r-costa-homes)/i.test(value)).slice(0, MAX_IMAGES);
}

function numberFrom(text: string, patterns: RegExp[], fallback = 0) {
  for (const pattern of patterns) {
    const value = pattern.exec(text)?.[1]?.replace(/\./g, "").replace(",", ".");
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }
  return fallback;
}

function validateUrl(input: string) {
  const url = new URL(input);
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname.toLowerCase())) throw new Error("Solo se pueden importar fichas de lrcostahomes.com.");
  return url;
}

async function readResponse(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) return Buffer.from(await response.arrayBuffer());
  const chunks: Buffer[] = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > MAX_HTML_BYTES) throw new Error("La ficha externa supera el tamaño permitido.");
    chunks.push(Buffer.from(part.value));
  }
  return Buffer.concat(chunks);
}

async function copyImage(source: string, index: number) {
  try {
    const response = await fetch(source, { headers: { "user-agent": "ViviendaNova importer" }, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return null;
    const mime = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    if (!mime.startsWith("image/")) return null;
    const bytes = await readResponse(response);
    if (!bytes.length || bytes.length > 8_000_000) return null;
    const extension = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
    return (await storagePut(`viviendas/import-lr-${Date.now()}-${index}.${extension}`, bytes, mime)).url;
  } catch {
    return null;
  }
}

export async function discoverLrCostaHomesUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for (let page = 1; page <= 11; page += 1) {
    const source = page === 1 ? "https://lrcostahomes.com/es/properties-search/" : `https://lrcostahomes.com/es/properties-search/page/${page}/`;
    const response = await fetch(source, { headers: { "user-agent": "ViviendaNova importer" }, signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`No se pudo leer el catálogo (página ${page}, ${response.status}).`);
    const html = (await readResponse(response)).toString("utf8");
    for (const match of html.matchAll(/href=["'](https:\/\/lrcostahomes\.com\/es\/property\/[^"'#?]+\/?)["']/gi)) urls.add(match[1]);
  }
  return [...urls];
}

export async function importLrCostaHomesUrl(sourceUrl: string): Promise<LrCostaDraft> {
  const url = validateUrl(sourceUrl);
  const response = await fetch(url, { headers: { "user-agent": "ViviendaNova importer" }, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`La ficha no se pudo leer (${response.status}).`);
  const html = (await readResponse(response)).toString("utf8");
  const title = clean(meta(html, "og:title") || meta(html, "twitter:title"), "Vivienda importada");
  const description = clean(meta(html, "og:description") || meta(html, "description"), `Consulta esta propiedad seleccionada por L & R Costa Homes: ${title}.`);
  const images = allMetaImages(html);
  const copied = (await Promise.all(images.map(copyImage))).filter((value): value is string => Boolean(value));
  if (!copied.length) throw new Error("No se encontraron imágenes copiables en la ficha.");
  const text = clean(html, "", 200000);
  const priceValue = numberFrom(text, [/(?:€|EUR)\s*([\d.,]+)/i, /price[^\d]{0,30}([\d.,]+)/i]);
  const bedrooms = numberFrom(text, [/bedrooms?[^\d]{0,15}(\d+)/i, /dormitorios?[^\d]{0,15}(\d+)/i], 1);
  const bathrooms = numberFrom(text, [/bathrooms?[^\d]{0,15}(\d+)/i, /baños?[^\d]{0,15}(\d+)/i], 1);
  const surface = numberFrom(text, [/(\d[\d.,]*)\s*m²/i, /surface[^\d]{0,15}(\d[\d.,]*)/i], 60);
  const city = clean(/(?:city|ciudad|municipality)[^A-Za-zÁÉÍÓÚÜÑ]{0,20}([A-Za-zÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑ -]{2,50})/i.exec(text)?.[1], "Costa Blanca");
  return { slug: `lr-${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 150)}-${Date.now()}`, title, city, zone: city, province: "Alicante", country: "España", type: "Vivienda", price: priceValue ? `${priceValue.toLocaleString("es-ES")} €` : "Consultar precio", priceValue, bedrooms, bathrooms, surface, description, imageUrl: copied[0], imageGallery: copied, tag: "Selección L & R Costa Homes", status: "published", linkMode: "capture", vendorId: null, externalUrl: url.toString(), referralParameter: "ref", referralCode: "MARTINEZ" };
}
