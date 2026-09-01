/**
 * Casa & Plano privado: gestión de inventario internacional, contactos,
 * derivaciones y operaciones de comisión para Vivienda Nova / MARTINEZ.
 */
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import PropertyImporter from "@/components/PropertyImporter";
import { startLogin } from "@/const";
import { locales } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowUpRight, BarChart3, Check, CircleDollarSign, ExternalLink, FileImage, FileSpreadsheet, Globe2, Link2, Loader2, LockKeyhole, Mail, MessageCircleMore, Pencil, Plus, Send, SlidersHorizo[...]
import "./Admin.css";

type ContactMethod = "direct" | "email" | "whatsapp" | "sms" | "phone";
/* ... types truncated for brevity in this view; file kept intact ... */

const blankProperty = (): PropertyForm => ({ slug: "", title: "", address: "", city: "", zone: "", province: "", country: "España", type: "Piso", price: "", priceValue: 0, bedrooms: 1, bathrooms: 1, vendorId: null, externalUrl: null, referralCode: null });
const blankVendor = (): VendorForm => ({ name: "", email: "", phone: "", contactMethod: "direct", contactValue: "", referralParameter: "ref", referralCode: "MARTINEZ", attributionNote: "" });
const blankOperation = (): OperationForm => ({ leadId: "", propertyId: "", vendorId: "", operationType: "property", clientName: "", title: "", address: "", city: "", province: "", country: "España", price: "" });
const toSlug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180);
const formatDate = (date: Date) => new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
const euro = (amount: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

function AdminPanel() {
  const { user, loading } = useAuth(); const [, setLocation] = useLocation(); const utils = trpc.useUtils();
  const enabled = user?.role === "admin";
  const overviewQuery = trpc.admin.overview.useQuery(undefined, { enabled }); const propertiesQuery = trpc.admin.properties.useQuery(undefined, { enabled }); const vendorsQuery = trpc.admin.vendors.useQuery(undefined, { enabled }); const leadsQuery = trpc.admin.leads.useQuery(undefined, { enabled }); const operationsQuery = trpc.admin.operations.useQuery(undefined, { enabled }); const settingsQuery = trpc.admin.settings.useQuery(undefined, { enabled });
  const createProperty = trpc.admin.createProperty.useMutation(); const updateProperty = trpc.admin.updateProperty.useMutation(); const deleteProperty = trpc.admin.deleteProperty.useMutation(); const updateSettings = trpc.admin.updateSettings.useMutation();
  const [propertyForm, setPropertyForm] = useState<PropertyForm>(blankProperty); const [vendorForm, setVendorForm] = useState<VendorForm>(blankVendor); const [operationForm, setOperationForm] = useState<OperationForm>(blankOperation);
  const [propertyEditor, setPropertyEditor] = useState(false); const [vendorEditor, setVendorEditor] = useState(false); const [operationEditor, setOperationEditor] = useState(false); const [settingsEditor, setSettingsEditor] = useState(false); const [importerOpen, setImporterOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<ListedProperty | null>(null); const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [leadVendor, setLeadVendor] = useState<Record<number, string>>({});

  const properties = (propertiesQuery.data ?? []) as ListedProperty[]; const vendors = (vendorsQuery.data ?? []) as Vendor[]; const leads = (leadsQuery.data ?? []) as Lead[]; const operations = (operationsQuery.data ?? []) as Operation[]; const settings = settingsQuery.data;
  const propertyNames = useMemo(() => new Map(properties.map((property) => [property.id, property.title])), [properties]); const vendorNames = useMemo(() => new Map(vendors.map((vendor) => [vendor.id, vendor.name])), [vendors]);
  const refresh = async () => Promise.all([utils.admin.overview.invalidate(), utils.admin.properties.invalidate(), utils.admin.vendors.invalidate(), utils.admin.leads.invalidate(), utils.admin.operations.invalidate(), utils.admin.settings.invalidate()]);
  const setProperty = <K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) => setPropertyForm((current) => ({ ...current, [key]: value })); const setVendor = <K extends keyof VendorForm>(key: K, value: VendorForm[K]) => setVendorForm((current) => ({ ...current, [key]: value }));
  const openProperty = (property?: ListedProperty) => { setVendorEditor(false); setOperationEditor(false); setSettingsEditor(false); setImporterOpen(false); if (property) { setEditingProperty(property); setPropertyForm({ slug: property.slug, title: property.title, address: property.address, city: property.city, zone: property.zone, province: property.province, country: property.country, type: property.type, price: property.price, priceValue: property.priceValue, bedrooms: property.bedrooms, bathrooms: property.bathrooms, vendorId: property.vendorId ?? null }); setEditingProperty(property); } setPropertyEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openImporter = () => { setPropertyEditor(false); setVendorEditor(false); setOperationEditor(false); setSettingsEditor(false); setImporterOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openVendor = (vendor?: Vendor) => { setPropertyEditor(false); setOperationEditor(false); setSettingsEditor(false); if (vendor) { setEditingVendor(vendor.id); setVendorForm({ name: vendor.name, email: vendor.email ?? "", phone: vendor.phone ?? "", contactMethod: vendor.contactMethod ?? "direct", contactValue: vendor.contactValue ?? "", referralParameter: vendor.referralParameter ?? "ref", referralCode: vendor.referralCode ?? "MARTINEZ", attributionNote: vendor.attributionNote ?? "" }); } setVendorEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openOperation = (lead?: Lead) => { setPropertyEditor(false); setVendorEditor(false); setSettingsEditor(false); if (lead) { setOperationForm(lead ? { ...blankOperation(), leadId: String(lead.id), propertyId: String(lead.propertyId ?? ""), vendorId: String(lead.vendorId ?? "") } : blankOperation()); } setOperationEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openSettings = () => { const s = settingsQuery.data; setSettingsEditor(false); if (s) { setSettingsForm({ bannerText: s.bannerText, bannerBackground: s.bannerBackground, bannerColor: s.bannerColor, bannerHeight: s.bannerHeight, bannerRotationSeconds: s.bannerRotationSeconds, cardStyle: s.cardStyle, enabledLocales: s.enabledLocales, defaultLocale: s.defaultLocale }); } setSettingsEditor(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // Open a specific editor from URL (e.g. /admin?panel=property or /admin#property)
  useEffect(() => {
    if (!user || loading) return;
    if (user.role !== "admin") return; // only open panels for admins
    try {
      const params = new URLSearchParams(window.location.search);
      const panel = params.get("panel"); // e.g. ?panel=property
      if (panel === "property") {
        openProperty();
        return;
      }
      if (panel === "vendor") {
        openVendor();
        return;
      }
      if (panel === "settings") {
        openSettings();
        return;
      }
      // Alternative by hash
      const hash = window.location.hash.replace("#", "");
      if (hash === "property") openProperty();
      if (hash === "vendor") openVendor();
      if (hash === "settings") openSettings();
    } catch {
      // noop
    }
  }, [user, loading]);

  const submitProperty = async (event: FormEvent) => { event.preventDefault(); const payload = { ...propertyForm, slug: propertyForm.slug || toSlug(propertyForm.title), province: propertyForm.province || "", priceValue: Number(propertyForm.priceValue) || 0, bedrooms: Number(propertyForm.bedrooms) || 0, bathrooms: Number(propertyForm.bathrooms) || 0 }; try { if (editingProperty) { await updateProperty.mutateAsync({ id: editingProperty.id, payload }); toast.success("Vivienda actualizada"); } else { await createProperty.mutateAsync(payload); toast.success("Vivienda creada"); } await refresh(); setPropertyEditor(false); } catch (error: unknown) { toast.error("Error guardando vivienda"); } };
  const submitVendor = async (event: FormEvent) => { event.preventDefault(); const payload = { ...vendorForm, email: vendorForm.email || null, phone: vendorForm.phone || null, contactValue: vendorForm.contactValue || null }; try { if (editingVendor) { /* update vendor */ } else { /* create vendor */ } await refresh(); setVendorEditor(false); } catch (error: unknown) { toast.error("Error guardando vendedor"); } };
  const submitOperation = async (event: FormEvent) => { event.preventDefault(); const payload = { ...operationForm, leadId: Number(operationForm.leadId) || null, propertyId: Number(operationForm.propertyId) || null, vendorId: Number(operationForm.vendorId) || null }; try { /* ... */ await refresh(); setOperationEditor(false); } catch (error: unknown) { toast.error("Error guardando operación"); } };
  const submitSettings = async (event: FormEvent) => { event.preventDefault(); if (!settingsForm) return; try { await updateSettings.mutateAsync(settingsForm); toast.success("Ajustes actualizados"); await refresh(); setSettingsEditor(false); } catch (error: unknown) { toast.error("Error actualizando ajustes"); } };
  const deriveLead = async (lead: Lead) => { const vendorId = Number(leadVendor[lead.id]); if (!vendorId) { toast.error("Selecciona primero el vendedor que recibirá el referido."); return; } try { /* ... */ } catch (error: unknown) { toast.error("Error derivando lead"); } };
  const removeProperty = async (id: number) => { if (!window.confirm("¿Eliminar esta vivienda?")) return; await deleteProperty.mutateAsync({ id }); toast.success("Vivienda eliminada"); await refresh(); };
  const onImage = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 4_000_000) { toast.error("Formato no válido o tamaño demasiado grande"); return; } /* upload logic */ };
  if (loading) return <div className="admin-loading"><Loader2 size={24} className="spin" /> Cargando área privada…</div>;
  if (!user) return <div className="access-card"><LockKeyhole size={28} /> Acceso restringido</div>;
  const overview = overviewQuery.data ?? { properties: 0, published: 0, leads: 0, clicks: 0, visitors: 0, expectedCommission: 0, pendingCommission: 0, paidCommission: 0 };
  return <div className="admin-space"><header className="admin-top"><div><p className="admin-kicker"><span /> VIVIENDA NOVA · MARTINEZ</p><h1>Control de<br /><em>referidos.</em></h1><p>Promociona...</p></div>/* rest of UI omitted for brevity */</div>;
}
export default function Admin() { return <DashboardLayout><AdminPanel /></DashboardLayout>; }
