"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const moods = [
  { name: "Amber", hue: "0deg", color: "#f0a452", number: "01", caption: "Glass petals. Chrome stems. A different kind of nature." },
  { name: "Lilac", hue: "240deg", color: "#b79bd5", number: "02", caption: "Same idea. A new feeling. Follow your curiosity." },
  { name: "Sage", hue: "55deg", color: "#c1cf88", number: "03", caption: "Unexpected by nature. Made from imagination." },
];

export function LoginArtwork() {
  const [mood, setMood] = useState(0);
  const selected = moods[mood];
  return (
    <aside className="login-gallery" aria-label="Imagination study: Glass bloom">
      <div className="login-gallery-image" style={{ "--art-hue": selected.hue } as CSSProperties}><Image src="/media/auth/glass-bloom.webp" alt={`An impossible flower with ${selected.name.toLowerCase()} glass petals and polished chrome stems on a stone plinth`} fill priority sizes="(max-width: 760px) 100vw, 56vw" /></div>
      <div className="login-gallery-shade" />
      <div className="login-gallery-top"><span><i aria-hidden="true">✳</i> THE IMAGINATION COLLECTION</span><span>VOL. 001</span></div>
      <span className="login-gallery-side">A STUDY IN THE UNEXPECTED — CREATED WITH AI</span>
      <div className="login-art-label"><span className="login-art-cross" aria-hidden="true">+</span><span>GLASS BLOOM<small>Botanical impossibilities, 2026</small></span></div>
      <div className="login-gallery-bottom"><span className="login-gallery-kicker">REALITY IS JUST A STARTING POINT.</span><h2>Make room<br />for the <em>unreal.</em></h2><div className="login-gallery-rule" /><div className="login-art-controls"><div className="login-art-caption"><span>{selected.number} / 03</span><p>{selected.caption}</p></div><div className="login-moods" role="group" aria-label="Artwork palette">{moods.map((item, index) => <button key={item.name} type="button" aria-label={`${item.name} palette`} aria-pressed={index === mood} title={item.name} onClick={() => setMood(index)} style={{ "--swatch": item.color } as CSSProperties}><span /></button>)}</div></div></div>
    </aside>
  );
}
