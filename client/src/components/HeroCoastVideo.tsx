/** Casa & Plano: vídeo aéreo compacto, selector transparente de costa y pausa según visibilidad. */
import { ChevronDown, Pause, Play, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./HeroCoastVideo.css";

export type CoastVideo = { label: string; url: string };

type HeroCoastVideoProps = {
  videos: CoastVideo[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onFilter: (label: string) => void;
};

export default function HeroCoastVideo({ videos, selectedIndex, onSelect, onFilter }: HeroCoastVideoProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const activeVideo = videos[selectedIndex];

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { video.play().then(() => setPaused(false)).catch(() => setPaused(true)); }
      else { video.pause(); setPaused(true); }
    }, { threshold: 0.25 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [activeVideo?.url]);

  const chooseCoast = (index: number) => {
    onSelect(index);
    onFilter(videos[index].label);
    setOpen(false);
    window.setTimeout(() => document.getElementById("viviendas")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    else { video.pause(); setPaused(true); }
  };

  return <div className="hero-coast-video" ref={frameRef}>
    {activeVideo ? <video ref={videoRef} src={activeVideo.url} autoPlay muted loop playsInline preload="metadata" poster="/manus-storage/vivienda-nova-card-loft_e25a829a.jpg" /> : <div className="hero-coast-video__fallback"><span>VÍDEO AÉREO / PORTADA</span><strong>Costa Blanca · Costa Cálida · Costa del Sol</strong><p>Carga un clip desde Administración</p></div>}
    <div className="hero-coast-video__shade" />
    <div className="hero-coast-video__controls">
      <div className="coast-picker"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span>Ver costa</span><strong>{activeVideo?.label ?? "Seleccionar"}</strong><ChevronDown size={14} /></button>{open && <div className="coast-picker__menu">{videos.length ? videos.map((video, index) => <button type="button" key={`${video.label}-${index}`} className={index === selectedIndex ? "is-active" : ""} onClick={() => chooseCoast(index)}>{video.label}</button>) : <span>Configura los clips en Administración</span>}</div>}</div>
      {activeVideo && <button type="button" className="play-toggle" onClick={togglePlayback} aria-label={paused ? "Reproducir vídeo" : "Pausar vídeo"}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
    </div>
    <button type="button" className="hero-coast-video__filter" onClick={() => onFilter(activeVideo?.label ?? "")}><Search size={13} /> Ver propiedades de esta costa</button>
    <div className="hero-coast-video__caption"><span>{activeVideo?.label ?? "Selección de costa"}</span><i>NV / AÉREO</i></div>
  </div>;
}
