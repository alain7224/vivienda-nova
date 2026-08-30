/** Aplica la imagen residencial editable a la composición de portada. */
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

const fallback = "/manus-storage/chalet-minimalista-piscina_3bd4eca8.jpg";

export default function HeroImageBridge() {
  const settingsQuery = trpc.settings.public.useQuery();
  useEffect(() => {
    const url = settingsQuery.data?.heroImageUrl || fallback;
    document.documentElement.style.setProperty("--hero-art-image", `url("${url}")`);
  }, [settingsQuery.data?.heroImageUrl]);
  return null;
}
