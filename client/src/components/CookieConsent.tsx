/** Vivienda Nova: panel de consentimiento para analítica y contenidos externos. */
import { useEffect, useState } from "react";
import { Check, Cookie, Settings2, X } from "lucide-react";

export type CookiePreferences = { analytics: boolean; externalContent: boolean };
export const COOKIE_PREFERENCES_KEY = "vivienda-nova-cookie-preferences";

export function readCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return { analytics: parsed.analytics === true, externalContent: parsed.externalContent === true };
  } catch { return null; }
}

export default function CookieConsent({ onChange }: { onChange: (preferences: CookiePreferences) => void }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({ analytics: false, externalContent: false });

  useEffect(() => {
    const stored = readCookiePreferences();
    if (stored) { setPreferences(stored); onChange(stored); }
    else setVisible(true);
  }, [onChange]);

  const save = (next: CookiePreferences) => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(next));
    setPreferences(next); onChange(next); setOpen(false); setVisible(false);
  };

  useEffect(() => {
    const reopen = () => { const stored = readCookiePreferences() ?? preferences; setPreferences(stored); setVisible(true); setOpen(true); };
    const allowExternalContent = () => save({ ...preferences, externalContent: true });
    window.addEventListener("vivienda-nova:cookie-settings", reopen);
    window.addEventListener("vivienda-nova:allow-external-content", allowExternalContent);
    return () => { window.removeEventListener("vivienda-nova:cookie-settings", reopen); window.removeEventListener("vivienda-nova:allow-external-content", allowExternalContent); };
  }, [preferences]);

  if (!visible) return null;
  return <aside className="cookie-consent" aria-label="Preferencias de privacidad"><div className="cookie-consent__intro"><Cookie size={20} /><div><p>Tu privacidad, primero.</p><span>Usamos el almacenamiento necesario para recordar tus preferencias. La analítica y el mapa interactivo solo se activan si lo autorizas.</span></div></div>{open && <div className="cookie-consent__settings"><label><input type="checkbox" checked={preferences.analytics} onChange={(event) => setPreferences((current) => ({ ...current, analytics: event.target.checked }))} /> Medición privada de visitas y uso del sitio.</label><label><input type="checkbox" checked={preferences.externalContent} onChange={(event) => setPreferences((current) => ({ ...current, externalContent: event.target.checked }))} /> Mapa interactivo de Google para marcar parcelas.</label></div>}<div className="cookie-consent__actions"><button type="button" className="cookie-link" onClick={() => setOpen(!open)}><Settings2 size={15} />{open ? "Cerrar opciones" : "Configurar"}</button><a href="/cookies">Ver política</a><button type="button" className="cookie-reject" onClick={() => save({ analytics: false, externalContent: false })}>Solo necesarias</button><button type="button" className="cookie-accept" onClick={() => save(open ? preferences : { analytics: true, externalContent: true })}><Check size={15} />Aceptar {open ? "selección" : "todo"}</button></div><button type="button" className="cookie-close" aria-label="Cerrar preferencias" onClick={() => save({ analytics: false, externalContent: false })}><X size={16} /></button></aside>;
}
