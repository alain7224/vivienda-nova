import { FormEvent, useEffect, useRef, useState } from "react";
import { LockKeyhole, X } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import "./AdminFloatingButton.css";

export default function AdminFloatingButton() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (location === "/admin" && user) return null;

  const close = () => {
    setOpen(false);
    setKeyValue("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keyValue.trim()) {
      toast.error("Introduce la clave de administrador.");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/key-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: keyValue }),
      });

      if (response.ok) {
        toast.success("Acceso concedido. Abriendo administración…");
        window.setTimeout(() => { window.location.assign("/admin"); }, 180);
        return;
      }

      if (response.status === 401) toast.error("La clave no es válida.");
      else if (response.status === 429) toast.error("Demasiados intentos. Espera un minuto.");
      else if (response.status === 503) toast.error("El acceso admin aún no está configurado.");
      else {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        toast.error(data?.error || "No se pudo iniciar la sesión.");
      }
    } catch {
      toast.error("No se pudo conectar con la administración.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="admin-floating-button" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Abrir panel administrador">
        <LockKeyhole size={16} aria-hidden="true" />
        <span>Acceso administrador</span>
      </button>
      {open && (
        <div className="admin-modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
            <button className="admin-modal-close" type="button" onClick={close} aria-label="Cerrar acceso administrador"><X size={18} /></button>
            <div className="admin-modal-icon"><LockKeyhole size={22} /></div>
            <p className="admin-modal-kicker">VIVIENDA NOVA · ZONA PRIVADA</p>
            <h2 id="admin-modal-title">Entrar como administrador</h2>
            <p className="admin-modal-desc">Usa tu clave de administración. No es la contraseña de Manus y nunca se guarda en el navegador.</p>
            <form onSubmit={submit}>
              <label className="admin-modal-label" htmlFor="admin-key">Clave de administrador</label>
              <input ref={inputRef} id="admin-key" type="password" autoComplete="current-password" className="admin-modal-input" value={keyValue} onChange={(event) => setKeyValue(event.target.value)} placeholder="Escribe tu clave segura" />
              <div className="admin-modal-actions">
                <button className="admin-modal-cancel" type="button" onClick={close}>Cancelar</button>
                <button className="admin-modal-submit" type="submit" disabled={loading}>{loading ? "Comprobando…" : "Entrar al panel"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
