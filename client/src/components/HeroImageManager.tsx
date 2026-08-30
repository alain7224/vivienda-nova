/** Casa & Plano: cambio privado de la imagen residencial que acompaña el vídeo de portada. */
import { ChangeEvent } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import "./HeroImageManager.css";

const fallback = "/manus-storage/chalet-minimalista-piscina_3bd4eca8.jpg";

export default function HeroImageManager() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const settingsQuery = trpc.admin.settings.useQuery(undefined, { enabled: user?.role === "admin" });
  const upload = trpc.admin.uploadImage.useMutation();
  const save = trpc.admin.updateSettings.useMutation();
  if (user?.role !== "admin") return null;
  const settings = settingsQuery.data;
  const changeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || !settings) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5_000_000) { toast.error("Usa una imagen JPG, PNG o WebP de máximo 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => upload.mutate({ filename: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", base64: String(reader.result) }, { onSuccess: async (result) => {
      try {
        await save.mutateAsync({ bannerText: settings.bannerText, bannerBackground: settings.bannerBackground, bannerColor: settings.bannerColor, bannerHeight: settings.bannerHeight, bannerRotationSeconds: settings.bannerRotationSeconds, cardStyle: settings.cardStyle, enabledLocales: settings.enabledLocales, heroVideos: settings.heroVideos ?? undefined, heroImageUrl: result.url });
        await Promise.all([utils.admin.settings.invalidate(), utils.settings.public.invalidate()]); toast.success("Imagen residencial actualizada");
      } catch { toast.error("La imagen se subió, pero no se pudo guardar."); }
    }, onError: () => toast.error("No se pudo subir la imagen.") });
    reader.readAsDataURL(file);
  };
  const imageUrl = settings?.heroImageUrl || fallback;
  return <section className="hero-image-manager" aria-labelledby="hero-image-manager-title"><div><p className="admin-kicker"><span /> Imagen residencial</p><h2 id="hero-image-manager-title">Escena <em>de portada.</em></h2><p>La imagen clara que acompaña al vídeo en la introducción pública.</p></div><div className="hero-image-manager__side"><img src={imageUrl} alt="Vista previa de la imagen residencial de portada" /><label className="hero-image-manager__file"><Upload size={15} />{upload.isPending || save.isPending ? <><Loader2 className="spin" size={15} /> Guardando…</> : "Cambiar imagen"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={changeImage} disabled={upload.isPending || save.isPending} /></label></div><p className="hero-image-manager__note"><ImagePlus size={14} /> JPG, PNG o WebP · máximo 5 MB · prioriza fachadas luminosas, arquitectura y piscina.</p></section>;
}
