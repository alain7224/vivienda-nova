/**
 * Estilo Casa & Plano: editorial arquitectónico, asimetría serena, base caliza,
 * azul tinta y terracota Nova. Cada tramo se orienta con cotas o coordenadas funcionales.
 */
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  House,
  ListFilter,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  Search,
  Send,
  Sparkles,
  TreePine,
  X,
} from "lucide-react";

const properties = [
  {
    id: 1,
    image: "/manus-storage/vivienda-nova-card-loft_0aee85c0.jpg",
    tag: "Nuevo en cartera",
    type: "Piso",
    city: "Madrid",
    zone: "Salesas",
    name: "Luz de Salesas",
    price: "895.000 €",
    priceValue: 895,
    bedrooms: 2,
    bathrooms: 2,
    surface: 118,
    description: "Un espacio abierto, doble altura y calma en pleno centro.",
  },
  {
    id: 2,
    image: "/manus-storage/vivienda-nova-card-coastal_f3d8cf76.jpg",
    tag: "Terraza privada",
    type: "Casa",
    city: "Barcelona",
    zone: "Poblenou",
    name: "La Casa del Horizonte",
    price: "1.240.000 €",
    priceValue: 1240,
    bedrooms: 3,
    bathrooms: 3,
    surface: 176,
    description: "Líneas limpias y un horizonte azul que cambia cada día.",
  },
  {
    id: 3,
    image: "/manus-storage/vivienda-nova-card-courtyard_64336dba.jpg",
    tag: "Patio interior",
    type: "Casa",
    city: "Valencia",
    zone: "L'Eixample",
    name: "Patio de Ruzafa",
    price: "640.000 €",
    priceValue: 640,
    bedrooms: 3,
    bathrooms: 2,
    surface: 142,
    description: "Una casa restaurada donde la luz atraviesa cada estancia.",
  },
];

type Property = (typeof properties)[number];

const locations = ["Todas las zonas", "Madrid", "Barcelona", "Valencia"];
const propertyTypes = ["Todos los tipos", "Piso", "Casa"];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a className={`brand ${dark ? "brand--light" : ""}`} href="#inicio" aria-label="Vivienda Nova, inicio">
      <span className="brand-mark" aria-hidden="true">
        <img src="/manus-storage/vivienda-nova-logo_364aff20.png" alt="" />
      </span>
      <span className="brand-name">VIVIENDA<br />NOVA</span>
    </a>
  );
}

