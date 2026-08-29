/**
 * Casa & Plano público: escaparate arquitectónico conectado a viviendas publicadas,
 * con captura de interesados y salida trazable al vendedor cuando esté configurada.
 */
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight, Bath, BedDouble, CalendarDays, Check, ChevronDown, ChevronRight,
  Heart, House, ListFilter, Mail, MapPin, Menu, Phone, Ruler, Search, Send,
  Sparkles, TreePine, X,
} from "lucide-react";

type Property = {
  id: number;
  slug: string;
  title: string;
  city: string;
  zone: string;
  type: string;
  price: string;
  priceValue: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  description: string;
  imageUrl: string;
  tag: string;
  linkMode: "capture" | "redirect" | "both";
  externalUrl: string | null;
};

function Logo({ dark = false }: { dark?: boolean }) {
  return <a className={`brand ${dark ? "brand--light" : ""}`} href="#inicio" aria-label="Vivienda Nova, inicio"><span className="brand-mark" aria-hidden="true"><img src="/manus-storage/vivienda-nova-logo_364aff20.png" alt="" /></span><span className="brand-name">VIVIENDA<br />NOVA</span></a>;
}

function PropertyCard({ property, saved, onSave, onView }: { property: Property; saved: boolean; onSave: () => void; onView: () => void }) {
  return <article className="property-card">
    <div className="property-photo-wrap">
      <img className="property-photo" src={property.imageUrl} alt={`Fotografía de ${property.title}`} />
      <span className="property-tag">{property.tag}</span>
      <button type="button" className={`save-button ${saved ? "is-saved" : ""}`} aria-label={saved ? `Quitar ${property.title} de guardados` : `Guardar ${property.title}`} onClick={onSave}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      <span className="photo-index">REF. {property.id.toString().padStart(3, "0")}</span>
    </div>
    <div className="property-info">
      <div className="property-heading"><div><p className="property-place">{property.zone} · {property.city}</p><h3>{property.title}</h3></div><p className="property-price">{property.price}</p></div>
      <p className="property-description">{property.description}</p>
      <div className="property-footer"><div className="property-specs" aria-label="Características"><span><BedDouble size={16} /> {property.bedrooms}</span><span><Bath size={16} /> {property.bathrooms}</span><span><Ruler size={16} /> {property.surface} m²</span></div><button type="button" className="inline-link" onClick={onView}>Ver ficha <ArrowUpRight size={16} /></button></div>
    </div>
  </article>;
}

