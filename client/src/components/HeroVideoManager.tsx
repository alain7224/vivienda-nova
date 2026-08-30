/** Casa & Plano: cargador privado de clips aéreos para la ventana de vídeo de la portada. */
import { ChangeEvent, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUp, Film, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import "./HeroVideoManager.css";

type HeroVideo = { label: string; url: string };
type Settings = { bannerText: string; bannerBackground: string; bannerColor: string; bannerHeight: number; bannerRotationSeconds: number; cardStyle: "flat" | "three_d"; enabledLocales: string; heroVideos?: string | null };
const zones = ["Costa Blanca Norte", "Costa Blanca Sur", "Costa Cálida", "Costa del Sol", "Torrevieja", "Playa de Mil Palmeras"];
const parse = (source?: string | null): HeroVideo[] => { try { const data = JSON.parse(source || "[]"); return Array.isArray(data) ? data.filter((item): item is HeroVideo => Boolean(item?.url && item?.label)).slice(0, 6) : []; } catch { return []; } };

export default function HeroVideoManager() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const settingsQuery = trpc.admin.settings.useQuery(undefined, { enabled: user?.role === "admin" });
  const upload = trpc.admin.uploadHeroVideo.useMutation();
  const save = trpc.admin.updateSettings.useMutation();
  const [zone, setZone] = useState(zones[0]);
  const videos = useMemo(() => parse(settingsQuery.data?.heroVideos), [settingsQuery.data?.heroVideos]);

  if (user?.role !== "admin") return null;
  const persist = async (next: HeroVideo[]) => {
    const current = settingsQuery.data as Settings | undefined;
    if (!current) { toast.error("No se pudieron cargar los ajustes de portada."); return; }
    await save.mutateAsync({ bannerText: current.bannerText, bannerBackground: current.bannerBackground, bannerColor: current.bannerColor, bannerHeight: current.bannerHeight, bannerRotationSeconds: current.bannerRotationSeconds, cardStyle: current.cardStyle, enabledLocales: current.enabledLocales, heroVideos: JSON.stringify(next) });
    await Promise.all([utils.admin.settings.invalidate(), utils.settings.public.invalidate()]);
  };
  const uploadVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 45_000_000) { toast.error("Usa un vídeo MP4 o WebM de máximo 45 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => upload.mutate({ filename: file.name, mimeType: file.type as "video/mp4" | "video/webm", base64: String(reader.result) }, { onSuccess: async (result) => { try { await persist([...videos, { label: zone, url: result.url }]); toast.success("Vídeo añadido a la portada"); } catch { toast.error("El vídeo se subió, pero no se pudo guardar en la portada."); } }, onError: () => toast.error("No se pudo cargar el vídeo.") });
    reader.readAsDataURL(file);
  };
  const move = async (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= videos.length) return; const next = [...videos]; [next[index], next[target]] = [next[target], next[index]]; await persist(next); };
  const remove = async (index: number) => { await persist(videos.filter((_, itemIndex) => itemIndex !== index)); toast.success("Vídeo retirado de la portada"); };

  return <section className="hero-video-manager" aria-labelledby="hero-video-manager-title"><div className="hero-video-manager__heading"><div><p className="admin-kicker"><span /> Portada editorial</p><h2 id="hero-video-manager-title">Vídeos <em>aéreos.</em></h2><p>Se muestran solo dentro del bloque bajo el titular de la portada. El primero es el vídeo principal.</p></div><div className="hero-video-manager__upload"><label>Zona<select value={zone} onChange={(event) => setZone(event.target.value)}>{zones.map((item) => <option key={item}>{item}</option>)}</select></label><label className="hero-video-manager__file"><Upload size={16} />{upload.isPending ? "Subiendo…" : "Cargar vídeo"}<input type="file" accept="video/mp4,video/webm" onChange={uploadVideo} disabled={upload.isPending} /></label></div></div><p className="hero-video-manager__note"><Film size={15} /> MP4 o WebM, máximo 45 MB. Para conservar la velocidad de carga, usa clips aéreos breves, sin audio y optimizados.</p>{settingsQuery.isLoading ? <p className="hero-video-manager__empty"><Loader2 className="spin" size={18} /> Cargando configuración…</p> : videos.length ? <ol className="hero-video-manager__list">{videos.map((video, index) => <li key={video.url}><video src={video.url} muted playsInline preload="metadata" /><div><strong>{index === 0 ? "Principal · " : ""}{video.label}</strong><span>Posición {index + 1}</span></div><div className="hero-video-manager__actions"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir vídeo"><ArrowUp size={15} /></button><button type="button" onClick={() => move(index, 1)} disabled={index === videos.length - 1} aria-label="Bajar vídeo"><ArrowDown size={15} /></button><button type="button" className="is-delete" onClick={() => remove(index)} aria-label="Quitar vídeo"><Trash2 size={15} /></button></div></li>)}</ol> : <p className="hero-video-manager__empty"><Film size={18} /> Aún no hay vídeo. Carga un clip aéreo con derechos de uso para activar esta ventana.</p>}</section>;
}
