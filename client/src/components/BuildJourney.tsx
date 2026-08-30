/**
 * Casa & Plano: recorrido de proyecto de construcción con punto de parcela,
 * referencias visuales opcionales y confirmación de trazabilidad MARTINEZ.
 */
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { trpc } from "@/lib/trpc";
import { isReferenceMimeType, type ReferenceMimeType } from "@shared/referenceFiles";
import { Check, ChevronLeft, ChevronRight, Compass, FileText, House, ImagePlus, LocateFixed, MapPin, Send, WalletCards, X } from "lucide-react";
import "./BuildJourney.css";

type Coordinates = { lat: number; lng: number } | null;
type ProjectForm = { name: string; email: string; phone: string; location: string; province: string; budget: string; buildType: string; style: string; message: string; referenceImages: string[]; privacyAccepted: boolean; referralConsent: boolean };

const initialForm: ProjectForm = { name: "", email: "", phone: "", location: "", province: "", budget: "", buildType: "Vivienda familiar", style: "Contemporánea", message: "", referenceImages: [], privacyAccepted: false, referralConsent: false };

function ParcelMap({ coordinates, onChange, onError }: { coordinates: Coordinates; onChange: (value: NonNullable<Coordinates>) => void; onError: (message: string) => void }) {
  const marker = useRef<google.maps.Marker | null>(null);
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { onError("Tu navegador no permite usar la ubicación actual. Marca un punto en el mapa."); return; }
    navigator.geolocation.getCurrentPosition(({ coords }) => onChange({ lat: coords.latitude, lng: coords.longitude }), () => onError("No se pudo obtener tu ubicación. Marca la parcela manualmente en el mapa."), { enableHighAccuracy: true, timeout: 10_000 });
  };
  return <div className="journey-map-wrap"><MapView className="journey-map" initialCenter={{ lat: 40.4168, lng: -3.7038 }} initialZoom={5} onMapReady={(map) => {
    map.setMapTypeId("terrain");
    const positionMarker = (position: google.maps.LatLngLiteral) => {
      if (!marker.current) marker.current = new google.maps.Marker({ map, position, title: "Parcela seleccionada" });
      else marker.current.setPosition(position);
    };
    if (coordinates) positionMarker(coordinates);
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      positionMarker(position);
      onChange(position);
    });
  }} /><div className="journey-map-caption"><MapPin size={15} />{coordinates ? <span>Parcela marcada · {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</span> : <span>Pulsa en el mapa para marcar la parcela exacta</span>}<button type="button" onClick={useCurrentLocation}><LocateFixed size={13} />Usar mi ubicación</button></div></div>;
}

