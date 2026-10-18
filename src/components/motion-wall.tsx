"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motionPalettes } from "@/lib/motion-palettes";

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function MotionWall({ paused, setPaused }: { paused: boolean; setPaused: (paused: boolean) => void }) {
  const [turn, setTurn] = useState(0);
  const [faces, setFaces] = useState([0, 1]);
  const [visible, setVisible] = useState(true);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const reduced = useReducedMotion();
  const stopped = paused || (reduced && !explicitPlay);
  const wall = useRef<HTMLDivElement>(null);
  const currentTurn = useRef(0);
  const lastFlip = useRef(0);

  const flip = useCallback((palette?: number) => {
    if (Date.now() - lastFlip.current < 1700) return;
    lastFlip.current = Date.now();
    const nextTurn = ++currentTurn.current;
    setFaces(previous => {
      const next = [...previous];
      next[nextTurn % 2] = palette ?? (previous[(nextTurn - 1) % 2] + 1) % motionPalettes.length;
      return next;
    });
    setTurn(nextTurn);
  }, []);

  useEffect(() => {
    let intersecting = true;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); }, { threshold: 0.05 });
    if (wall.current) observer.observe(wall.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    if (stopped || !visible) return;
    const timer = setTimeout(() => flip(), 15000);
    return () => clearTimeout(timer);
  }, [stopped, visible, turn, flip]);

  useEffect(() => {
    wall.current?.querySelectorAll("video").forEach(video => {
      if (stopped || !visible || Number(video.dataset.face) !== turn % 2) video.pause();
      else void video.play().catch(() => { /* Keep the matching poster if autoplay is unavailable. */ });
    });
  }, [stopped, visible, turn, faces]);

  const selected = faces[turn % 2];
  return <>
    <div ref={wall} className="motion-wall" aria-hidden="true" data-palette={motionPalettes[selected].name}>
      {Array.from({ length: 15 }, (_, index) => <div className="motion-tile" key={index}>
        <div className="tile-rotator" style={{ transform: `rotateY(${turn * 180}deg)`, "--delay": `${(index % 5 + Math.floor(index / 5)) * 75}ms` } as CSSProperties}>
          {faces.map((palette, face) => {
            const clip = motionPalettes[palette].clips[index];
            return <div key={face} className={`tile-face ${face ? "tile-back" : ""}`}>
              <video key={clip.id} data-face={face} data-clip-id={clip.id} src={clip.src} poster={clip.poster} width={432} height={384} muted loop playsInline preload="none" disablePictureInPicture />
            </div>;
          })}
        </div>
      </div>)}
    </div>
    <div className="hero-bottom">
      <div className="hero-caption"><span className="live-dot" />CURATED MOTION REFERENCES</div>
      <div className="palette-controls">
        <span className="palette-label">Palette / {motionPalettes[selected].name}</span>
        <div className="palette-swatches">{motionPalettes.map((palette, index) => <button key={palette.name} className={selected === index ? "selected" : ""} aria-label={`Palette ${palette.name}`} aria-pressed={selected === index} onClick={() => { if (selected !== index) flip(index); }} style={{ background: palette.color }} />)}</div>
        <button className="pause-button" onClick={() => { if (stopped) { setExplicitPlay(true); setPaused(false); } else setPaused(true); }} aria-label={stopped ? "Play animation" : "Pause animation"} aria-pressed={stopped}>{stopped ? "▷" : "Ⅱ"}</button>
      </div>
    </div>
  </>;
}

export function MotionFeature() {
  const clip = motionPalettes[1].clips[0];
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const reduced = useReducedMotion();
  const stopped = paused || (reduced && !explicitPlay);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let inView = false;
    const update = () => {
      if (!inView || document.hidden || stopped) element.pause();
      else void element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); element.pause(); };
  }, [stopped]);

  return <div className="feature-card feature-video">
    <video ref={video} src={clip.src} poster={clip.poster} width={432} height={384} muted loop playsInline preload="none" aria-label="Cherries splashing through water, a curated motion reference" />
    <div className="feature-top"><span className="glass-tag">IDEA → MOTION</span><button className="round-arrow" onClick={() => { if (stopped) { setExplicitPlay(true); setPaused(false); } else setPaused(true); }} aria-label={stopped ? "Play video showcase" : "Pause video showcase"}>{stopped ? "▷" : "Ⅱ"}</button></div>
    <div className="feature-caption"><span>02 — VIDEO REFERENCES</span><h3>Ideas were made<br />to move.</h3><p>Stories worth staying for.</p></div>
  </div>;
}
