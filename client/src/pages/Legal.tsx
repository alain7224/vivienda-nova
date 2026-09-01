/** Vivienda Nova: páginas legales informativas; requieren completar datos del titular antes de su publicación definitiva. */
import { ArrowLeft, Scale, ShieldCheck, Cookie, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import "./Legal.css";

type LegalKind = "privacy" | "cookies" | "legal" | "referrals";
const documents: Record<LegalKind, { icon: typeof ShieldCheck; kicker: string; title: string; intro: string; sections: { title: string; body: string }[] }> = {
  privacy: { icon: ShieldCheck, kicker: "PRIVACIDAD · BORRADOR", title: "Política de privacidad", intro: "Este texto explica cómo se tratan los datos que una persona facilita voluntariamente a Vivienda Nova.", sections: [
    { title: "Responsable y contacto", body: "El responsable es el titular de Vivienda Nova. Antes de publicar definitivamente este sitio, debe incorporarse aquí su nombre o razón social, NIF/CIF, domicilio, correo de contacto y, si procede, los datos de su delegado de protección de datos." },
    { title: "Datos y finalidades", body: "Podemos tratar nombre, correo, teléfono, consulta, vivienda o proyecto de interés, ubicación de parcela, imágenes de referencia y código de atribución. Se usan para responder a la solicitud, gestionar el referido solicitado, mantener el historial comercial y proteger la seguridad del servicio." },
    { title: "Base, destinatarios y conservación", body: "El envío de una consulta se basa en el consentimiento mostrado en el formulario. Los datos solo se enviarán al vendedor o equipo seleccionado cuando la persona lo haya autorizado expresamente. Se conservarán durante el tiempo necesario para atender la consulta y durante los plazos legales aplicables." },
    { title: "Derechos", body: "Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad contactando con el responsable. También puedes retirar tu consentimiento y presentar una reclamación ante la autoridad de protección de datos competente." },
  ] },
  cookies: { icon: Cookie, kicker: "COOKIES · CONFIGURABLE", title: "Política de cookies", intro: "Tú eliges qué tecnologías opcionales se activan en Vivienda Nova.", sections: [
    { title: "Necesarias", body: "Guardamos localmente tu elección de privacidad, idioma y la sesión de administración cuando accedes al panel privado. Son necesarias para el funcionamiento solicitado y no se usan para publicidad." },
    { title: "Analítica privada", body: "Solo tras tu autorización, registramos métricas pseudónimas de visita para que el propietario conozca el uso de la web. No utilizamos estos datos para crear perfiles comerciales ni vendemos información de visitantes." },
    { title: "Contenido externo", body: "El mapa interactivo de Google solo se carga si lo aceptas. Al activarlo, Google puede recibir datos técnicos de tu dispositivo conforme a sus propias políticas." },
    { title: "Cómo cambiar la elección", body: "Puedes abrir las preferencias en cualquier momento mediante el enlace «Gestionar cookies» del pie de página. Rechazar opciones no afecta a la navegación básica del sitio." },
  ] },
  legal: { icon: Scale, kicker: "AVISO LEGAL · BORRADOR", title: "Aviso legal", intro: "Vivienda Nova es un escaparate de selección y derivación de oportunidades; no sustituye a la empresa que vende o construye el inmueble.", sections: [
    { title: "Datos del titular pendientes", body: "Antes de una publicación definitiva deben completarse: nombre completo o razón social, NIF/CIF, domicilio, correo electrónico y, cuando corresponda, los datos registrales. Esta información debe permanecer accesible desde todas las páginas públicas." },
    { title: "Alcance del servicio", body: "Vivienda Nova presenta propiedades, productos y solicitudes de construcción, y puede derivar al visitante a una empresa externa. La información del vendedor, la disponibilidad y la contratación final son responsabilidad del proveedor o vendedor identificado en cada caso." },
    { title: "Propiedad intelectual y uso", body: "Los textos, marcas, diseños y contenidos del sitio no podrán reutilizarse sin autorización. Las imágenes y datos de terceros deben publicarse únicamente con autorización o con una licencia válida." },
    { title: "Contacto", body: "Las consultas sobre el sitio, privacidad o derechos deben dirigirse al correo de contacto del responsable, que debe completarse antes de publicar el sitio." },
  ] },
  referrals: { icon: ExternalLink, kicker: "TRANSPARENCIA COMERCIAL", title: "Cómo funcionan los referidos", intro: "Queremos que sepas con claridad cuándo navegas dentro de Vivienda Nova y cuándo vas a una web de un vendedor externo.", sections: [
    { title: "Derivación a terceros", body: "Al pulsar «Ver oferta del vendedor», saldrás de Vivienda Nova y visitarás el sitio del vendedor. Esa empresa gestiona la venta, la documentación, el contacto directo y sus propias condiciones de privacidad." },
    { title: "Código MARTINEZ", body: "El enlace puede incluir el código MARTINEZ u otro identificador acordado para registrar que la visita procede de Vivienda Nova. Este código no identifica por sí solo a la persona visitante." },
    { title: "Contacto voluntario", body: "Si solicitas ayuda desde un formulario, te pediremos que autorices el tratamiento de tus datos y, cuando proceda, su envío al vendedor o equipo que pueda atender tu solicitud. Puedes no autorizarlo y navegar directamente al vendedor." },
  ] },
};

function kindFromPath(path: string): LegalKind { if (path.startsWith("/cookies")) return "cookies"; if (path.startsWith("/aviso-legal")) return "legal"; if (path.startsWith("/referidos")) return "referrals"; return "privacy"; }

export default function Legal() { const [location] = useLocation(); const settingsQuery = trpc.settings.public.useQuery(); const ownerName = settingsQuery.data?.ownerName?.trim() || "Vivienda Nova"; const document = documents[kindFromPath(location)]; const Icon = document.icon; const withOwnerName = (text: string) => text.replaceAll("Vivienda Nova", ownerName); return <main className="legal-page"><header className="legal-header"><Link href="/"><ArrowLeft size={17} />Volver a {ownerName}</Link><span>{ownerName.toUpperCase()} / 2026</span></header><section className="legal-hero"><Icon size={28} /><p>{document.kicker}</p><h1>{document.title}</h1><p className="legal-intro">{withOwnerName(document.intro)}</p></section><section className="legal-content">{document.sections.map((section, index) => <article key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{withOwnerName(section.body)}</p></div></article>)}</section><footer className="legal-footer"><p>Última revisión: 30 de agosto de 2026 · Revisión jurídica recomendada antes de la publicación definitiva.</p><nav><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link><Link href="/referidos">Referidos</Link><Link href="/aviso-legal">Aviso legal</Link></nav></footer></main>; }
