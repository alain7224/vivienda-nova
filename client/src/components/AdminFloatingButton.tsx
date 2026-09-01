import React, { useEffect, useRef, useState } from "react";
import "./AdminFloatingButton.css";
import { toast } from "sonner";

export default function AdminFloatingButton() {
  const [open, setOpen] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = async () => {
    if (!keyValue) {
      toast.error("Introduce la clave");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/key-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key: keyValue }),
      });

      if (res.ok) {
        toast.success("Acceso concedido — redirigiendo...");
        // Give browser a moment to set the cookie before navigating
        setTimeout(() => {
          window.location.href = "/admin";
        }, 300);
        return;
      }

      if (res.status === 401) {
        toast.error("Clave inválida");
        return;
      }

      if (res.status === 429) {
        toast.error("Demasiados intentos — espera unos segundos");
        return;
      }

      const data = await res.json().catch(() => null);
      toast.error(data?.error || "Error en el servidor");
    } catch (err) {
      console.error("[AdminFloatingButton] login error", err);
      toast.error("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-floating-container">
        <button
          className="admin-floating-button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Abrir panel administrador"
        >
          Área privada
        </button>
      </div>

      {open && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Autenticación administrador">
          <div className="admin-modal">
            <h3 className="admin-modal-title">Acceso administrador</h3>
            <p className="admin-modal-desc">Introduce la clave segura para acceder al área privada.</p>
            <input
              ref={inputRef}
              type="password"
              className="admin-modal-input"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="Clave de administrador"
              aria-label="Clave de administrador"
            />
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => { setOpen(false); setKeyValue(""); }}>
                Cancelar
              </button>
              <button className="admin-modal-submit" onClick={submit} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
