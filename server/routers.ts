import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { referenceMimeTypes } from "../shared/referenceFiles";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createCommissionOperation,
  createPropertyInviteLink,
  createProperty,
  createPropertyLead,
  createReferralClick,
  createSiteVisit,
  createVendor,
  countPropertiesForVendor,
  deleteProperty,
  deleteVendor,
  getActivePropertyInviteLink,
  getAdminOverview,
  getPropertyById,
  getPropertyLeadById,
  getVisitGeoSummary,
  getPublicSiteSettings,
  getSiteSettings,
  getVendorById,
  listAdminProperties,
  listCommissionOperations,
  listPropertyInviteLinks,
  listPropertyLeads,
  listPublishedProperties,
  listReferralClicks,
  listSiteVisits,
  listVendors,
  replacePropertyTranslations,
  requiresExternalSellerForPublishedEntry,
  revokePropertyInviteLink,
  touchPropertyInviteLink,
  updateCommissionOperation,
  updateProperty,
  updatePropertyLeadStatus,
  updateSiteSettings,
  updateVendor,
} from "./db";
import { buildReferralChannelUrl } from "./referral";
import { createLeadConsentTimestamps } from "./consent";
import { storagePut } from "./storage";
import { translatePropertyCopy } from "./translation";
import { buildCollaboratorUrl, createCollaboratorToken, forceCollaboratorDraft, hashCollaboratorToken } from "./collaborator";
import { resolveVisitGeo } from "./geo";
import { importLrCostaHomesUrl } from "./lrCostaHomes";

const directChannels = ["direct", "email", "whatsapp", "sms", "phone"] as const;
const propertyInput = z.object({
  slug: z.string().trim().min(3).max(180), title: z.string().trim().min(3).max(180), city: z.string().trim().min(2).max(100), zone: z.string().trim().min(2).max(140),
  province: z.string().trim().max(140).nullable().optional(), country: z.string().trim().min(2).max(100).default("España"), type: z.string().trim().min(2).max(80),
  price: z.string().trim().min(1).max(80), priceValue: z.number().int().nonnegative(), bedrooms: z.number().int().min(0).max(30), bathrooms: z.number().int().min(0).max(30), surface: z.number().int().positive().max(100000),
  description: z.string().trim().min(10).max(5000), imageUrl: z.string().trim().min(1).max(3000), imageGallery: z.array(z.string().startsWith("/manus-storage/")).max(30).optional(), tag: z.string().trim().min(2).max(100), status: z.enum(["draft", "published"]),
  linkMode: z.enum(["capture", "redirect", "both"]).default("redirect"), vendorId: z.number().int().positive().nullable().optional(), externalUrl: z.string().url().max(3000).nullable().optional(),
  referralParameter: z.string().trim().min(1).max(80).default("ref"), referralCode: z.string().trim().min(1).max(160).nullable().optional(),
}).superRefine((value, ctx) => {
  if ((value.linkMode === "redirect" || value.linkMode === "both") && !value.externalUrl) {
    ctx.addIssue({ code: "custom", path: ["externalUrl"], message: "Indica el enlace del vendedor para activar la derivación." });
  }
});

const vendorInput = z.object({
  name: z.string().trim().min(2).max(160), email: z.string().email().max(320).nullable().optional(), phone: z.string().trim().max(50).nullable().optional(),
  contactMethod: z.enum(directChannels).default("direct"), contactValue: z.string().trim().max(3000).nullable().optional(), referralParameter: z.string().trim().min(1).max(80).default("ref"),
  referralCode: z.string().trim().min(1).max(160).nullable().optional(), attributionNote: z.string().trim().max(3000).nullable().optional(),
}).superRefine((value, ctx) => { if (value.contactMethod !== "direct" && !value.contactValue) ctx.addIssue({ code: "custom", path: ["contactValue"], message: "Indica el correo o teléfono del canal elegido." }); });

