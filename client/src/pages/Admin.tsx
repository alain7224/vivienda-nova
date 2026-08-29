/**
 * Panel Casa & Plano: espacio privado de gestión con superficies calizas,
 * azul tinta y trazos técnicos para operar inventario, contactos y referidos.
 */
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowUpRight, BarChart3, Check, ChevronRight, ExternalLink, FileImage, Link2, Loader2, LockKeyhole, Mail, MapPin, Pencil, Plus, Send, Trash2, Upload, Users } from "lucide-react";
import "./Admin.css";

type LinkMode = "capture" | "redirect" | "both";
type PropertyForm = { slug: string; title: string; city: string; zone: string; type: string; price: string; priceValue: number; bedrooms: number; bathrooms: number; surface: number; description: string; imageUrl: string; tag: string; status: "draft" | "published"; linkMode: LinkMode; externalUrl: string; referralParameter: string; referralCode: string; };
type ListedProperty = PropertyForm & { id: number; createdAt: Date; updatedAt: Date; externalUrl: string | null; referralCode: string | null; };
type Lead = { id: number; propertyId: number; name: string; email: string; phone: string | null; message: string; status: string; createdAt: Date; };

const blankForm = (): PropertyForm => ({ slug: "", title: "", city: "", zone: "", type: "Piso", price: "", priceValue: 0, bedrooms: 1, bathrooms: 1, surface: 60, description: "", imageUrl: "", tag: "Nueva oportunidad", status: "draft", linkMode: "both", externalUrl: "", referralParameter: "ref", referralCode: "" });
const toSlug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180);
const formatDate = (date: Date) => new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

