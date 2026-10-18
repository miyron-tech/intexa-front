"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { logout } from "@/app/actions/auth";

type Mode = "image" | "video";
type View = "create" | "library";
type Sample = { id: number; name: string; category: string; prompt: string };
type Draft = { prompt: string; mode: Mode; ratio: string; style: string; quantity: number; duration: string };
const samples: Sample[] = [
  { id: 3, name: "Liquid amber", category: "Product photography", prompt: "An amber glass perfume bottle surrounded by a sculptural splash of water. Warm orange background, precise studio lighting, luminous glass, luxury campaign photography." },
  { id: 2, name: "Golden hour muse", category: "Fashion editorial", prompt: "An editorial close-up of a woman wearing translucent amber sunglasses. Warm directional light, natural skin texture, cinematic shadows, a confident expression." },
  { id: 8, name: "A lighter step", category: "Product campaign", prompt: "A sculptural white sneaker floating against a warm orange backdrop. Soft shadows, minimal composition, subtle material textures, premium product campaign." },
  { id: 4, name: "Somewhere else", category: "Architecture", prompt: "Surreal terracotta architecture in a vast desert landscape. Sculptural arches, warm sand, late afternoon sun, atmospheric cinematic photography." },
  { id: 5, name: "Softly electric", category: "Dreamscape", prompt: "A luminous translucent jellyfish suspended in dark water. Glowing amber tendrils, intricate organic textures, cinematic contrast, ethereal atmosphere." },
  { id: 11, name: "A fresh perspective", category: "Still life", prompt: "A peeled orange suspended inside a flowing chrome ribbon. Warm peach background, highly detailed citrus texture, soft studio light, surreal still life." },
];
const media = (id: number, extension = "webp") => `/media/studio/scene-${String(id).padStart(2, "0")}.${extension}`;
const ratios = ["1:1", "4:5", "16:9", "9:16"];
const styles = ["Photoreal", "Editorial", "Cinematic", "3D render", "Illustration"];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    create: <><path d="M12 3v18M3 12h18" /><path d="m5.6 5.6 12.8 12.8M18.4 5.6 5.6 18.4" /></>,
    library: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="3" /><path d="m17 10 4-3v10l-4-3" /></>,
    credits: <><path d="m12 3 8 5v8l-8 5-8-5V8Z" /><path d="m13 7-5 6h4l-1 4 5-6h-4Z" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" /></>,
    download: <><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" /></>,
    expand: <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3v1" /></>,
    exit: <><path d="M10 4H4v16h6m-1-8h12m-5-5 5 5-5 5" /></>,
    save: <><path d="M5 3h12l4 4v14H3V3Zm3 0v6h8V3M7 21v-7h10v7" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.create}</svg>;
}

