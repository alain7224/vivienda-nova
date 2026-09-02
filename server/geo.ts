import type { Request } from "express";

export type VisitGeo = {
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  entrySource: string | null;
};

type IpApiResponse = {
  country_name?: unknown;
  country_code?: unknown;
  region?: unknown;
  city?: unknown;
  latitude?: unknown;
  longitude?: unknown;
};

const asText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return null;
  const text = value.trim().replace(/[\u0000-\u001f\u007f]/g, "");
  return text ? text.slice(0, maxLength) : null;
};

const asCoordinate = (value: unknown) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= -180 && number <= 180 ? number : null;
};

function requestIp(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (firstForwarded || req.ip || "").trim().replace(/^::ffff:/, "");
}

function isPublicIp(ip: string) {
  if (!ip || ip === "::1" || ip === "localhost" || ip === "127.0.0.1") return false;
  if (/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\.|^169\.254\./.test(ip)) return false;
  return /^[0-9a-f:.]+$/i.test(ip);
}

function edgeHeaders(req: Request): VisitGeo {
  return {
    country: asText(req.headers["cf-ipcountry"] || req.headers["x-vercel-ip-country"], 100),
    region: asText(req.headers["x-vercel-ip-country-region"], 140),
    city: asText(req.headers["x-vercel-ip-city"], 140),
    latitude: asCoordinate(req.headers["x-vercel-ip-latitude"]),
    longitude: asCoordinate(req.headers["x-vercel-ip-longitude"]),
    entrySource: asText(req.headers.referer || req.headers.referrer, 320)?.replace(/^https?:\/\//i, "").split("/")[0] || null,
  };
}

export async function resolveVisitGeo(req: Request): Promise<VisitGeo> {
  const fallback = edgeHeaders(req);
  const ip = requestIp(req);
  if (!isPublicIp(ip)) return fallback;

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { "User-Agent": "ViviendaNova-analytics/1.0" },
      signal: AbortSignal.timeout(900),
    });
    if (!response.ok) return fallback;
    const data = await response.json() as IpApiResponse;
    return {
      country: asText(data.country_name, 100) || asText(data.country_code, 100) || fallback.country,
      region: asText(data.region, 140) || fallback.region,
      city: asText(data.city, 140) || fallback.city,
      latitude: asCoordinate(data.latitude) ?? fallback.latitude,
      longitude: asCoordinate(data.longitude) ?? fallback.longitude,
      entrySource: fallback.entrySource,
    };
  } catch {
    return fallback;
  }
}
