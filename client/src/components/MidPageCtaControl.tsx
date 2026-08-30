/** Casa & Plano: control privado del mensaje que orienta la decisión a mitad de página. */
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const defaults = {
  bannerText: "Vivienda Nova · Selección internacional",
  bannerBackground: "#d95f42",
  bannerColor: "#fffdf8",
  bannerHeight: 36,
  bannerRotationSeconds: 5,
  cardStyle: "flat" as const,
  enabledLocales: "es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH",
  heroVideos: undefined as string | undefined,
  midPageCta: "Compra con claridad · Información directa del vendedor",
};

export default function MidPageCtaControl() {
  const settingsQuery = trpc.admin.settings.useQuery();
  const utils = trpc.useUtils();
  const saveMutation = trpc.admin.updateSettings.useMutation();
  const settings = settingsQuery.data ?? defaults;
  const [text, setText] = useState(settings.midPageCta ?? defaults.midPageCta);

  useEffect(() => setText(settings.midPageCta ?? defaults.midPageCta), [settings.midPageCta]);

  const save = async () => {
    try {
      await saveMutation.mutateAsync({
        bannerText: settings.bannerText,
        bannerBackground: settings.bannerBackground,
        bannerColor: settings.bannerColor,
        bannerHeight: settings.bannerHeight,
        bannerRotationSeconds: settings.bannerRotationSeconds,
        cardStyle: settings.cardStyle,
        enabledLocales: settings.enabledLocales,
        heroVideos: settings.heroVideos ?? undefined,
        midPageCta: text.trim(),
      });
      await Promise.all([utils.admin.settings.invalidate(), utils.settings.public.invalidate()]);
      toast.success("Mensaje intermedio actualizado");
    } catch { toast.error("No se pudo guardar el mensaje."); }
  };

  return <section className="mid-cta-control" aria-labelledby="mid-cta-title"><div><p>MENSAJE DE DECISIÓN</p><h2 id="mid-cta-title">Llamada intermedia</h2><span>Se muestra a mitad de la página pública.</span></div><div className="mid-cta-control__form"><input value={text} maxLength={220} onChange={(event) => setText(event.target.value)} aria-label="Texto de llamada a la acción" /><button type="button" onClick={save} disabled={!text.trim() || saveMutation.isPending}><Save size={15} />{saveMutation.isPending ? "Guardando" : "Guardar"}</button></div></section>;
}