export function CreativeWorkspace({ userId, email }: { userId: string; email: string }) {
  const [view, setView] = useState<View>("create");
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState(samples[0].prompt);
  const [ratio, setRatio] = useState("4:5");
  const [style, setStyle] = useState("Photoreal");
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState("5");
  const [selected, setSelected] = useState(samples[0]);
  const [reference, setReference] = useState<{ url: string; name: string } | null>(null);
  const [notice, setNotice] = useState("");
  const [saved, setSaved] = useState<Draft | null>(null);
  const [ready, setReady] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"examples" | "drafts">("examples");
  const [filter, setFilter] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [modal, setModal] = useState<"credits" | "preview" | "help" | "account" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const referenceUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const storageKey = `aigenerate:draft:${userId}`;
  const estimate = mode === "image" ? quantity * 4 : Number(duration) * 4;

  useEffect(() => {
    // Restore browser-only drafts after hydration without blocking the first paint.
    const hydrationFrame = requestAnimationFrame(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.prompt === "string" && data.prompt.length <= 2000 && ["image", "video"].includes(data.mode) && ratios.includes(data.ratio) && styles.includes(data.style) && [1, 2, 4].includes(data.quantity)) {
          setSaved(data); setPrompt(data.prompt); setMode(data.mode); setRatio(data.ratio); setStyle(data.style); setQuantity(data.quantity); setDuration(["5", "10"].includes(data.duration) ? data.duration : "5");
        }
      }
    } catch { /* An unavailable draft never blocks the editor. */ }
    setReady(true);
    });
    return () => { cancelAnimationFrame(hydrationFrame); if (referenceUrl.current) URL.revokeObjectURL(referenceUrl.current); };
  }, [storageKey]);

  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    if (!modal && dialog.current?.open) dialog.current?.close();
  }, [modal]);

  const loadSample = (sample: Sample) => { setSelected(sample); setPrompt(sample.prompt); setView("create"); setNotice("Example prompt loaded. The preview shows the original sample."); };
  const saveDraft = () => {
    const draft = { prompt, mode, ratio, style, quantity, duration };
    try { localStorage.setItem(storageKey, JSON.stringify(draft)); setSaved(draft); setNotice("Draft saved to this browser. Your reference image stays private and is not saved."); }
    catch { setNotice("Your browser could not save this draft. Copy your prompt to keep it."); }
  };
  const uploadReference = (file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setUploadError("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError("Choose an image smaller than 10 MB."); return; }
    if (referenceUrl.current) URL.revokeObjectURL(referenceUrl.current);
    const url = URL.createObjectURL(file); referenceUrl.current = url;
    setReference({ url, name: file.name }); setUploadError("");
  };
  const removeReference = () => { if (referenceUrl.current) URL.revokeObjectURL(referenceUrl.current); referenceUrl.current = null; setReference(null); if (fileInput.current) fileInput.current.value = ""; };
  const copyPrompt = async () => { try { await navigator.clipboard.writeText(prompt); setNotice("Prompt copied to clipboard."); } catch { setNotice("Clipboard access is unavailable. Select and copy the prompt from the editor."); } };

  return <div className="workspace">
    <aside className="ws-sidebar">
      <Link href="/" className="studio-wordmark ws-logo" aria-label="intexa-ai.com home">intexa-ai<span className="brand-domain">.com</span></Link>
      <div className="ws-space"><span className="ws-space-icon">P</span><div>Personal workspace<small>Just you. Endless possibilities.</small></div><span className="ws-space-arrow">⌄</span></div>
      <span className="ws-nav-label">WORKSPACE</span>
      <nav className="ws-navigation" aria-label="Workspace navigation">
        <button className={view === "create" ? "active" : ""} onClick={() => setView("create")} aria-current={view === "create" ? "page" : undefined}><Icon name="create" />Create<span className="ws-nav-plus">+</span></button>
        <button className={view === "library" ? "active" : ""} onClick={() => setView("library")} aria-current={view === "library" ? "page" : undefined}><Icon name="library" />My library<span className="ws-nav-count">{saved ? 1 : 0}</span></button>
        <button onClick={() => setModal("credits")}><Icon name="credits" />Credits & plan</button>
      </nav>
      <div className="ws-sidebar-note"><span>✳</span><p>A little curiosity.<br />A whole new world.</p></div>
      <div className="ws-credit-card"><div><span>YOUR CREDITS</span><Icon name="credits" size={16} /></div><strong>0 <span>available</span></strong><div className="ws-credit-track" /><p>Credits will be activated at launch.</p><button onClick={() => setModal("credits")}>Explore plans <Icon name="arrow" size={15} /></button></div>
      <button className="ws-help" onClick={() => setModal("help")}><Icon name="help" size={17} />A little guidance<span>↗</span></button>
      <div className="ws-user"><span className="ws-avatar">{email[0]?.toUpperCase()}</span><div><strong>My account</strong><span title={email}>{email}</span></div><form action={logout}><button aria-label="Sign out" title="Sign out"><Icon name="exit" size={17} /></button></form></div>
    </aside>

    <div className="ws-main">
      <header className="ws-topbar"><div><span className="ws-breadcrumb">Workspace</span><span className="ws-breadcrumb-slash">/</span><strong>{view === "create" ? "Create" : "My library"}</strong></div><div className="ws-topbar-right"><span className="ws-preview-badge"><i />Studio preview</span><button className="ws-balance" onClick={() => setModal("credits")}><Icon name="credits" size={16} /><strong>0</strong><span>credits</span><span>+</span></button><button className="ws-top-avatar" onClick={() => setModal("account")} aria-label="Open account menu">{email[0]?.toUpperCase()}</button></div></header>
      <div className="ws-mobile-nav"><button aria-pressed={view === "create"} onClick={() => setView("create")}><Icon name="create" size={16} />Create</button><button aria-pressed={view === "library"} onClick={() => setView("library")}><Icon name="library" size={16} />Library</button><button onClick={() => setModal("help")}><Icon name="help" size={16} />Help</button><Link href="/" aria-label="Back to homepage">↗</Link></div>

      {view === "create" ? <div className="ws-create-view">
        <div className="ws-page-heading"><div><span className="ws-eyebrow">A SPACE FOR YOUR NEXT BIG IDEA</span><h1>What will you make <em>possible?</em></h1></div><button className="ws-secondary ws-save" onClick={saveDraft} disabled={!ready || !prompt.trim()}><Icon name="save" size={16} />Save draft</button></div>
        <div className="ws-editor-grid">
          <section className="ws-canvas-panel" aria-label="Creative preview">
            <div className="ws-canvas-toolbar"><div><span className="ws-canvas-dot" />Live canvas<span className="ws-sample-label">SAMPLE PREVIEW</span></div><div className="ws-canvas-tools"><span>{ratio}</span><button onClick={() => setModal("preview")} aria-label="Expand preview" title="Expand preview"><Icon name="expand" size={16} /></button></div></div>
            <div className="ws-canvas-stage" style={{ "--preview-ratio": ratio.replace(":", " / ") } as CSSProperties}>
              <div className={`ws-artwork ${ratio === "16:9" ? "landscape" : ""} ${ratio === "9:16" ? "portrait" : ""}`}>
                {mode === "image" ? <Image src={media(selected.id)} alt={selected.prompt} fill priority sizes="(max-width: 700px) 90vw, 45vw" /> : <video key={selected.id} src={media(selected.id, "mp4")} poster={media(selected.id)} controls playsInline loop muted preload="metadata" />}
                <span className="ws-artwork-label">{mode === "image" ? "AI IMAGE EXAMPLE" : "ANIMATED STILL EXAMPLE"}</span>
              </div>
              <div className="ws-canvas-caption"><span>{selected.name}</span><span>{selected.category} <i>·</i> {mode === "image" ? "Image" : "Motion study"}</span></div>
            </div>
            <div className="ws-preview-footer"><span><Icon name="image" size={15} />Curated example · not a generated result</span><a href={media(selected.id, mode === "image" ? "webp" : "mp4")} download={`intexa-ai-sample-${selected.id}.${mode === "image" ? "webp" : "mp4"}`}><Icon name="download" size={16} /><span>Download sample</span></a></div>
          </section>

          <section className="ws-prompt-panel" aria-label="Prompt and generation settings">
            <div className="ws-mode-toggle" role="group" aria-label="Content type"><button aria-pressed={mode === "image"} onClick={() => setMode("image")}><Icon name="image" size={17} />Image</button><button aria-pressed={mode === "video"} onClick={() => setMode("video")}><Icon name="video" size={17} />Video</button></div>
            <div className="ws-prompt-label"><label htmlFor="creative-prompt">Your imagination, in words</label><button onClick={copyPrompt} disabled={!prompt.trim()} aria-label="Copy prompt" title="Copy prompt"><Icon name="copy" size={15} /></button></div>
            <div className="ws-prompt-input"><textarea id="creative-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={2000} placeholder="A world that doesn’t exist yet. Describe it…" spellCheck /><div><button onClick={() => { const addition = ` ${style} style, intentional composition, carefully balanced lighting, refined material details.`; setPrompt(previous => (previous.trim() + addition).slice(0, 2000)); setNotice("Style details added to your prompt. Edit them to make it your own."); }} disabled={!prompt.trim() || prompt.length > 1850}><Icon name="create" size={13} />Add style details</button><span>{prompt.length}/2000</span></div></div>
            <div className="ws-reference-heading"><label htmlFor="reference-image">Reference image <span>optional</span></label>{reference && <button onClick={removeReference}>Remove</button>}</div>
            <input ref={fileInput} id="reference-image" className="ws-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => uploadReference(event.target.files?.[0])} />
            <button className={`ws-upload ${reference ? "has-reference" : ""}`} onClick={() => fileInput.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); uploadReference(event.dataTransfer.files[0]); }}>
              {reference ? <><Image src={reference.url} alt="Your reference image" width={42} height={42} unoptimized onError={() => { removeReference(); setUploadError("This image could not be opened. Please choose another file."); }} /><span><strong>{reference.name}</strong><small>Only in this browser · click to replace</small></span><Icon name="check" size={16} /></> : <><Icon name="upload" size={18} /><span>Drop an image, or <strong>browse</strong><small>JPG, PNG, WebP · up to 10 MB</small></span><span className="ws-upload-plus">+</span></>}
            </button>
            {uploadError && <p className="ws-error" role="alert">{uploadError}</p>}
            <div className="ws-settings-row"><label htmlFor="creative-style">Visual style</label><select id="creative-style" value={style} onChange={event => setStyle(event.target.value)}>{styles.map(item => <option key={item}>{item}</option>)}</select></div>
            <fieldset className="ws-ratios"><legend>Aspect ratio</legend><div>{ratios.map(item => <button type="button" key={item} aria-pressed={ratio === item} onClick={() => setRatio(item)}><span style={{ aspectRatio: item.replace(":", "/"), width: item === "9:16" ? 9 : 15 }} />{item}</button>)}</div></fieldset>
            <div className="ws-settings-row ws-output-settings">{mode === "image" ? <><span id="quantity-label">Number of images</span><div className="ws-quantity" role="group" aria-labelledby="quantity-label">{[1, 2, 4].map(count => <button key={count} aria-pressed={quantity === count} onClick={() => setQuantity(count)}>{count}</button>)}</div></> : <><label htmlFor="video-duration">Video duration</label><select id="video-duration" value={duration} onChange={event => setDuration(event.target.value)}><option value="5">5 seconds</option><option value="10">10 seconds</option></select></>}</div>
            <div className="ws-generate-area"><div><span>Estimated cost</span><strong><Icon name="credits" size={13} />{estimate} credits <span>· preview rate</span></strong></div><button className="ws-generate" disabled={!prompt.trim()} onClick={() => setNotice("Generation is not connected yet. Your prompt is ready—save a draft to keep it. No credits have been charged.")}><Icon name="create" size={18} /><span>Generate {mode === "image" ? (quantity > 1 ? "images" : "image") : "video"}</span><Icon name="arrow" size={18} /></button><p><span />Generation coming soon. No credits charged.</p></div>
          </section>
        </div>
        <section className="ws-inspiration"><div className="ws-section-title"><div><h2>A starting point for your imagination</h2><p>Pick a direction. Make it your own.</p></div><button onClick={() => { setView("library"); setLibraryTab("examples"); }}>Explore examples <Icon name="arrow" size={15} /></button></div><div className="ws-example-strip">{samples.map(sample => <button key={sample.id} className={`ws-example ${selected.id === sample.id ? "selected" : ""}`} onClick={() => loadSample(sample)} aria-label={`Use ${sample.name} example`} aria-pressed={selected.id === sample.id}><div><Image src={media(sample.id)} alt={sample.category} fill sizes="(max-width: 700px) 35vw, 12vw" />{selected.id === sample.id && <span><Icon name="check" size={12} /></span>}</div><strong>{sample.name}</strong><small>{sample.category}</small></button>)}</div></section>
      </div> : <div className="ws-library-view"><div className="ws-page-heading"><div><span className="ws-eyebrow">YOUR IDEAS, ALL IN ONE PLACE</span><h1>A little collection of <em>possibilities.</em></h1></div><button className="ws-secondary" onClick={() => setView("create")}><Icon name="create" size={16} />Back to create</button></div><div className="ws-library-controls"><div role="group" aria-label="Library content"><button aria-pressed={libraryTab === "examples"} onClick={() => setLibraryTab("examples")}>Example gallery <span>{samples.length}</span></button><button aria-pressed={libraryTab === "drafts"} onClick={() => setLibraryTab("drafts")}>My drafts <span>{saved ? 1 : 0}</span></button></div>{libraryTab === "examples" && <input aria-label="Search examples" placeholder="Search examples…" value={filter} onChange={event => setFilter(event.target.value)} />}</div>{libraryTab === "examples" ? <><p className="ws-library-description">Curated examples to explore. Your generated work will appear here when generation launches.</p><div className="ws-library-grid">{samples.filter(sample => `${sample.name} ${sample.category}`.toLowerCase().includes(filter.toLowerCase())).map(sample => <button key={sample.id} onClick={() => loadSample(sample)}><div><Image src={media(sample.id)} alt={sample.prompt} fill sizes="(max-width: 700px) 45vw, 25vw" /><span>Use prompt ↗</span></div><h2>{sample.name}</h2><p>{sample.category}</p></button>)}</div>{!samples.some(sample => `${sample.name} ${sample.category}`.toLowerCase().includes(filter.toLowerCase())) && <div className="ws-empty"><Icon name="image" size={32} /><h2>No examples found</h2><p>Try a different search, such as product or fashion.</p><button className="ws-secondary" onClick={() => setFilter("")}>Clear search</button></div>}</> : saved ? <article className="ws-draft-card"><Icon name="save" size={25} /><span>SAVED ON THIS DEVICE</span><h2>Your next idea</h2><p>{saved.prompt}</p><div>{saved.mode} · {saved.ratio} · {saved.style}</div><button className="ws-secondary" onClick={() => { setPrompt(saved.prompt); setMode(saved.mode); setRatio(saved.ratio); setStyle(saved.style); setQuantity(saved.quantity); setDuration(saved.duration || "5"); setView("create"); }}>Continue editing <Icon name="arrow" size={16} /></button></article> : <div className="ws-empty"><Icon name="library" size={32} /><h2>Your next idea belongs here.</h2><p>Save a prompt from the editor to start your collection.</p><button className="ws-secondary" onClick={() => setView("create")}>Create your first draft <Icon name="arrow" size={16} /></button></div>}</div>}
      <footer className="ws-footer"><span>HUMAN IMAGINATION. NEW POSSIBILITIES.</span><span>Workspace preview <i>·</i> Made for you</span></footer>
    </div>
    {notice && <div className="ws-toast" role="status"><Icon name="help" size={18} /><p>{notice}</p><button onClick={() => setNotice("")} aria-label="Dismiss notification"><Icon name="close" size={16} /></button></div>}
    <dialog ref={dialog} className={`ws-dialog ${modal === "preview" ? "ws-full-preview" : ""}`} onCancel={() => setModal(null)} onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setModal(null); } }} aria-labelledby="workspace-dialog-title"><button className="ws-dialog-close" onClick={() => setModal(null)} aria-label="Close dialog"><Icon name="close" /></button>
      {modal === "account" && <><span className="ws-dialog-symbol">{email[0]?.toUpperCase()}</span><span className="ws-eyebrow">YOUR PERSONAL SPACE</span><h2 id="workspace-dialog-title">Your account.</h2><p className="ws-account-email">{email}</p><div className="ws-dialog-info"><strong>Personal workspace</strong><p>Your saved prompt is stored on this device. Reference images are never uploaded by this preview.</p></div><form action={logout}><button className="ws-dialog-cta" type="submit">Sign out <Icon name="exit" size={18} /></button></form></>}
      {modal === "credits" && <><span className="ws-dialog-symbol"><Icon name="credits" size={26} /></span><span className="ws-eyebrow">ROOM FOR YOUR IMAGINATION</span><h2 id="workspace-dialog-title">Your creative balance.</h2><div className="ws-dialog-balance">0 <span>credits available</span></div><p>Your credit balance is not active yet. Plans, top-ups, and credit history will become available when generation launches.</p><div className="ws-dialog-info"><strong>No charges. No surprises.</strong><p>The editor displays preview estimates only. Trying the interface will never deduct credits.</p></div><Link href="/#pricing" className="ws-dialog-cta">Explore preview plans <Icon name="arrow" size={18} /></Link></>}
      {modal === "help" && <><span className="ws-dialog-symbol"><Icon name="create" size={26} /></span><span className="ws-eyebrow">A LITTLE DIRECTION</span><h2 id="workspace-dialog-title">Start with a spark.</h2><ol className="ws-help-steps"><li><strong>Describe your idea</strong><p>Start with a subject, then add a setting, lighting, and mood.</p></li><li><strong>Shape the direction</strong><p>Choose a visual style and aspect ratio. Add a reference image from your device.</p></li><li><strong>Keep your next big idea</strong><p>Save your draft in this browser. Sample images help you explore the interface; live generation is coming soon.</p></li></ol><button className="ws-dialog-cta" onClick={() => setModal(null)}>Let’s create <Icon name="arrow" size={18} /></button></>}
      {modal === "preview" && <><h2 id="workspace-dialog-title">{selected.name} <span>Sample preview</span></h2><div className="ws-expanded-art">{mode === "image" ? <Image src={media(selected.id)} alt={selected.prompt} fill sizes="80vw" /> : <video src={media(selected.id, "mp4")} controls playsInline loop muted />}</div><p>{selected.prompt}</p></>}
    </dialog>
  </div>;
}
