"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { ArrowLeft, ArrowUpRight, Pause, Play, Music2, Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4";
const groups = [
  { title: "Discover", links: [["Image & video", "/#possibilities"], ["Made for your work", "/#use-cases"], ["How it works", "/#how-it-works"]] },
  { title: "Your studio", links: [["Workspace", "/dashboard"], ["Explore plans", "/#pricing"], ["Create an account", "/register"]] },
  { title: "Find your way", links: [["Back to home", "/"], ["Sign in", "/login"], ["Common questions", "/#faq"]] },
];
const socials = [
  { icon: Music2, name: "TikTok", href: "https://www.tiktok.com/" },
  { icon: Facebook, name: "Facebook", href: "https://www.facebook.com/" },
  { icon: Twitter, name: "Twitter", href: "https://x.com/" },
  { icon: Youtube, name: "YouTube", href: "https://www.youtube.com/" },
  { icon: Instagram, name: "Instagram", href: "https://www.instagram.com/" },
];

export function NotFoundExperience() {
  const video = useRef<HTMLVideoElement>(null);
  const wantsMotion = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (!wantsMotion.current || document.hidden) video.current?.pause();
      else void video.current?.play().catch(() => {});
    };
    const updatePreference = () => { wantsMotion.current = !preference.matches; sync(); };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", sync);
    return () => { preference.removeEventListener("change", updatePreference); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const toggleVideo = () => {
    wantsMotion.current = !playing;
    if (playing) video.current?.pause();
    else void video.current?.play().catch(() => {});
  };

  return <MotionConfig reducedMotion="user">
    <title>404 — Lost in imagination · intexa-ai.com</title>
    <div className="not-found-experience relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white">
      <video data-playing={playing} ref={video} className="fixed inset-0 w-full h-full object-cover z-[0]" src={videoSrc} poster="/media/not-found/poster.webp" autoPlay loop muted playsInline aria-hidden="true" onPlay={() => { if (!wantsMotion.current) video.current?.pause(); else setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />
      <div className="lost-shade fixed inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl w-full flex flex-1 flex-col px-5 md:px-10 pb-6 md:pb-10">
        <nav className="lost-nav" aria-label="Recovery navigation">
          <Link href="/" className="studio-wordmark lost-wordmark" aria-label="intexa-ai.com home">intexa-ai<span className="brand-domain">.com</span></Link>
          <span className="lost-coordinate">BEYOND THE EXPECTED / 404</span>
          <Link href="/dashboard" className="lost-workspace">Your workspace <ArrowUpRight size={16} /></Link>
        </nav>

        <motion.section className="lost-hero" aria-labelledby="lost-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <p className="lost-eyebrow"><span /> A SMALL DETOUR INTO THE UNKNOWN</p>
          <div className="lost-number" aria-hidden="true">404</div>
          <h1 id="lost-title"><span className="sr-only">Page not found. </span>Lost in imagination.</h1>
          <p className="lost-description">This world exists. The page you’re looking for doesn’t.<br className="hidden md:block" /> Let’s take you somewhere you can create your own.</p>
          <div className="lost-actions">
            <Link href="/" className="lost-home"><ArrowLeft size={17} /> Back to reality <span className="lost-home-note">HOME</span></Link>
            <Link href="/dashboard" className="lost-create">Or create something new <ArrowUpRight size={17} /></Link>
          </div>
        </motion.section>

        <div className="lost-scene-bar"><span>ANOTHER WORLD. SAME IMAGINATION.</span>{failed ? <span>STILL FRAME</span> : <button type="button" onClick={toggleVideo} aria-label={playing ? "Pause background video" : "Play background video"}>{playing ? <Pause size={13} /> : <Play size={13} />}<span>{playing ? "PAUSE SCENE" : "PLAY SCENE"}</span></button>}</div>

        <motion.footer initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
            <div className="md:col-span-5"><Link href="/" className="studio-wordmark lost-wordmark mb-5">intexa-ai<span className="brand-domain">.com</span></Link><p className="text-sm leading-relaxed max-w-sm">A space for impossible ideas. Create images, explore motion, and bring your next world to life.</p></div>
            <nav aria-label="Footer" className="md:col-span-7 grid grid-cols-3 gap-4 md:gap-7">{groups.map(group => <div key={group.title}><h2 className="text-sm uppercase tracking-wider text-white font-medium mb-4">{group.title}</h2><ul className="text-xs space-y-2">{group.links.map(([label, href]) => <li key={label}><Link href={href} className="inline-block py-1 hover:text-white transition-colors">{label}</Link></li>)}</ul></div>)}</nav>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <p className="text-[10px] uppercase tracking-widest opacity-50">Curated by @GotInGeorgiG</p>
            <div className="flex items-center gap-4"><span className="text-[10px] uppercase tracking-widest opacity-50">Find inspiration:</span><div className="flex gap-1">{socials.map(({ icon: Icon, name, href }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${name} (opens in a new tab)`} className="p-2 opacity-70 hover:opacity-100 transition-colors hover:text-white"><Icon size={16} /></a>)}</div></div>
          </div>
        </motion.footer>
      </div>
    </div>
  </MotionConfig>;
}
