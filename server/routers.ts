import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createProperty,
  createPropertyLead,
  createReferralClick,
  deleteProperty,
  getAdminOverview,
  getPropertyById,
  listAdminProperties,
  listPropertyLeads,
  listPublishedProperties,
  updateProperty,
} from "./db";
import { buildReferralUrl } from "./referral";
import { storagePut } from "./storage";

const propertyInput = z.object({
  slug: z.string().trim().min(3).max(180),
  title: z.string().trim().min(3).max(180),
  city: z.string().trim().min(2).max(100),
  zone: z.string().trim().min(2).max(140),
  type: z.string().trim().min(2).max(80),
  price: z.string().trim().min(1).max(80),
  priceValue: z.number().int().nonnegative(),
  bedrooms: z.number().int().min(0).max(30),
  bathrooms: z.number().int().min(0).max(30),
  surface: z.number().int().positive().max(100000),
  description: z.string().trim().min(10).max(5000),
  imageUrl: z.string().trim().min(1).max(3000),
  tag: z.string().trim().min(2).max(100),
  status: z.enum(["draft", "published"]),
  linkMode: z.enum(["capture", "redirect", "both"]),
  externalUrl: z.string().url().max(3000).nullable().optional(),
  referralParameter: z.string().trim().min(1).max(80),
  referralCode: z.string().trim().min(1).max(160).nullable().optional(),
}).superRefine((value, ctx) => {
  if ((value.linkMode === "redirect" || value.linkMode === "both") && !value.externalUrl) {
    ctx.addIssue({ code: "custom", path: ["externalUrl"], message: "Indica el enlace del vendedor para activar la redirección." });
  }
});

const leadInput = z.object({
  propertyId: z.number().int().positive(),
  name: z.string().trim().min(2).max(160),
  email: z.string().email().max(320),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().min(5).max(5000),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  properties: router({
    list: publicProcedure.query(() => listPublishedProperties()),
    createLead: publicProcedure.input(leadInput).mutation(async ({ input }) => {
      const property = await getPropertyById(input.propertyId);
      if (!property || property.status !== "published") throw new Error("La vivienda no está disponible.");
      await createPropertyLead({ ...input, phone: input.phone || null, status: "new" });
      const notificationSent = await notifyOwner({
        title: `Nuevo interesado: ${property.title}`,
        content: `${input.name} · ${input.email}${input.phone ? ` · ${input.phone}` : ""}`,
      });
      return { success: true, notificationSent };
    }),
  }),
  referrals: router({
    visit: publicProcedure.input(z.object({ propertyId: z.number().int().positive() })).mutation(async ({ input }) => {
      const property = await getPropertyById(input.propertyId);
      if (!property || property.status !== "published" || !property.externalUrl) {
        throw new Error("El enlace del vendedor no está disponible.");
      }
      const destinationUrl = buildReferralUrl(property.externalUrl, property.referralParameter, property.referralCode);
      await createReferralClick(property.id, destinationUrl);
      return { destinationUrl };
    }),
  }),
  admin: router({
    overview: adminProcedure.query(() => getAdminOverview()),
    properties: adminProcedure.query(() => listAdminProperties()),
    leads: adminProcedure.query(() => listPropertyLeads()),
    createProperty: adminProcedure.input(propertyInput).mutation(async ({ input }) => {
      await createProperty({ ...input, externalUrl: input.externalUrl || null, referralCode: input.referralCode || null });
      return { success: true };
    }),
    updateProperty: adminProcedure.input(propertyInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const { id, ...values } = input;
      await updateProperty(id, { ...values, externalUrl: values.externalUrl || null, referralCode: values.referralCode || null });
      return { success: true };
    }),
    deleteProperty: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteProperty(input.id);
      return { success: true };
    }),
    uploadImage: adminProcedure.input(z.object({
      filename: z.string().trim().min(1).max(180),
      mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      base64: z.string().min(1).max(7_000_000),
    })).mutation(async ({ input, ctx }) => {
      const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64;
      const image = Buffer.from(encoded, "base64");
      if (!image.length || image.length > 5_000_000) throw new Error("La imagen debe pesar como máximo 5 MB.");
      const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      const upload = await storagePut(`viviendas/${ctx.user.id}/${cleanName}`, image, input.mimeType);
      return upload;
    }),
  }),
});

export type AppRouter = typeof appRouter;
