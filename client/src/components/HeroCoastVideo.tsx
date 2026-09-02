/** Casa & Plano: vídeo aéreo compacto, selector transparente de costa y pausa según visibilidad. */
import { type CSSProperties, useEffect, useRef, useState } from "react";
import "./HeroCoastVideo.css";

export type CoastVideo = { label: string; url: string };

type HeroCoastVideoProps = {
  videos: CoastVideo[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onFilter: (label: string) => void;
  fallbackImageUrl: string;
};

export default function HeroCoastVideo({ videos, selectedIndex, onSelect, onFilter, fallbackImageUrl }: HeroCoastVideoProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const activeVideo = videos[selectedIndex];

  useEffect(() => {
    setVideoError(false);
  }, [activeVideo?.url]);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { video.play().catch(() => undefined); }
      else { video.pause(); }
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

  return <div className="hero-coast-video" ref={frameRef} style={{ "--hero-video-fallback": `url(\"${fallbackImageUrl}\")` } as CSSProperties}>
    {activeVideo && !videoError ? <video ref={videoRef} src={activeVideo.url} autoPlay muted loop playsInline preload="metadata" poster={fallbackImageUrl} onError={() => setVideoError(true)} /> : <div className="hero-coast-video__fallback" style={{ backgroundImage: `url("${fallbackImageUrl}")` }}><span>VÍDEO AÉREO / PORTADA</span><strong>Costa Blanca · Costa Cálida · Costa del Sol</strong><p>{videoError ? "El vídeo no está disponible ahora; mostramos la imagen de portada." : "Carga un clip desde Administración"}</p></div>}
    <div className="hero-coast-video__shade" />
    <div className="hero-coast-video__controls">
      <div className="coast-picker"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span>Ver costa</span><strong>{activeVideo?.label ?? "Seleccionar"}</strong></button>{open && <div className="coast-picker__menu">{videos.length ? videos.map((video, index) => <button type="button" key={`${video.label}-${index}`} className={index === selectedIndex ? "is-active" : ""} onClick={() => chooseCoast(index)}>{video.label}</button>) : <span>Configura los clips en Administración</span>}</div>}</div>
    </div>
  </div>;
}