function PropertyCard({ property, isSaved, onToggleSave, onView }: {
  property: Property;
  isSaved: boolean;
  onToggleSave: () => void;
  onView: () => void;
}) {
  return (
    <article className="property-card">
      <div className="property-photo-wrap">
        <img className="property-photo" src={property.image} alt={`Fotografía de ${property.name}`} />
        <span className="property-tag">{property.tag}</span>
        <button
          type="button"
          className={`save-button ${isSaved ? "is-saved" : ""}`}
          aria-label={isSaved ? `Quitar ${property.name} de guardados` : `Guardar ${property.name}`}
          onClick={onToggleSave}
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <span className="photo-index">0{property.id} / 03</span>
      </div>
      <div className="property-info">
        <div className="property-heading">
          <div>
            <p className="property-place">{property.zone} · {property.city}</p>
            <h3>{property.name}</h3>
          </div>
          <p className="property-price">{property.price}</p>
        </div>
        <p className="property-description">{property.description}</p>
        <div className="property-footer">
          <div className="property-specs" aria-label="Características">
            <span><BedDouble size={16} /> {property.bedrooms}</span>
            <span><Bath size={16} /> {property.bathrooms}</span>
            <span><Ruler size={16} /> {property.surface} m²</span>
          </div>
          <button type="button" className="inline-link" onClick={onView}>
            Ver ficha <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Todas las zonas");
  const [type, setType] = useState("Todos los tipos");
  const [budget, setBudget] = useState("Sin límite");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formState, setFormState] = useState<"idle" | "sent">("idle");

  const filteredProperties = useMemo(() => properties.filter((property) => {
    const hasLocation = location === "Todas las zonas" || property.city === location;
    const hasType = type === "Todos los tipos" || property.type === type;
    const hasBudget = budget === "Sin límite" ||
      (budget === "Hasta 700.000 €" && property.priceValue <= 700) ||
      (budget === "Hasta 1.000.000 €" && property.priceValue <= 1000) ||
      (budget === "Más de 1.000.000 €" && property.priceValue > 1000);
    return hasLocation && hasType && hasBudget;
  }), [budget, location, type]);

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]);
  };

  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sent");
    window.setTimeout(() => setFormState("idle"), 5500);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="inicio">
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#viviendas">Viviendas</a>
          <a href="#metodo">Nuestro método</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="header-actions">
          <a href="#contacto" className="header-contact">Hablar con una asesora <ArrowUpRight size={15} /></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegación móvil">
            <a href="#viviendas" onClick={closeMenu}>Viviendas</a>
            <a href="#metodo" onClick={closeMenu}>Nuestro método</a>
            <a href="#contacto" onClick={closeMenu}>Contacto</a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Selección residencial · España</p>
            <h1 id="hero-title">Encuentra un lugar que se parezca a ti.</h1>
            <p className="hero-description">Casas con luz, distribución y carácter. Te ayudamos a encontrarlas, entenderlas y decidir con calma.</p>
            <div className="hero-ctas">
              <a className="button button--ink" href="#viviendas">Explorar viviendas <ArrowUpRight size={18} /></a>
              <a className="text-cta" href="#metodo">Cómo trabajamos <ChevronRight size={18} /></a>
            </div>
          </div>
          <div className="hero-art" aria-label="Villa contemporánea de Vivienda Nova">
            <img src="/manus-storage/vivienda-nova-hero_bfccb40b.jpg" alt="Villa contemporánea con olivo y paredes de piedra caliza" />
            <div className="hero-plan-mark" aria-hidden="true"><i /><i /><b>NV</b><span>PLANO / 001</span></div>
            <span className="architect-note note-top">01 — Entrar despacio</span>
            <span className="architect-note note-bottom">Vivir es una forma<br />de decidir</span>
          </div>
          <div className="hero-coordinate">40°25' N · 03°42' W</div>
        </section>

        <section className="search-section" aria-labelledby="search-title">
          <span className="plan-reference plan-reference--search" aria-hidden="true">EJE DE BÚSQUEDA · 04,18 M</span>
          <div className="search-label">
            <span className="outline-number">01</span>
            <div>
              <p className="eyebrow eyebrow--dark">Empieza por aquí</p>
              <h2 id="search-title">Una búsqueda<br />con intención.</h2>
            </div>
          </div>
          <div className="search-panel">
            <label className="search-field">
              <span>Zona</span>
              <div className="select-wrap"><MapPin size={17} /><select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div>
            </label>
            <label className="search-field">
              <span>Tipo de vivienda</span>
              <div className="select-wrap"><House size={17} /><select value={type} onChange={(event) => setType(event.target.value)}>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div>
            </label>
            <label className="search-field">
              <span>Presupuesto</span>
              <div className="select-wrap"><span className="euro-symbol">€</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option>Sin límite</option><option>Hasta 700.000 €</option><option>Hasta 1.000.000 €</option><option>Más de 1.000.000 €</option></select><ChevronDown size={15} /></div>
            </label>
            <a className="search-button" href="#viviendas" aria-label="Ver viviendas que coinciden con la búsqueda"><Search size={21} /><span>Ver viviendas</span></a>
          </div>
        </section>

        <section className="properties-section" id="viviendas" aria-labelledby="properties-title">
          <span className="plan-reference plan-reference--properties" aria-hidden="true">SELECCIÓN · 03 UNIDADES · NORTE</span>
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark"><span /> En cartera ahora</p>
              <h2 id="properties-title">Viviendas<br /><em>para habitar.</em></h2>
            </div>
            <div className="collection-meta">
              <p>{filteredProperties.length} {filteredProperties.length === 1 ? "vivienda seleccionada" : "viviendas seleccionadas"}</p>
              <button type="button" className="filter-link" onClick={() => { setLocation("Todas las zonas"); setType("Todos los tipos"); setBudget("Sin límite"); }}><ListFilter size={16} /> Limpiar filtros</button>
            </div>
          </div>
          {filteredProperties.length > 0 ? (
            <div className="property-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} isSaved={saved.includes(property.id)} onToggleSave={() => toggleSaved(property.id)} onView={() => setSelectedProperty(property)} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={26} />
              <h3>No hay viviendas con esos criterios.</h3>
              <p>Prueba a ampliar la zona, el tipo o el presupuesto de búsqueda.</p>
              <button className="button button--ink" type="button" onClick={() => { setLocation("Todas las zonas"); setType("Todos los tipos"); setBudget("Sin límite"); }}>Ver toda la selección</button>
            </div>
          )}
          <div className="all-properties"><button type="button" className="button button--line" onClick={() => { setLocation("Todas las zonas"); setType("Todos los tipos"); setBudget("Sin límite"); }}>Ver toda la cartera <ArrowUpRight size={17} /></button></div>
        </section>

        <section className="method-section" id="metodo" aria-labelledby="method-title">
          <span className="plan-reference plan-reference--method" aria-hidden="true">RECORRIDO · 01 / 03</span>
          <div className="method-image">
            <img src="/manus-storage/vivienda-nova-card-courtyard_64336dba.jpg" alt="Patio interior de una vivienda restaurada" />
            <div className="method-image-label"><TreePine size={20} /> Casas que respiran</div>
          </div>
          <div className="method-copy">
            <p className="eyebrow"><span /> Más que metros cuadrados</p>
            <h2 id="method-title">La búsqueda<br />también es un<br /><em>proceso de diseño.</em></h2>
            <p>Conocemos cada espacio antes de enseñártelo. Por eso podemos hablarte de orientación, escala, silencios y posibilidades, no solo de una dirección.</p>
            <div className="method-list">
              <div><span>01</span><p><strong>Escuchamos antes de buscar.</strong><br />Tu ritmo, tus prioridades y tu forma de estar en casa.</p></div>
              <div><span>02</span><p><strong>Seleccionamos con criterio.</strong><br />Pocas viviendas, vistas con atención y explicadas con honestidad.</p></div>
              <div><span>03</span><p><strong>Acompañamos la decisión.</strong><br />Una asesora a tu lado desde la primera llamada hasta la firma.</p></div>
            </div>
            <a href="#contacto" className="text-cta text-cta--ink">Conocer nuestro método <ArrowUpRight size={18} /></a>
          </div>
        </section>

        <section className="stats-band" aria-label="Datos de Vivienda Nova">
          <div><span>12</span><p>años entendiendo<br />cada barrio</p></div>
          <div><span>1:1</span><p>una asesora para<br />cada búsqueda</p></div>
          <div><span>03</span><p>ciudades donde<br />nos sentimos locales</p></div>
          <div className="stats-mark"><Sparkles size={34} /><p>Vivienda<br />Nova</p></div>
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title">
          <span className="plan-reference plan-reference--contact" aria-hidden="true">COORDENADAS DE ENCUENTRO · 40° 25' N</span>
          <div className="contact-intro">
            <p className="eyebrow"><span /> Hablemos de casa</p>
            <h2 id="contact-title">¿Empezamos<br />a mirar?</h2>
            <p>Cuéntanos qué buscas. Te responderá una persona del equipo con una primera selección bien pensada.</p>
            <div className="contact-details">
              <a href="tel:+34910000000"><Phone size={17} /> +34 910 000 000</a>
              <a href="mailto:hola@viviendanova.es"><Mail size={17} /> hola@viviendanova.es</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={sendInquiry}>
            <label>Tu nombre<input required name="name" placeholder="Nombre y apellidos" /></label>
            <label>Tu correo<input required type="email" name="email" placeholder="nombre@correo.com" /></label>
            <label>¿Qué te gustaría encontrar?<textarea required name="message" rows={4} placeholder="Por ejemplo: una casa luminosa de tres dormitorios en Valencia..." /></label>
            <div className="form-footer">
              <p>Al enviar aceptas nuestra política de privacidad.</p>
              <button type="submit" className="button button--terracotta">Enviar consulta <Send size={17} /></button>
            </div>
            {formState === "sent" && <p className="form-success"><Check size={16} /> Hemos recibido tu consulta. Te escribiremos muy pronto.</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <Logo dark />
        <p>Vivienda Nova © 2026</p>
        <div><a href="#inicio">Privacidad</a><a href="#inicio">Aviso legal</a><a href="#inicio">Instagram</a></div>
      </footer>

      {selectedProperty && (
        <div className="property-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedProperty(null)}>
          <section className="property-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="dialog-close" onClick={() => setSelectedProperty(null)} aria-label="Cerrar ficha"><X size={20} /></button>
            <img src={selectedProperty.image} alt={`Vista de ${selectedProperty.name}`} />
            <div className="dialog-copy">
              <p className="eyebrow eyebrow--dark">{selectedProperty.zone} · {selectedProperty.city}</p>
              <h2 id="dialog-title">{selectedProperty.name}</h2>
              <p className="dialog-price">{selectedProperty.price}</p>
              <p>{selectedProperty.description}</p>
              <div className="dialog-specs"><span><BedDouble size={16} /> {selectedProperty.bedrooms} habitaciones</span><span><Bath size={16} /> {selectedProperty.bathrooms} baños</span><span><Ruler size={16} /> {selectedProperty.surface} m²</span></div>
              <a href="#contacto" className="button button--ink" onClick={() => setSelectedProperty(null)}><CalendarDays size={17} /> Solicitar una visita</a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