export default function Home() {
  const { user } = useAuth();
  const propertiesQuery = trpc.properties.list.useQuery();
  const leadMutation = trpc.properties.createLead.useMutation();
  const referralMutation = trpc.referrals.visit.useMutation();
  const properties = (propertiesQuery.data ?? []) as Property[];
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Todas las zonas");
  const [type, setType] = useState("Todos los tipos");
  const [budget, setBudget] = useState("Sin límite");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryPropertyId, setInquiryPropertyId] = useState<string>("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const locations = useMemo(() => ["Todas las zonas", ...Array.from(new Set(properties.map((property) => property.city)))], [properties]);
  const propertyTypes = useMemo(() => ["Todos los tipos", ...Array.from(new Set(properties.map((property) => property.type)))], [properties]);
  const filteredProperties = useMemo(() => properties.filter((property) => {
    const inLocation = location === "Todas las zonas" || property.city === location;
    const inType = type === "Todos los tipos" || property.type === type;
    const inBudget = budget === "Sin límite" || (budget === "Hasta 700.000 €" && property.priceValue <= 700000) || (budget === "Hasta 1.000.000 €" && property.priceValue <= 1000000) || (budget === "Más de 1.000.000 €" && property.priceValue > 1000000);
    return inLocation && inType && inBudget;
  }), [budget, location, properties, type]);

  const resetFilters = () => { setLocation("Todas las zonas"); setType("Todos los tipos"); setBudget("Sin límite"); };
  const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]);
  const openInquiry = (property: Property) => { setInquiryPropertyId(String(property.id)); setSelectedProperty(null); window.setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 20); };
  const visitSeller = async (property: Property) => {
    try {
      const result = await referralMutation.mutateAsync({ propertyId: property.id });
      window.location.assign(result.destinationUrl);
    } catch { setFormState("error"); }
  };
  const sendInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const propertyId = Number(formData.get("propertyId"));
    if (!propertyId) { setFormState("error"); return; }
    setFormState("sending");
    try {
      await leadMutation.mutateAsync({ propertyId, name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? ""), phone: String(formData.get("phone") ?? "") || undefined, message: String(formData.get("message") ?? "") });
      event.currentTarget.reset();
      setInquiryPropertyId("");
      setFormState("sent");
    } catch { setFormState("error"); }
  };

  return <div className="site-shell" id="inicio">
    <header className="site-header">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegación principal"><a href="#viviendas">Viviendas</a><a href="#metodo">Nuestro método</a><a href="#contacto">Contacto</a>{user?.role === "admin" && <a href="/admin">Administrar</a>}</nav>
      <div className="header-actions"><a href="#contacto" className="header-contact">Hablar con una asesora <ArrowUpRight size={15} /></a><button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
      {menuOpen && <nav className="mobile-nav" aria-label="Navegación móvil"><a href="#viviendas" onClick={() => setMenuOpen(false)}>Viviendas</a><a href="#metodo" onClick={() => setMenuOpen(false)}>Nuestro método</a><a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>{user?.role === "admin" && <a href="/admin">Administrar</a>}</nav>}
    </header>
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span /> Selección residencial · España</p><h1 id="hero-title">Encuentra un lugar que se parezca a ti.</h1><p className="hero-description">Casas con luz, distribución y carácter. Te ayudamos a encontrarlas, entenderlas y decidir con calma.</p><div className="hero-ctas"><a className="button button--ink" href="#viviendas">Explorar viviendas <ArrowUpRight size={18} /></a><a className="text-cta" href="#metodo">Cómo trabajamos <ChevronRight size={18} /></a></div></div>
        <div className="hero-art" aria-label="Villa contemporánea de Vivienda Nova"><img src="/manus-storage/vivienda-nova-hero_bfccb40b.jpg" alt="Villa contemporánea con paredes de piedra caliza" /><div className="hero-plan-mark" aria-hidden="true"><i /><i /><b>NV</b><span>PLANO / 001</span></div><span className="architect-note note-top">01 — Entrar despacio</span><span className="architect-note note-bottom">Vivir es una forma<br />de decidir</span></div>
        <div className="hero-coordinate">40°25' N · 03°42' W</div>
      </section>
      <section className="search-section" aria-labelledby="search-title"><span className="plan-reference plan-reference--search" aria-hidden="true">EJE DE BÚSQUEDA · 04,18 M</span><div className="search-label"><span className="outline-number">01</span><div><p className="eyebrow eyebrow--dark">Empieza por aquí</p><h2 id="search-title">Una búsqueda<br />con intención.</h2></div></div><div className="search-panel"><label className="search-field"><span>Zona</span><div className="select-wrap"><MapPin size={17} /><select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div></label><label className="search-field"><span>Tipo de vivienda</span><div className="select-wrap"><House size={17} /><select value={type} onChange={(event) => setType(event.target.value)}>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div></label><label className="search-field"><span>Presupuesto</span><div className="select-wrap"><span className="euro-symbol">€</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option>Sin límite</option><option>Hasta 700.000 €</option><option>Hasta 1.000.000 €</option><option>Más de 1.000.000 €</option></select><ChevronDown size={15} /></div></label><a className="search-button" href="#viviendas"><Search size={21} /><span>Ver viviendas</span></a></div></section>
      <section className="properties-section" id="viviendas" aria-labelledby="properties-title"><span className="plan-reference plan-reference--properties" aria-hidden="true">SELECCIÓN · INVENTARIO VIVO · NORTE</span><div className="section-heading"><div><p className="eyebrow eyebrow--dark"><span /> En cartera ahora</p><h2 id="properties-title">Viviendas<br /><em>para habitar.</em></h2></div><div className="collection-meta"><p>{filteredProperties.length} {filteredProperties.length === 1 ? "vivienda seleccionada" : "viviendas seleccionadas"}</p><button type="button" className="filter-link" onClick={resetFilters}><ListFilter size={16} /> Limpiar filtros</button></div></div>
        {propertiesQuery.isLoading ? <div className="empty-state"><Search size={26} /><p className="empty-state-reference">INVENTARIO / CARGA</p><h3>Cargando la selección.</h3><p>Estamos preparando las viviendas disponibles.</p></div> : filteredProperties.length > 0 ? <div className="property-grid">{filteredProperties.map((property) => <PropertyCard key={property.id} property={property} saved={saved.includes(property.id)} onSave={() => toggleSaved(property.id)} onView={() => setSelectedProperty(property)} />)}</div> : <div className="empty-state"><Search size={26} /><p className="empty-state-reference">CARPETA ABIERTA / 00.00</p><h3>{properties.length ? "No hay viviendas con esos criterios." : "La próxima vivienda puede empezar aquí."}</h3><p>{properties.length ? "Prueba a ampliar la zona, el tipo o el presupuesto de búsqueda." : "La cartera se actualiza con una selección breve y deliberada. Vuelve pronto para recorrer la siguiente referencia."}</p>{properties.length > 0 && <button className="button button--ink" type="button" onClick={resetFilters}>Ver toda la selección</button>}</div>}
        <div className="all-properties"><button type="button" className="button button--line" onClick={resetFilters}>Ver toda la cartera <ArrowUpRight size={17} /></button></div>
      </section>
      <section className="method-section" id="metodo" aria-labelledby="method-title"><span className="plan-reference plan-reference--method" aria-hidden="true">RECORRIDO · 01 / 03</span><div className="method-image"><img src="/manus-storage/vivienda-nova-card-courtyard_64336dba.jpg" alt="Patio interior de una vivienda restaurada" /><div className="method-image-label"><TreePine size={20} /> Casas que respiran</div></div><div className="method-copy"><p className="eyebrow"><span /> Más que metros cuadrados</p><h2 id="method-title">La búsqueda<br />también es un<br /><em>proceso de diseño.</em></h2><p>Conocemos cada espacio antes de enseñártelo. Por eso podemos hablarte de orientación, escala, silencios y posibilidades, no solo de una dirección.</p><div className="method-list"><div><span>01</span><p><strong>Escuchamos antes de buscar.</strong><br />Tu ritmo, tus prioridades y tu forma de estar en casa.</p></div><div><span>02</span><p><strong>Seleccionamos con criterio.</strong><br />Pocas viviendas, vistas con atención y explicadas con honestidad.</p></div><div><span>03</span><p><strong>Acompañamos la decisión.</strong><br />Una asesora a tu lado desde la primera llamada hasta la firma.</p></div></div><a href="#contacto" className="text-cta text-cta--ink">Conocer nuestro método <ArrowUpRight size={18} /></a></div></section>
      <section className="stats-band" aria-label="Valores de Vivienda Nova"><div><span>01</span><p>Una selección<br />por inmueble</p></div><div><span>1:1</span><p>una conversación<br />antes de decidir</p></div><div><span>02</span><p>formas de llegar:<br />consulta o enlace</p></div><div className="stats-mark"><Sparkles size={34} /><p>Vivienda<br />Nova</p></div></section>
      <section className="contact-section" id="contacto" aria-labelledby="contact-title"><span className="plan-reference plan-reference--contact" aria-hidden="true">COORDENADAS DE ENCUENTRO · 40° 25' N</span><div className="contact-intro"><p className="eyebrow"><span /> Hablemos de casa</p><h2 id="contact-title">¿Empezamos<br />a mirar?</h2><p>Cuéntanos qué buscas. Tu consulta llega directamente al equipo de Vivienda Nova para que podamos responderte con una selección bien pensada.</p><div className="contact-details"><a href="tel:+34910000000"><Phone size={17} /> +34 910 000 000</a><a href="mailto:hola@viviendanova.es"><Mail size={17} /> hola@viviendanova.es</a></div></div><form className="contact-form" onSubmit={sendInquiry}><label>Vivienda de interés<select required name="propertyId" value={inquiryPropertyId} onChange={(event) => setInquiryPropertyId(event.target.value)}><option value="">Selecciona una vivienda</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.title} · {property.city}</option>)}</select></label><label>Tu nombre<input required name="name" placeholder="Nombre y apellidos" /></label><label>Tu correo<input required type="email" name="email" placeholder="nombre@correo.com" /></label><label>Tu teléfono <small>(opcional)</small><input name="phone" type="tel" placeholder="+34 600 000 000" /></label><label>¿Qué te gustaría saber?<textarea required name="message" rows={4} placeholder="Por ejemplo: me gustaría concertar una visita..." /></label><div className="form-footer"><p>Al enviar aceptas que Vivienda Nova trate tus datos para responder a tu solicitud.</p><button type="submit" className="button button--terracotta" disabled={formState === "sending"}>{formState === "sending" ? "Enviando..." : "Enviar consulta"} <Send size={17} /></button></div>{formState === "sent" && <p className="form-success"><Check size={16} /> Hemos recibido tu consulta. Te escribiremos muy pronto.</p>}{formState === "error" && <p className="form-error">Selecciona una vivienda y revisa los datos antes de enviar.</p>}</form></section>
    </main>
    <footer className="site-footer"><Logo dark /><p>Vivienda Nova © 2026</p><div><a href="#inicio">Privacidad</a><a href="#inicio">Aviso legal</a><a href="#inicio">Instagram</a></div></footer>
    {selectedProperty && <div className="property-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedProperty(null)}><section className="property-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}><button type="button" className="dialog-close" onClick={() => setSelectedProperty(null)} aria-label="Cerrar ficha"><X size={20} /></button><img src={selectedProperty.imageUrl} alt={`Vista de ${selectedProperty.title}`} /><div className="dialog-copy"><p className="eyebrow eyebrow--dark">{selectedProperty.zone} · {selectedProperty.city}</p><h2 id="dialog-title">{selectedProperty.title}</h2><p className="dialog-price">{selectedProperty.price}</p><p>{selectedProperty.description}</p><div className="dialog-specs"><span><BedDouble size={16} /> {selectedProperty.bedrooms} habitaciones</span><span><Bath size={16} /> {selectedProperty.bathrooms} baños</span><span><Ruler size={16} /> {selectedProperty.surface} m²</span></div><div className="dialog-actions"><button type="button" className="button button--ink" onClick={() => openInquiry(selectedProperty)}><CalendarDays size={17} /> Solicitar una visita</button>{selectedProperty.externalUrl && selectedProperty.linkMode !== "capture" && <button type="button" className="button button--line" onClick={() => visitSeller(selectedProperty)} disabled={referralMutation.isPending}>Ir al vendedor <ArrowUpRight size={17} /></button>}</div>{referralMutation.isError && <p className="form-error">No se pudo abrir el enlace en este momento.</p>}</div></section></div>}
  </div>;
}