const leadInput = z.object({
  leadType: z.enum(["property", "construction", "product"]).default("property"), propertyId: z.number().int().positive().nullable().optional(), name: z.string().trim().min(2).max(160),
  email: z.string().email().max(320), phone: z.string().trim().max(50).nullable().optional(), preferredLocation: z.string().trim().max(200).nullable().optional(), preferredProvince: z.string().trim().max(140).nullable().optional(),
  latitude: z.string().trim().max(32).nullable().optional(), longitude: z.string().trim().max(32).nullable().optional(), budget: z.string().trim().max(100).nullable().optional(),
  referenceImages: z.array(z.string().startsWith("/manus-storage/")).max(5).optional(), attributionCode: z.string().trim().min(1).max(160).default("MARTINEZ"), privacyAccepted: z.boolean(), referralConsent: z.boolean(), message: z.string().trim().min(5).max(5000),
}).superRefine((value, ctx) => { if (value.leadType === "property" && !value.propertyId) ctx.addIssue({ code: "custom", path: ["propertyId"], message: "Selecciona una vivienda." }); });

const operationInput = z.object({
  leadId: z.number().int().positive().nullable().optional(), propertyId: z.number().int().positive().nullable().optional(), vendorId: z.number().int().positive().nullable().optional(), operationType: z.enum(["property", "construction", "product"]).default("property"),
  clientName: z.string().trim().min(2).max(160), title: z.string().trim().min(2).max(220), address: z.string().trim().min(2).max(300), city: z.string().trim().min(2).max(140), province: z.string().trim().min(2).max(140), country: z.string().trim().min(2).max(100).default("España"),
  salePrice: z.number().int().nonnegative(), commissionPercent: z.number().int().min(0).max(100), commissionStatus: z.enum(["expected", "pending", "paid", "cancelled"]), closedAt: z.date().nullable().optional(), paidAt: z.date().nullable().optional(), notes: z.string().trim().max(5000).nullable().optional(),
});

const settingsInput = z.object({ bannerText: z.string().trim().min(1).max(220), bannerBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/), bannerColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), bannerHeight: z.number().int().min(26).max(72), bannerRotationSeconds: z.number().int().min(2).max(20), cardStyle: z.enum(["flat", "three_d"]), enabledLocales: z.string().trim().min(2).max(1000), contactPhone: z.string().trim().max(32).optional(), notificationPhones: z.string().trim().max(500).optional(), notificationEmail: z.string().email().max(320).nullable().optional(), ownerName: z.string().trim().min(2).max(160).optional(), businessMode: z.enum(["real_estate", "catalog"]).optional(), propertyOrder: z.string().max(8000).optional().refine((value) => { if (value === undefined) return true; try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.every((id) => Number.isInteger(id) && id > 0); } catch { return false; } }, "El orden manual no es válido."), midPageCta: z.string().trim().min(1).max(220).optional(), heroImageUrl: z.string().startsWith("/manus-storage/").max(3000).optional(), heroVideos: z.string().max(5000).optional().refine((value) => { if (value === undefined) return true; try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.length <= 6 && parsed.every((item) => typeof item?.label === "string" && typeof item?.url === "string" && item.url.startsWith("/manus-storage/")); } catch { return false; } }, "La lista de vídeos no es válida.") });

