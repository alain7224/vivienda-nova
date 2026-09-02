import { FormEvent, useMemo, useState } from "react";
import { Check, Home, Loader2, ShieldCheck } from "lucide-react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import "./Collaborator.css";

type PropertyForm = {
  slug: string; title: string; address: string; city: string; zone: string; province: string; country: string; type: string;
  price: string; priceValue: number; bedrooms: number; bathrooms: number; surface: number; description: string; imageUrl: string;
  tag: string; status: "draft"; linkMode: "capture"; vendorId: null; externalUrl: null; referralParameter: string; referralCode: string;
};

const blankProperty = (): PropertyForm => ({ slug: "", title: "", address: "", city: "", zone: "", province: "", country: "España", type: "Piso", price: "", priceValue: 0, bedrooms: 1, bathrooms: 1, surface: 60, description: "", imageUrl: "", tag: "Nueva oportunidad", status: "draft", linkMode: "capture", vendorId: null, externalUrl: null, referralParameter: "ref", referralCode: "MARTINEZ" });
const toSlug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180);

export default function Collaborator() {
  const [, params] = useRoute<{ token: string }>("/oficina/:token");
  const token = params?.token ?? "";
  const tokenInput = useMemo(() => ({ token }), [token]);
  const infoQuery = trpc.collaborator.info.useQuery(tokenInput, { enabled: token.length >= 32 });
  const createProperty = trpc.collaborator.createProperty.useMutation();
  const [form, setForm] = useState<PropertyForm>(blankProperty);
  const [sent, setSent] = useState(false);
  const set = <K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await createProperty.mutateAsync({ ...form, token, slug: form.slug || toSlug(form.title) });
      setSent(true);
      toast.success("Vivienda enviada a revisión");
      if (!result.translationsReady) toast.message("La ficha se ha guardado; el administrador podrá reintentar las traducciones al editarla.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar la vivienda.");
    }
  };

  if (infoQuery.isLoading) return <div className="collaborator-loading"><Loader2 className="spin" size={24} /> Comprobando enlace…</div>;
  if (!infoQuery.data?.active) return <div className="collaborator-invalid"><ShieldCheck size={32} /><h1>Enlace no disponible</h1><p>Este enlace de oficina ha caducado, ha sido revocado o no es correcto. Solicita al administrador un enlace nuevo.</p></div>;
  if (sent) return <div className="collaborator-success"><div className="collaborator-success-icon"><Check size={28} /></div><p className="collaborator-kicker">{infoQuery.data.label}</p><h1>Ficha enviada<br /><em>a revisión.</em></h1><p>El administrador recibirá la vivienda como borrador y podrá revisar los datos antes de publicarla.</p><button className="collaborator-button" type="button" onClick={() => { setForm(blankProperty()); setSent(false); }}>Añadir otra vivienda</button></div>;

  return <main className="collaborator-page"><header className="collaborator-header"><a href="/" className="collaborator-brand"><span>NV</span><strong>VIVIENDA<br />NOVA</strong></a><div className="collaborator-badge"><ShieldCheck size={15} /> Enlace privado de oficina</div></header><section className="collaborator-hero"><p className="collaborator-kicker">{infoQuery.data.label}</p><h1>Añadir una<br /><em>vivienda.</em></h1><p>Completa la ficha desde la oficina. Se guardará como borrador para que el administrador revise las imágenes, el enlace del vendedor y la publicación.</p></section><form className="collaborator-form" onSubmit={submit}><div className="collaborator-form-block"><p className="collaborator-form-title">01 · Datos principales</p><div className="collaborator-grid"><label>Título<input required value={form.title} onChange={(event) => { set("title", event.target.value); if (!form.slug) set("slug", toSlug(event.target.value)); }} placeholder="Ej. Apartamento con terraza" /></label><label>Referencia<input required value={form.slug} onChange={(event) => set("slug", toSlug(event.target.value))} placeholder="apartamento-terraza" /></label><label>Ciudad<input required value={form.city} onChange={(event) => set("city", event.target.value)} /></label><label>Zona<input required value={form.zone} onChange={(event) => set("zone", event.target.value)} /></label><label>Provincia<input value={form.province} onChange={(event) => set("province", event.target.value)} /></label><label>País<input required value={form.country} onChange={(event) => set("country", event.target.value)} /></label><label>Dirección<input value={form.address} onChange={(event) => set("address", event.target.value)} /></label><label>Tipo<select value={form.type} onChange={(event) => set("type", event.target.value)}><option>Piso</option><option>Apartamento</option><option>Ático</option><option>Casa</option><option>Chalet</option><option>Villa</option><option>Adosado</option><option>Parcela</option><option>Terreno</option></select></label><label>Precio visible<input required value={form.price} onChange={(event) => set("price", event.target.value)} placeholder="Desde 245.000 €" /></label><label>Precio (€)<input required type="number" min="0" value={form.priceValue || ""} onChange={(event) => set("priceValue", Number(event.target.value))} /></label><label>Dormitorios<input required type="number" min="0" value={form.bedrooms} onChange={(event) => set("bedrooms", Number(event.target.value))} /></label><label>Baños<input required type="number" min="0" value={form.bathrooms} onChange={(event) => set("bathrooms", Number(event.target.value))} /></label><label>Superficie (m²)<input required type="number" min="1" value={form.surface} onChange={(event) => set("surface", Number(event.target.value))} /></label></div><label className="collaborator-wide">Descripción<textarea required rows={6} value={form.description} onChange={(event) => set("description", event.target.value)} placeholder="Describe la vivienda, su estado, orientación y puntos destacados." /></label></div><div className="collaborator-form-block"><p className="collaborator-form-title">02 · Imagen y referencia</p><label className="collaborator-wide">URL de la fotografía principal<input required type="url" value={form.imageUrl} onChange={(event) => set("imageUrl", event.target.value)} placeholder="https://… o /manus-storage/…" /></label><label className="collaborator-wide">Etiqueta<input required value={form.tag} onChange={(event) => set("tag", event.target.value)} placeholder="Nueva oportunidad" /></label><div className="collaborator-notice"><Home size={18} /><p>La ficha se enviará como <strong>borrador</strong>. El administrador completará, si hace falta, el enlace del vendedor y decidirá cuándo hacerla pública.</p></div></div><div className="collaborator-submit"><button className="collaborator-button" type="submit" disabled={createProperty.isPending}>{createProperty.isPending ? <><Loader2 size={17} className="spin" /> Enviando ficha…</> : "Enviar vivienda a revisión"}</button><span><ShieldCheck size={14} /> Este enlace no da acceso al panel de administración.</span></div></form></main>;
}
