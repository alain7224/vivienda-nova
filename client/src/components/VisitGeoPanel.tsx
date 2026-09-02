import { Globe2, MapPin, X } from "lucide-react";
import "./VisitGeoPanel.css";

type GeoAggregate = { name: string; visits: number; uniqueVisitors: number };
type GeoLocation = { country: string | null; region: string | null; city: string | null; latitude: number | null; longitude: number | null; visits: number; uniqueVisitors: number; pages: string[]; lastVisited: Date };

export type VisitGeoData = { locations: GeoLocation[]; countries: GeoAggregate[]; regions: GeoAggregate[]; cities: GeoAggregate[] };

function markerPosition(latitude: number, longitude: number) {
  return { left: `${Math.min(96, Math.max(4, ((longitude + 180) / 360) * 100))}%`, top: `${Math.min(92, Math.max(8, ((90 - latitude) / 180) * 100))}%` };
}

export default function VisitGeoPanel({ data, onClose }: { data?: VisitGeoData; onClose: () => void }) {
  const locations = data?.locations ?? [];
  const points = locations.filter((location) => location.latitude !== null && location.longitude !== null);
  return <section className="visit-geo-panel" aria-labelledby="visit-geo-title">
    <div className="visit-geo-heading"><div><p className="admin-kicker"><span /> Procedencia agregada</p><h2 id="visit-geo-title">Desde dónde <em>llegan.</em></h2><p className="visit-geo-note">Ubicación aproximada por IP y solo después del consentimiento de analítica. No se guarda la IP original ni se muestra una persona concreta.</p></div><button className="editor-close" type="button" onClick={onClose}><X size={16} /> Cerrar mapa</button></div>
    <div className="visit-geo-map" role="img" aria-label="Mapa aproximado de procedencia de las visitas">
      <div className="visit-geo-map__grid" />
      <div className="visit-geo-map__land visit-geo-map__land--europe" />
      <div className="visit-geo-map__land visit-geo-map__land--america" />
      <div className="visit-geo-map__land visit-geo-map__land--asia" />
      {points.map((location) => <div key={`${location.country}-${location.region}-${location.city}`} className="visit-geo-marker" style={markerPosition(location.latitude as number, location.longitude as number)} title={`${location.city || "Ubicación desconocida"}: ${location.visits} visitas`}><MapPin size={17} /><span>{location.city || location.region || location.country || "Ubicación"}<b>{location.visits}</b></span></div>)}
      {!points.length && <div className="visit-geo-empty"><Globe2 size={28} /><strong>Aún no hay coordenadas disponibles</strong><span>Las próximas visitas consentidas se agruparán aquí.</span></div>}
      <span className="visit-geo-label visit-geo-label--north">N · PROCEDENCIA GLOBAL</span><span className="visit-geo-label visit-geo-label--south">DATOS AGREGADOS · PRECISIÓN APROXIMADA</span>
    </div>
    <div className="visit-geo-columns"><div><h3>Países</h3>{(data?.countries ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div><div><h3>Regiones</h3>{(data?.regions ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div><div><h3>Municipios</h3>{(data?.cities ?? []).slice(0, 8).map((item) => <p key={item.name}><span>{item.name}</span><strong>{item.visits}</strong><small>{item.uniqueVisitors} visitantes</small></p>)}</div></div>
    <div className="visit-geo-pages"><strong>Páginas más visitadas por ubicación</strong>{locations.slice(0, 10).map((location) => <span key={`${location.city}-${location.region}`}>{location.city || location.region || location.country || "Desconocido"}: {location.pages.join(", ")}</span>)}</div>
  </section>;
}
