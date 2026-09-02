import { useState } from "react";
import { Check, Copy, Link2, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

function formatExpiry(value: Date | string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(value));
}

export default function CollaboratorLinksManager({ onClose }: { onClose: () => void }) {
  const utils = trpc.useUtils();
  const linksQuery = trpc.admin.inviteLinks.useQuery();
  const createLink = trpc.admin.createInviteLink.useMutation();
  const revokeLink = trpc.admin.revokeInviteLink.useMutation();
  const [label, setLabel] = useState("Oficina colaboradora");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    try {
      const result = await createLink.mutateAsync({ label, expiresInDays, origin: window.location.origin });
      setNewUrl(result.url);
      setCopied(false);
      await utils.admin.inviteLinks.invalidate();
      toast.success("Enlace privado generado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo generar el enlace.");
    }
  };

  const copyUrl = async () => {
    if (!newUrl) return;
    try {
      await navigator.clipboard.writeText(newUrl);
      setCopied(true);
      toast.success("Enlace copiado");
    } catch {
      window.prompt("Copia este enlace de oficina:", newUrl);
    }
  };

  const revoke = async (id: number) => {
    if (!window.confirm("¿Revocar este enlace? Dejará de funcionar inmediatamente.")) return;
    try {
      await revokeLink.mutateAsync({ id });
      await utils.admin.inviteLinks.invalidate();
      toast.success("Enlace revocado");
      if (newUrl) setNewUrl("");
    } catch {
      toast.error("No se pudo revocar el enlace.");
    }
  };

  return (
    <section className="editor-panel collaborator-links-panel">
      <div className="editor-heading">
        <div><p className="admin-kicker"><span /> Acceso de oficina</p><h2>Enlaces <em>seguros.</em></h2></div>
        <button className="editor-close" type="button" onClick={onClose}>Cerrar</button>
      </div>
      <div className="collaborator-links-intro"><ShieldCheck size={23} /><p>Genera un enlace privado para que otra persona añada viviendas desde su oficina. Solo podrá crear fichas en <strong>borrador</strong>; tú las revisas y publicas desde este panel.</p></div>
      <div className="collaborator-link-form">
        <label>Nombre de la oficina<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Ej. Oficina Torrevieja" /></label>
        <label>Caducidad<select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))}><option value={7}>7 días</option><option value={30}>30 días</option><option value={60}>60 días</option><option value={90}>90 días</option></select></label>
        <button className="admin-primary" type="button" onClick={generate} disabled={createLink.isPending || !label.trim()}><Plus size={16} /> {createLink.isPending ? "Generando…" : "Generar enlace"}</button>
      </div>
      {newUrl && <div className="collaborator-new-link"><div><span>Enlace recién creado</span><code>{newUrl}</code></div><button type="button" onClick={copyUrl}>{copied ? <Check size={17} /> : <Copy size={17} />} {copied ? "Copiado" : "Copiar enlace"}</button></div>}
      <div className="collaborator-links-list">
        <div className="collaborator-links-list-heading"><h3>Enlaces emitidos</h3>{linksQuery.isLoading && <Loader2 size={16} className="spin" />}</div>
        {(linksQuery.data ?? []).length ? (linksQuery.data ?? []).map((link) => <article className="collaborator-link-row" key={link.id}><div className="collaborator-link-icon"><Link2 size={17} /></div><div><strong>{link.label}</strong><p>Caduca el {formatExpiry(link.expiresAt)}{link.revokedAt ? " · Revocado" : link.lastUsedAt ? " · Usado recientemente" : " · Sin usar"}</p></div><button className="delete-button" type="button" onClick={() => revoke(link.id)} disabled={Boolean(link.revokedAt) || revokeLink.isPending} aria-label={`Revocar enlace de ${link.label}`}><Trash2 size={16} /></button></article>) : <p className="collaborator-links-empty">Todavía no has generado enlaces de oficina.</p>}
      </div>
    </section>
  );
}