async function syncTranslations(propertyId: number, input: z.infer<typeof propertyInput>) {
  const translations = await translatePropertyCopy({ title: input.title, city: input.city, zone: input.zone, type: input.type, tag: input.tag, description: input.description });
  await replacePropertyTranslations(propertyId, translations);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  settings: router({ public: publicProcedure.query(() => getPublicSiteSettings()) }),
  properties: router({
    list: publicProcedure.input(z.object({ locale: z.string().max(12).optional() }).optional()).query(({ input }) => listPublishedProperties(input?.locale)),
    createLead: publicProcedure.input(leadInput).mutation(async ({ input }) => {
      const property = input.propertyId ? await getPropertyById(input.propertyId) : undefined;
      if (input.leadType === "property" && (!property || property.status !== "published")) throw new Error("La vivienda no está disponible.");
      const { privacyAccepted, referralConsent, ...lead } = input;
      const consent = createLeadConsentTimestamps({ privacyAccepted, referralConsent });
      await createPropertyLead({ ...lead, propertyId: lead.propertyId || null, phone: lead.phone || null, preferredLocation: lead.preferredLocation || null, preferredProvince: lead.preferredProvince || null, latitude: lead.latitude || null, longitude: lead.longitude || null, budget: lead.budget || null, referenceImages: lead.referenceImages?.length ? JSON.stringify(lead.referenceImages) : null, attributionCode: lead.attributionCode || "MARTINEZ", status: "new", ...consent });
      const label = property?.title || (input.leadType === "construction" ? "Proyecto de construcción" : "Producto");
      const internalLink = property ? `/?property=${encodeURIComponent(property.slug)}` : "/#contacto";
      const settings = await getSiteSettings();
      const notificationSent = await notifyOwner({ title: `Nuevo interesado: ${label}`, content: [`Interés privado recibido en Vivienda Nova`, `Vivienda: ${label}`, `Enlace interno: ${internalLink}`, `Nombre: ${input.name}`, `Correo: ${input.email}`, `Teléfono: ${input.phone || "No indicado"}`, `Mensaje: ${input.message}`, `Destinatarios configurados: ${(settings?.notificationPhones || "ninguno").split(",").slice(0, 3).join(", ")}${settings?.notificationEmail ? ` · ${settings.notificationEmail}` : ""}`, `Referencia: ${input.attributionCode || "MARTINEZ"}`].join("\n") });
      return { success: true, notificationSent };
    }),
  }),
  analytics: router({ recordVisit: publicProcedure.input(z.object({ visitorId: z.string().min(8).max(80), locale: z.string().min(2).max(12), page: z.string().min(1).max(200) })).mutation(async ({ input, ctx }) => createSiteVisit(input.visitorId, input.locale, input.page, await resolveVisitGeo(ctx.req))) }),
  construction: router({
    uploadReference: publicProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(referenceMimeTypes), base64: z.string().min(1).max(12_000_000) })).mutation(async ({ input }) => {
      const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64;
      const image = Buffer.from(encoded, "base64");
      if (!image.length || image.length > 8_000_000) throw new Error("Cada archivo debe pesar como máximo 8 MB.");
      const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      return storagePut(`referencias-construccion/${Date.now()}-${cleanName}`, image, input.mimeType);
    }),
  }),
  collaborator: router({
    info: publicProcedure.input(z.object({ token: z.string().trim().min(32).max(200) })).query(async ({ input }) => {
      const link = await getActivePropertyInviteLink(hashCollaboratorToken(input.token));
      return link ? { active: true, label: link.label, expiresAt: link.expiresAt } : { active: false };
    }),
    createProperty: publicProcedure.input(propertyInput.safeExtend({ token: z.string().trim().min(32).max(200) })).mutation(async ({ input }) => {
      const { token, ...values } = input;
      const link = await getActivePropertyInviteLink(hashCollaboratorToken(token));
      if (!link) throw new Error("Este enlace de oficina ha caducado o ha sido revocado.");
      const draft = forceCollaboratorDraft(values);
      const id = await createProperty({ ...draft, imageGallery: values.imageGallery?.length ? JSON.stringify(Array.from(new Set([values.imageUrl, ...values.imageGallery]))) : null, referralCode: values.referralCode || "MARTINEZ" });
      let translationsReady = true;
      try { await syncTranslations(id, draft); } catch { translationsReady = false; }
      await touchPropertyInviteLink(link.id);
      return { success: true, id, translationsReady };
    }),
  }),
  referrals: router({
    visit: publicProcedure.input(z.object({ propertyId: z.number().int().positive() })).mutation(async ({ input }) => {
      const property = await getPropertyById(input.propertyId);
      if (!property || property.status !== "published") throw new Error("La vivienda no está disponible.");
      return { destinationUrl: `/?property=${encodeURIComponent(property.slug)}`, channel: "internal" as const };
    }),
  }),
  admin: router({
    overview: adminProcedure.query(() => getAdminOverview()), visitGeo: adminProcedure.query(() => getVisitGeoSummary()), properties: adminProcedure.query(() => listAdminProperties()), leads: adminProcedure.query(() => listPropertyLeads()), vendors: adminProcedure.query(() => listVendors()),
    operations: adminProcedure.query(() => listCommissionOperations()), interactions: adminProcedure.query(async () => {
      const [visits, clicks] = await Promise.all([listSiteVisits(), listReferralClicks()]);
      return [
        ...visits.map((visit) => ({ id: `visit-${visit.id}`, kind: "visit" as const, propertyId: null, channel: null, locale: visit.locale, createdAt: visit.createdAt })),
        ...clicks.map((click) => ({ id: `click-${click.id}`, kind: "click" as const, propertyId: click.propertyId, channel: click.channel, locale: null, createdAt: click.createdAt })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 100);
    }), settings: adminProcedure.query(() => getSiteSettings()),
    importLrCostaHomes: adminProcedure.input(z.object({ sourceUrl: z.string().url().max(3000) })).mutation(({ input }) => importLrCostaHomesUrl(input.sourceUrl)),
    createProperty: adminProcedure.input(propertyInput).mutation(async ({ input }) => { const id = await createProperty({ ...input, imageGallery: input.imageGallery?.length ? JSON.stringify(Array.from(new Set([input.imageUrl, ...input.imageGallery]))) : null, province: input.province || null, vendorId: input.vendorId || null, externalUrl: input.externalUrl || null, referralCode: input.referralCode || "MARTINEZ" }); let translationsReady = true; try { await syncTranslations(id, input); } catch { translationsReady = false; } return { success: true, translationsReady }; }),
    updateProperty: adminProcedure.input(propertyInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; await updateProperty(id, { ...values, imageGallery: values.imageGallery?.length ? JSON.stringify(Array.from(new Set([values.imageUrl, ...values.imageGallery]))) : null, province: values.province || null, vendorId: values.vendorId || null, externalUrl: values.externalUrl || null, referralCode: values.referralCode || "MARTINEZ" }); let translationsReady = true; try { await syncTranslations(id, values); } catch { translationsReady = false; } return { success: true, translationsReady }; }),
    approveProperty: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await updateProperty(input.id, { status: "published", linkMode: "capture" }); return { success: true }; }),
    deleteProperty: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteProperty(input.id); return { success: true }; }),
    createVendor: adminProcedure.input(vendorInput).mutation(async ({ input }) => { await createVendor({ ...input, email: input.email || null, phone: input.phone || null, contactValue: input.contactValue || null, referralCode: input.referralCode || "MARTINEZ", attributionNote: input.attributionNote || null }); return { success: true }; }),
    updateVendor: adminProcedure.input(vendorInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; await updateVendor(id, { ...values, email: values.email || null, phone: values.phone || null, contactValue: values.contactValue || null, referralCode: values.referralCode || "MARTINEZ", attributionNote: values.attributionNote || null }); return { success: true }; }),
    deleteVendor: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { if (await countPropertiesForVendor(input.id)) throw new Error("Desvincula primero las viviendas de este vendedor."); await deleteVendor(input.id); return { success: true }; }),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "sent_to_seller", "in_follow_up", "won", "lost"]) })).mutation(async ({ input }) => { await updatePropertyLeadStatus(input.id, input.status); return { success: true }; }),
    prepareLeadReferral: adminProcedure.input(z.object({ leadId: z.number().int().positive(), vendorId: z.number().int().positive() })).mutation(async ({ input }) => {
      const [lead, vendor] = await Promise.all([getPropertyLeadById(input.leadId), getVendorById(input.vendorId)]);
      if (!lead || !vendor) throw new Error("No se encontró el cliente o el vendedor.");
      if (!lead.referralConsentAt) throw new Error("Este cliente no autorizó el envío de sus datos al vendedor.");
      const property = lead.propertyId ? await getPropertyById(lead.propertyId) : undefined;
      const title = property?.title || (lead.leadType === "construction" ? "Proyecto de construcción a medida" : "Consulta de producto");
      const message = `Cliente referido por MARTINEZ\nNombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone || "No indicado"}\nInterés: ${title}\nMensaje: ${lead.message}\nReferencia: ${vendor.referralCode}`;
      const channel = vendor.contactMethod;
      if (!vendor.contactValue && channel !== "direct") throw new Error("Este vendedor no tiene un canal de contacto configurado.");
      const destinationUrl = buildReferralChannelUrl(channel, channel === "direct" ? property?.externalUrl || "" : vendor.contactValue || "", message, vendor.referralParameter, vendor.referralCode);
      await updatePropertyLeadStatus(lead.id, "sent_to_seller");
      return { destinationUrl, channel };
    }),
    createOperation: adminProcedure.input(operationInput).mutation(async ({ input }) => { const commissionAmount = Math.round(input.salePrice * input.commissionPercent / 100); await createCommissionOperation({ ...input, leadId: input.leadId || null, propertyId: input.propertyId || null, vendorId: input.vendorId || null, commissionAmount, closedAt: input.closedAt || null, paidAt: input.paidAt || null, notes: input.notes || null }); return { success: true, commissionAmount }; }),
    updateOperation: adminProcedure.input(operationInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; const commissionAmount = Math.round(values.salePrice * values.commissionPercent / 100); await updateCommissionOperation(id, { ...values, leadId: values.leadId || null, propertyId: values.propertyId || null, vendorId: values.vendorId || null, commissionAmount, closedAt: values.closedAt || null, paidAt: values.paidAt || null, notes: values.notes || null }); return { success: true, commissionAmount }; }),
    updateSettings: adminProcedure.input(settingsInput).mutation(async ({ input }) => { await updateSiteSettings(input); return { success: true }; }),
    uploadImage: adminProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), base64: z.string().min(1).max(7_000_000) })).mutation(async ({ input, ctx }) => { const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64; const image = Buffer.from(encoded, "base64"); if (!image.length || image.length > 5_000_000) throw new Error("La imagen debe pesar como máximo 5 MB."); const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-"); return storagePut(`viviendas/${ctx.user.id}/${cleanName}`, image, input.mimeType); }),
    uploadHeroVideo: adminProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(["video/mp4", "video/webm"]), base64: z.string().min(1).max(65_000_000) })).mutation(async ({ input, ctx }) => { const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64; const video = Buffer.from(encoded, "base64"); if (!video.length || video.length > 45_000_000) throw new Error("El vídeo debe pesar como máximo 45 MB."); const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-"); return storagePut(`videos-portada/${ctx.user.id}/${Date.now()}-${cleanName}`, video, input.mimeType); }),
    inviteLinks: adminProcedure.query(async () => (await listPropertyInviteLinks()).map(({ tokenHash: _tokenHash, ...link }) => link)),
    createInviteLink: adminProcedure.input(z.object({ label: z.string().trim().min(2).max(160), origin: z.string().url(), expiresInDays: z.number().int().min(1).max(90).default(30) })).mutation(async ({ input, ctx }) => { const { token, tokenHash } = createCollaboratorToken(); const expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000); const id = await createPropertyInviteLink({ tokenHash, label: input.label, createdByUserId: ctx.user.id, expiresAt }); return { id, label: input.label, expiresAt, url: buildCollaboratorUrl(input.origin, token) }; }),
    revokeInviteLink: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await revokePropertyInviteLink(input.id); return { success: true }; }),
  }),
});

export type AppRouter = typeof appRouter;
