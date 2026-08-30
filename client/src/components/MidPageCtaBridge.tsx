/** Aplica en CSS el mensaje editable de mitad de página que lee desde los ajustes públicos. */
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function MidPageCtaBridge() {
  const settingsQuery = trpc.settings.public.useQuery();
  useEffect(() => {
    const text = settingsQuery.data?.midPageCta || "Compra con claridad · Información directa del vendedor";
    document.documentElement.style.setProperty("--mid-page-cta", JSON.stringify(text));
  }, [settingsQuery.data?.midPageCta]);
  return null;
}