export default function BuildJourney({ externalContentAllowed, onRequestExternalConsent }: { externalContentAllowed: boolean; onRequestExternalConsent: () => void }) {
  const leadMutation = trpc.properties.createLead.useMutation();
  const uploadMutation = trpc.construction.uploadReference.useMutation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const updateForm = <K extends keyof ProjectForm>(field: K, value: ProjectForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const uploadReferences = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError("");
    if (!files.length) return;
    if (form.referenceImages.length + files.length > 5) { setError("Puedes adjuntar como máximo cinco imágenes."); return; }
    if (files.some((file) => !isReferenceMimeType(file.type) || file.size > 8_000_000)) { setError("Usa JPG, PNG, WebP, AVIF, HEIC, HEIF o PDF de hasta 8 MB."); return; }
    try {
      const uploads = await Promise.all(files.map(async (file) => {
        const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("No se pudo leer la imagen.")); reader.readAsDataURL(file); });
        return uploadMutation.mutateAsync({ filename: file.name, mimeType: file.type as ReferenceMimeType, base64 });
      }));
      setForm((current) => ({ ...current, referenceImages: [...current.referenceImages, ...uploads.map((item) => item.url)] }));
    } catch { setError("No se pudo subir una de las imágenes. Inténtalo de nuevo."); }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (step === 1 && !coordinates) { setError("Marca la parcela exacta en el mapa antes de continuar."); return; }
    if (step < 4) { setStep((current) => current + 1); return; }
    try {
      await leadMutation.mutateAsync({ leadType: "construction", propertyId: null, name: form.name, email: form.email, phone: form.phone || null, preferredLocation: form.location, preferredProvince: form.province || null, latitude: coordinates ? String(coordinates.lat) : null, longitude: coordinates ? String(coordinates.lng) : null, budget: form.budget || null, referenceImages: form.referenceImages, attributionCode: "MARTINEZ", privacyAccepted: form.privacyAccepted, referralConsent: form.referralConsent, message: `Proyecto: ${form.buildType}. Estilo: ${form.style}. ${form.message}` });
      setForm(initialForm); setCoordinates(null); setStep(1); setSent(true);
    } catch { setError("No se pudo enviar el proyecto. Inténtalo de nuevo."); }
  };

  const isPdf = (url: string) => url.toLowerCase().includes(".pdf");
  return <section className="build-journey-section" id="contacto" aria-labelledby="journey-title"><div className="journey-intro"><p className="eyebrow eyebrow--dark"><span /> PROYECTO A MEDIDA · 01</p><h2 id="journey-title">Una casa que<br /><em>empieza contigo.</em></h2><p>Cuéntanos lo esencial en cuatro pasos. Elige una parcela, comparte tu idea y revisa todo antes de enviarlo.</p><div className="journey-promise"><span>01</span><p><strong>Un punto exacto.</strong><br />Marca la parcela sobre el mapa.</p></div><div className="journey-promise"><span>02</span><p><strong>Una idea que se ve.</strong><br />Añade fotos de la casa, del lugar o un PDF si quieres.</p></div></div><div className="journey-card"><div className="journey-card-head"><div><p>BRIEF DE PROYECTO</p><span>Construcción a medida</span></div><div className="journey-steps" aria-label={`Paso ${step} de 4`}>{[1, 2, 3, 4].map((number, index) => <span key={number} className={step >= number ? "is-active" : ""}>{`0${number}`}{index < 3 && <i />}</span>)}</div></div><form className="journey-form" onSubmit={submit}>{step === 1 && <div className="journey-step"><div className="journey-step-title"><Compass size={21} /><div><p>PASO 01</p><h3>Marca tu parcela.</h3></div></div><div className="journey-input-grid"><label className="journey-full">Lugar o zona<input required value={form.location} onChange={(event) => updateForm("location", event.target.value)} placeholder="Ej. Costa Brava, Utrecht o una parcela concreta" /></label><label>Provincia / región<input value={form.province} onChange={(event) => updateForm("province", event.target.value)} placeholder="Ej. Girona" /></label><label>Tipo de proyecto<select value={form.buildType} onChange={(event) => updateForm("buildType", event.target.value)}><option>Vivienda familiar</option><option>Casa de vacaciones</option><option>Inversión / alquiler</option><option>Reforma integral</option></select></label></div>{externalContentAllowed ? <ParcelMap coordinates={coordinates} onChange={setCoordinates} onError={setError} /> : <div className="journey-map-permission"><MapPin size={20} /><div><strong>Activa el mapa para marcar la parcela</strong><p>El mapa interactivo es un contenido externo y solo se carga con tu autorización.</p></div><button type="button" onClick={onRequestExternalConsent}>Gestionar cookies</button></div>}</div>}{step === 2 && <div className="journey-step"><div className="journey-step-title"><ImagePlus size={21} /><div><p>PASO 02</p><h3>Define la idea.</h3></div></div><div className="journey-choice-grid">{["Contemporánea", "Mediterránea", "Natural", "Minimalista"].map((style, index) => <button key={style} type="button" className={form.style === style ? "is-selected" : ""} onClick={() => updateForm("style", style)}><span>{`0${index + 1}`}</span>{style}</button>)}</div><label className="journey-textarea">Unas palabras sobre tu idea<textarea value={form.message} onChange={(event) => updateForm("message", event.target.value)} rows={3} placeholder="Luz, habitaciones, jardín, vistas, familia, teletrabajo…" /></label><div className="journey-upload"><div><p>REFERENCIAS DE IDEA O PARCELA <small>Opcional</small></p><span>Hasta 5 archivos · JPG, PNG, WebP, HEIC, AVIF o PDF · 8 MB por archivo</span></div><label className="journey-upload-button"><ImagePlus size={17} />{uploadMutation.isPending ? "Subiendo…" : "Añadir fotos o PDF"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,application/pdf" multiple onChange={uploadReferences} disabled={uploadMutation.isPending} /></label></div>{form.referenceImages.length > 0 && <div className="journey-thumbnails">{form.referenceImages.map((url, index) => <figure key={url} className={isPdf(url) ? "is-document" : ""}>{isPdf(url) ? <a href={url} target="_blank" rel="noreferrer" aria-label={`Abrir PDF de referencia ${index + 1}`}><FileText size={27} /><span>PDF · Referencia {index + 1}</span></a> : <img src={url} alt={`Referencia visual ${index + 1}`} />}<button type="button" onClick={() => updateForm("referenceImages", form.referenceImages.filter((image) => image !== url))} aria-label="Eliminar archivo de referencia"><X size={14} /></button></figure>)}</div>}</div>}{step === 3 && <div className="journey-step"><div className="journey-step-title"><WalletCards size={21} /><div><p>PASO 03</p><h3>¿Cómo te localizamos?</h3></div></div><div className="journey-input-grid"><label>Nombre<input required value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Tu nombre" /></label><label>Correo<input required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="nombre@email.com" /></label><label>Teléfono <small>(opcional)</small><input type="tel" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+31 / +46 / +34 …" /></label><label>Presupuesto orientativo<select value={form.budget} onChange={(event) => updateForm("budget", event.target.value)}><option value="">Prefiero hablarlo</option><option>Hasta 250.000 €</option><option>250.000 – 500.000 €</option><option>500.000 – 1.000.000 €</option><option>Más de 1.000.000 €</option></select></label></div><div className="form-consent-stack"><label><input required type="checkbox" checked={form.privacyAccepted} onChange={(event) => updateForm("privacyAccepted", event.target.checked)} />He leído la <a href="/privacidad" target="_blank" rel="noreferrer">política de privacidad</a> y autorizo el tratamiento de mi solicitud.</label><label><input required type="checkbox" checked={form.referralConsent} onChange={(event) => updateForm("referralConsent", event.target.checked)} />Autorizo a Vivienda Nova a enviar estos datos al equipo o vendedor que pueda atender este proyecto.</label></div></div>}{step === 4 && <div className="journey-step journey-summary"><div className="journey-step-title"><Check size={21} /><div><p>PASO 04</p><h3>Revisa tu proyecto.</h3></div></div><p className="journey-summary-intro">Esto es lo que recibirá el equipo antes de ponerse en contacto contigo.</p><div className="journey-summary-grid"><div><span>PARCELA</span><strong>{form.location}</strong><p>{form.province || "Provincia por concretar"}</p><small>{coordinates ? `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}` : "Sin coordenadas"}</small></div><div><span>PROYECTO</span><strong>{form.buildType}</strong><p>{form.style}</p></div><div><span>CONTACTO</span><strong>{form.name}</strong><p>{form.email}</p></div><div><span>PRESUPUESTO</span><strong>{form.budget || "A definir"}</strong><p>{form.referenceImages.length} archivos de referencia</p></div></div><div className="journey-martinez"><span>M</span><p><strong>Referencia registrada: MARTINEZ</strong><br />La solicitud quedará vinculada a Vivienda Nova antes de enviarse.</p></div></div>}<div className="journey-navigation">{step > 1 ? <button type="button" className="journey-back" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={17} />Atrás</button> : <span />}<button type="submit" className="button button--ink" disabled={leadMutation.isPending || uploadMutation.isPending}>{step < 4 ? <>Continuar <ChevronRight size={17} /></> : <>{leadMutation.isPending ? "Enviando…" : "Confirmar y enviar"}<Send size={17} /></>}</button></div>{error && <p className="form-error">{error}</p>}{sent && <p className="form-success"><Check size={16} />Hemos recibido tu proyecto. Te contactaremos pronto.</p>}</form></div></section>;
}