function AdminPanel() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const overviewQuery = trpc.admin.overview.useQuery(undefined, { enabled: user?.role === "admin" });
  const propertiesQuery = trpc.admin.properties.useQuery(undefined, { enabled: user?.role === "admin" });
  const leadsQuery = trpc.admin.leads.useQuery(undefined, { enabled: user?.role === "admin" });
  const createMutation = trpc.admin.createProperty.useMutation();
  const updateMutation = trpc.admin.updateProperty.useMutation();
  const deleteMutation = trpc.admin.deleteProperty.useMutation();
  const uploadMutation = trpc.admin.uploadImage.useMutation();
  const [form, setForm] = useState<PropertyForm>(blankForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const properties = (propertiesQuery.data ?? []) as ListedProperty[];
  const leads = (leadsQuery.data ?? []) as Lead[];
  const referredProperties = useMemo(() => new Map(properties.map((property) => [property.id, property.title])), [properties]);

  const refresh = async () => Promise.all([utils.admin.overview.invalidate(), utils.admin.properties.invalidate(), utils.admin.leads.invalidate(), utils.properties.list.invalidate()]);
  const setField = <K extends keyof PropertyForm>(field: K, value: PropertyForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const openNew = () => { setEditingId(null); setForm(blankForm()); setEditorOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openEdit = (property: ListedProperty) => { setEditingId(property.id); setForm({ ...property, externalUrl: property.externalUrl ?? "", referralCode: property.referralCode ?? "" }); setEditorOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submitProperty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { ...form, slug: form.slug || toSlug(form.title), externalUrl: form.externalUrl.trim() || null, referralCode: form.referralCode.trim() || null };
    try {
      if (editingId) await updateMutation.mutateAsync({ ...payload, id: editingId }); else await createMutation.mutateAsync(payload);
      toast.success(editingId ? "Vivienda actualizada" : "Vivienda guardada");
      setEditorOpen(false); setEditingId(null); setForm(blankForm()); await refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo guardar la vivienda."); }
  };
  const removeProperty = async (property: ListedProperty) => {
    if (!window.confirm(`¿Eliminar “${property.title}”? Esta acción no se puede deshacer.`)) return;
    try { await deleteMutation.mutateAsync({ id: property.id }); toast.success("Vivienda eliminada"); await refresh(); } catch { toast.error("No se pudo eliminar la vivienda."); }
  };
  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5_000_000) { toast.error("Sube una imagen JPG, PNG o WebP de máximo 5 MB."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => uploadMutation.mutate({ filename: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", base64: String(reader.result) }, { onSuccess: (upload) => { setField("imageUrl", upload.url); toast.success("Imagen cargada"); }, onError: () => toast.error("No se pudo subir la imagen.") });
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="admin-loading"><Loader2 size={24} className="spin" /> Cargando área privada…</div>;
  if (!user) return <div className="access-card"><LockKeyhole size={28} /><h1>Área privada</h1><p>Inicia sesión para acceder a la administración de Vivienda Nova.</p><button className="admin-primary" onClick={() => startLogin()}>Iniciar sesión <ArrowUpRight size={16} /></button></div>;
  if (user.role !== "admin") return <div className="access-card"><LockKeyhole size={28} /><h1>Acceso restringido</h1><p>Esta administración solo está disponible para la persona propietaria del proyecto.</p><button className="admin-quiet" onClick={() => setLocation("/")}>Volver al escaparate</button></div>;

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const overview = overviewQuery.data ?? { properties: 0, published: 0, leads: 0, clicks: 0 };
  return <div className="admin-space">
    <header className="admin-top"><div><p className="admin-kicker"><span /> VIVIENDA NOVA · ÁREA PRIVADA</p><h1>Gestión de<br /><em>cartera.</em></h1><p>Publica, enlaza y sigue cada oportunidad desde un mismo lugar.</p></div><a className="admin-site-link" href="/" target="_blank" rel="noreferrer">Ver web pública <ExternalLink size={16} /></a></header>
    <section className="admin-metrics" aria-label="Resumen de actividad"><div><span>01</span><p>inventario<br /><strong>{overview.properties} viviendas</strong></p></div><div><span>02</span><p>publicadas<br /><strong>{overview.published} en web</strong></p></div><div><span>03</span><p>interesados<br /><strong>{overview.leads} contactos</strong></p></div><div><span>04</span><p>referidos<br /><strong>{overview.clicks} clics de salida</strong></p></div></section>
    <section className="admin-actions"><button className="admin-primary" onClick={openNew}><Plus size={17} /> Añadir vivienda</button><a href="#interesados" className="admin-quiet"><Mail size={16} /> Ver interesados</a><div className="admin-trace-note"><Link2 size={16} /> Cada clic de salida queda registrado con la referencia configurada.</div></section>
    {editorOpen && <section className="editor-panel" id="editor" aria-labelledby="editor-title"><div className="editor-heading"><div><p className="admin-kicker"><span /> {editingId ? "Editar ficha" : "Nueva ficha"}</p><h2 id="editor-title">{editingId ? "Ajustar vivienda" : "Incorporar una vivienda"}</h2></div><button className="editor-close" onClick={() => { setEditorOpen(false); setEditingId(null); }}>Cerrar</button></div><form onSubmit={submitProperty} className="property-form"><div className="form-block"><p className="form-block-title">01 · Información del inmueble</p><div className="form-grid two"><label>Título<input required value={form.title} onChange={(event) => { setField("title", event.target.value); if (!editingId) setField("slug", toSlug(event.target.value)); }} placeholder="Ej. Ático de la Luz" /></label><label>Referencia interna<input required value={form.slug} onChange={(event) => setField("slug", toSlug(event.target.value))} placeholder="atico-de-la-luz" /></label><label>Ciudad<input required value={form.city} onChange={(event) => setField("city", event.target.value)} placeholder="Madrid" /></label><label>Zona / barrio<input required value={form.zone} onChange={(event) => setField("zone", event.target.value)} placeholder="Chamberí" /></label><label>Tipo<select value={form.type} onChange={(event) => setField("type", event.target.value)}><option>Piso</option><option>Casa</option><option>Ático</option><option>Loft</option><option>Local</option></select></label><label>Etiqueta<input required value={form.tag} onChange={(event) => setField("tag", event.target.value)} placeholder="Nueva oportunidad" /></label><label>Precio visible<input required value={form.price} onChange={(event) => setField("price", event.target.value)} placeholder="895.000 €" /></label><label>Precio numérico (€)<input required min="0" type="number" value={form.priceValue || ""} onChange={(event) => setField("priceValue", Number(event.target.value))} placeholder="895000" /></label><label>Dormitorios<input required min="0" type="number" value={form.bedrooms} onChange={(event) => setField("bedrooms", Number(event.target.value))} /></label><label>Baños<input required min="0" type="number" value={form.bathrooms} onChange={(event) => setField("bathrooms", Number(event.target.value))} /></label><label>Superficie (m²)<input required min="1" type="number" value={form.surface} onChange={(event) => setField("surface", Number(event.target.value))} /></label><label>Visibilidad<select value={form.status} onChange={(event) => setField("status", event.target.value as "draft" | "published")}><option value="draft">Borrador privado</option><option value="published">Publicada</option></select></label></div><label className="wide-label">Descripción<textarea required value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="Describe la vivienda, su luz, distribución y carácter." rows={4} /></label></div><div className="form-block"><p className="form-block-title">02 · Imagen de portada</p><div className="upload-row"><label className="file-picker"><Upload size={18} /> Subir fotografía<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} /></label><p>JPG, PNG o WebP · máximo 5 MB</p>{uploadMutation.isPending && <Loader2 size={16} className="spin" />}</div>{form.imageUrl && <div className="image-preview"><img src={form.imageUrl} alt="Vista previa de portada" /><span><Check size={16} /> Imagen preparada</span></div>}<label className="wide-label">O pega una URL de imagen<input required value={form.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)} placeholder="https://… o /manus-storage/…" /></label></div><div className="form-block referral-block"><p className="form-block-title">03 · Contactos y enlace del vendedor</p><p className="helper-text">Puedes recibir la consulta, enviar al visitante al vendedor, o usar ambos recorridos. La salida queda registrada en tu panel.</p><div className="form-grid two"><label>Flujo<select value={form.linkMode} onChange={(event) => setField("linkMode", event.target.value as LinkMode)}><option value="both">Consulta y enlace externo</option><option value="capture">Solo consulta en Vivienda Nova</option><option value="redirect">Solo enlace al vendedor</option></select></label><label>Parámetro de referencia<input required value={form.referralParameter} onChange={(event) => setField("referralParameter", event.target.value)} placeholder="ref" /></label></div>{form.linkMode !== "capture" && <div className="form-grid two referral-fields"><label>Enlace del vendedor<input required type="url" value={form.externalUrl} onChange={(event) => setField("externalUrl", event.target.value)} placeholder="https://vendedor.es/vivienda" /></label><label>Tu código de referencia<input required value={form.referralCode} onChange={(event) => setField("referralCode", event.target.value)} placeholder="vivienda-nova-001" /></label></div>}{form.externalUrl && form.referralCode && <p className="tracking-preview"><Link2 size={15} /> La salida añadirá <strong>{form.referralParameter}={form.referralCode}</strong> al enlace del vendedor.</p>}</div><div className="form-submit"><button type="button" className="admin-quiet" onClick={() => { setEditorOpen(false); setEditingId(null); }}>Cancelar</button><button className="admin-primary" type="submit" disabled={isSaving || uploadMutation.isPending}>{isSaving ? <><Loader2 size={16} className="spin" /> Guardando…</> : <><Send size={16} /> {editingId ? "Guardar cambios" : "Guardar vivienda"}</>}</button></div></form></section>}
    <section className="inventory-section" id="viviendas"><div className="section-title-row"><div><p className="admin-kicker"><span /> 01 · Inventario</p><h2>Viviendas <em>en gestión.</em></h2></div><button className="admin-primary admin-primary--small" onClick={openNew}><Plus size={16} /> Nueva</button></div>{propertiesQuery.isLoading ? <div className="admin-empty"><Loader2 className="spin" /> Cargando inventario…</div> : properties.length === 0 ? <div className="admin-empty"><p className="admin-empty-reference">CARPETA 01 / EN PREPARACIÓN</p><FileImage size={28} /><h3>Aún no hay viviendas.</h3><p>Empieza creando una ficha manual o pega el enlace del vendedor con tu referencia.</p><button className="admin-primary" onClick={openNew}>Añadir la primera vivienda</button></div> : <div className="admin-property-list">{properties.map((property) => <article className="admin-property" key={property.id}><img src={property.imageUrl} alt="" /><div className="admin-property-copy"><p>{property.zone} · {property.city}</p><h3>{property.title}</h3><span>{property.price} · {property.surface} m²</span></div><div className="admin-property-state"><span className={`state-pill state-pill--${property.status}`}>{property.status === "published" ? "Publicada" : "Borrador"}</span><span className="link-pill"><Link2 size={13} /> {property.linkMode === "both" ? "Consulta + enlace" : property.linkMode === "capture" ? "Consulta" : "Enlace"}</span></div><div className="admin-property-actions"><button onClick={() => openEdit(property)} aria-label={`Editar ${property.title}`}><Pencil size={16} /></button><button className="delete-button" onClick={() => removeProperty(property)} aria-label={`Eliminar ${property.title}`}><Trash2 size={16} /></button></div></article>)}</div>}</section>
    <section className="leads-section" id="interesados"><div className="section-title-row"><div><p className="admin-kicker"><span /> 02 · Consultas recibidas</p><h2>Interesados <em>identificados.</em></h2></div><div className="leads-key"><Users size={16} /> Aviso privado activo</div></div>{leadsQuery.isLoading ? <div className="admin-empty"><Loader2 className="spin" /> Cargando interesados…</div> : leads.length === 0 ? <div className="admin-empty admin-empty--small"><p className="admin-empty-reference">REGISTRO 02 / SIN ENTRADAS</p><Mail size={25} /><h3>Aún no has recibido consultas.</h3><p>Cuando alguien envíe el formulario de una vivienda, quedará registrado aquí y recibirás un aviso privado.</p></div> : <div className="leads-table-wrap"><table className="leads-table"><thead><tr><th>Interesado</th><th>Vivienda</th><th>Contacto</th><th>Consulta</th><th>Fecha</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><span>Nuevo</span></td><td>{referredProperties.get(lead.propertyId) ?? `Vivienda #${lead.propertyId}`}</td><td><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.phone && <a href={`tel:${lead.phone}`}>{lead.phone}</a>}</td><td>{lead.message}</td><td>{formatDate(lead.createdAt)}</td></tr>)}</tbody></table></div>}</section>
    <section className="attribution-note"><BarChart3 size={22} /><div><h3>Cómo queda registrada una referencia</h3><p>El panel registra el contacto antes de una visita y cada clic de salida al vendedor con la URL y el código configurados. Para que el vendedor reconozca la atribución, utiliza por inmueble el enlace de afiliado, código o parámetro que ese vendedor haya confirmado que acepta.</p></div></section>
  </div>;
}

export default function Admin() { return <DashboardLayout><AdminPanel /></DashboardLayout>; }
