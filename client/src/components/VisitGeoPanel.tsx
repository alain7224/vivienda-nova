import { useState } from "react";
import { Globe2, MapPin, X } from "lucide-react";
import "./VisitGeoPanel.css";

type GeoAggregate = { name: string; visits: number; uniqueVisitors: number };
export type GeoLocation = { country: string | null; region: string | null; city: string | null; latitude: number | null; longitude: number | null; visits: number; uniqueVisitors: number; pages: string[]; locales: string[]; lastVisited: Date };

export type VisitGeoData = { locations: GeoLocation[]; countries: GeoAggregate[]; regions: GeoAggregate[]; cities: GeoAggregate[] };

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" });

export function getGeoPoints(locations: GeoLocation[]) {
  return locations.filter((location) => location.latitude !== null && location.longitude !== null);
}

export function getGeoMapState(locations: GeoLocation[]) {
  return getGeoPoints(locations).length ? "ready" : "empty";
}

function markerPosition(latitude: number, longitude: number) {
  return { left: `${Math.min(96, Math.max(4, ((longitude + 180) / 360) * 100))}%`, top: `${Math.min(92, Math.max(8, ((90 - latitude) / 180) * 100))}%` };
}

function formatVisitedPage(page: string) {
  const property = new URLSearchParams(page.split("?")[1] || "").get("property");
  return property ? `Vivienda: ${property}` : page || "Inicio";
}

export default function VisitGeoPanel({ data, onClose }: { data?: VisitGeoData; onClose: () => void }) {
  const locations = data?.locations ?? [];
  const points = getGeoPoints(locations);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = points.find((location) => `${location.country}-${location.region}-${location.city}` === selectedKey) ?? null;
  return <section className="visit-geo-panel" aria-labelledby="visit-geo-title">
    <div className="visit-geo-heading"><div><p className="admin-kicker"><span /> Procedencia agregada</p><h2 id="visit-geo-title">Desde dónde <em>llegan.</em></h2><p className="visit-geo-note">Solo muestra ubicación general aproximada, páginas o viviendas consultadas y fechas. La IP, la calle, el número de vivienda y la identidad del visitante no se muestran ni se conservan.</p></div><button className="editor-close" type="button" onClick={onClose}><X size={16} /> Cerrar mapa</button></div>
    <div className="visit-geo-map" role="img" aria-label="Mapa aproximado de procedencia de las visitas">
      <div className="visit-geo-map__grid" />
      <svg className="visit-geo-map__world" viewBox="0 0 1000 500" aria-hidden="true" focusable="false"><path className="world-land world-land--north-america" d="M76 128 116 76 190 61 245 91 278 144 250 183 202 166 178 208 135 186 105 226 74 196Z" /><path className="world-land world-land--south-america" d="M287 237 328 254 348 310 327 362 296 423 266 389 274 334 252 288Z" /><path className="world-land world-land--europe" d="M470 126 512 101 557 113 582 143 554 166 514 157 486 179 455 158Z" /><path className="world-land world-land--africa" d="M478 194 535 184 581 222 570 292 532 358 491 322 468 263Z" /><path className="world-land world-land--asia" d="M574 114 646 83 757 103 836 150 810 204 735 190 692 222 622 188 582 165Z" /><path className="world-land world-land--oceania" d="M785 330 838 314 883 339 862 374 808 368Z" /></svg>
      {points.map((location) => { const key = `${location.country}-${location.region}-${location.city}`; return <button key={key} type="button" className={`visit-geo-marker ${selectedKey === key ? "is-selected" : ""}`} style={markerPosition(location.latitude as number, location.longitude as number)} onClick={() => setSelectedKey(key)} aria-label={`Seleccionar ${location.city || location.region || location.country || "ubicación general"}`}><MapPin size={17} /><span>{location.city || location.region || location.country || "Ubicación"}<b>{location.visits}</b></span></button>; })}
      {getGeoMapState(locations) === "empty" && <div className="visit-geo-empty"><Globe2 size={28} /><strong>Aún no hay coordenadas disponibles</strong><span>Las próximas visitas consentidas se agruparán aquí.</span></div>}
      <span className="visit-geo-label visit-geo-label--north">N · PROCEDENCIA GLOBAL</span><span className="visit-geo-label visit-geo-label--south">DATOS AGREGADOS · PRECISIÓN APROXIMADA</span>
    </div>
    {selected && <div className="visit-geo-selected" role="status"><strong>{selected.city || selected.region || selected.country || "Ubicación general"}</strong><span>{selected.visits} visitas agregadas · {selected.uniqueVisitors} visitantes · última visita {dateFormatter.format(new Date(selected.lastVisited))}</span><small>Consultas: {selected.pages.map(formatVisitedPage).join(", ") || "Inicio"}</small></div>}
    <div className="visit-geo-columns"><div><h3>Países</h3>{(data?.countries ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div><div><h3>Regiones</h3>{(data?.regions ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div><div><h3>Municipios</h3>{(data?.cities ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div></div>
    <div className="visit-geo-pages"><strong>Páginas y viviendas consultadas por ubicación</strong>{locations.slice(0, 10).map((location) => <span key={`${location.city}-${location.region}`}><b>{location.city || location.region || location.country || "Ubicación general"}</b>: {location.pages.map(formatVisitedPage).join(", ")} · idiomas: {location.locales.join(", ") || "no indicado"} · última visita {dateFormatter.format(new Date(location.lastVisited))}</span>)}</div>
  </section>;
}
