'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export interface SwapSettings {enabled:boolean;minSeconds:number;maxSeconds:number;maxVideoBytes:number;maxImageBytes:number;rates:Record<string,number>}
function useFileUrl(file:File|null) {
  const [url,setUrl]=useState('');
  useEffect(()=>{if(!file){setUrl('');return;}const next=URL.createObjectURL(file);setUrl(next);return()=>URL.revokeObjectURL(next);},[file]);
  return url;
}
export function CharacterSwapForm({settings,requestId,creditBalance,initialMode,retry=false}:{settings:SwapSettings;requestId:string;creditBalance:number;initialMode?:string;retry?:boolean}) {
  const router=useRouter();const videoRef=useRef<HTMLVideoElement>(null);
  const [video,setVideo]=useState<File|null>(null),[image,setImage]=useState<File|null>(null);
  const [mode,setMode]=useState(initialMode==='wan-pro'?'wan-pro':'wan-std'),[duration,setDuration]=useState(0),[mediaError,setMediaError]=useState('');
  const [consent,setConsent]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    function paste(event:ClipboardEvent){
      if(pending)return;
      const file=Array.from(event.clipboardData?.items ?? []).find(item=>item.kind==='file' && item.type.startsWith('image/'))?.getAsFile();
      if(!file)return;event.preventDefault();
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError('Only JPEG, PNG and WebP are supported.');return;}
      if(file.size>settings.maxImageBytes){setError('Choose a photo under 5 MB.');return;}
      setImage(file);setError('');
    }
    window.addEventListener('paste',paste);return()=>window.removeEventListener('paste',paste);
  },[pending,settings.maxImageBytes]);
  const videoUrl=useFileUrl(video),imageUrl=useFileUrl(image);
  const credits=Math.ceil(duration)*settings.rates[mode];
  const oversized=Boolean(video && video.size>settings.maxVideoBytes || image && image.size>settings.maxImageBytes);
  const insufficient=credits>creditBalance;
  const ready=settings.enabled && video && image && duration>=2 && duration<=30 && !oversized && !mediaError && consent && !insufficient;
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(!ready || pending || !video || !image)return;
    setPending(true);setError('');
    try {
      const body=new FormData();body.set('requestId',requestId);body.set('mode',mode);body.set('expectedCredits',String(credits));body.set('consent','true');body.set('video',video);body.set('image',image);
      const response=await fetch('/api/character-swap',{method:'POST',body});const data=await response.json();
      if(!response.ok){setError(Array.isArray(data.message)?data.message.join('. '):data.message ?? 'Could not start character replacement.');return;}
      router.push(`/dashboard/jobs/${data.id}`);router.refresh();
    } catch{setError('Could not upload your files. Please try again.');}finally{setPending(false);}
  }
  return <form onSubmit={submit} className="max-w-5xl">
    {retry && <p role="status" className="rounded-xl border border-line bg-surface-2 p-5 mb-6">Your quality setting has been restored. Source files are removed after processing; please select the original video and character photo again.</p>}
    {!settings.enabled && <p role="status" className="rounded-xl border border-line bg-surface-2 p-5 mb-6">Character replacement is being connected. You can preview your files; generation will become available when it is ready. No credits will be deducted.</p>}
    <fieldset disabled={pending} className="grid gap-6 md:grid-cols-2">
      <div className="card p-6"><span className="ws-eyebrow">01 / ORIGINAL PERFORMANCE</span><h2 className="text-xl mt-3 mb-2">Upload your video</h2><p className="hint mb-4">MP4 or MOV · 2–30 seconds · Up to 50 MB · One clearly visible person works best.</p><label className="label" htmlFor="swap-video">Source video</label><input id="swap-video" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" required className="block w-full text-sm mt-2" onChange={event=>{setVideo(event.target.files?.[0] ?? null);setDuration(0);setMediaError('');setError('');}}/>
      {videoUrl && <video ref={videoRef} src={videoUrl} controls preload="metadata" className="mt-5 w-full max-h-80 rounded-lg bg-black" onLoadedMetadata={event=>{const v=event.currentTarget;setDuration(v.duration);if(!Number.isFinite(v.duration)||v.duration<2||v.duration>30||v.videoWidth<200||v.videoHeight<200||v.videoWidth>2048||v.videoHeight>2048||v.videoWidth/v.videoHeight>3||v.videoHeight/v.videoWidth>3)setMediaError('Use a 2–30 second video, 200–2048 pixels per side, with aspect ratio between 1:3 and 3:1.');}} onError={()=>setMediaError('This video could not be read. Try another MP4 or MOV file.')}/>}
      {duration>0 && Number.isFinite(duration) && <p className="hint mt-3">{new Intl.NumberFormat('en-US',{maximumFractionDigits:3}).format(duration)} seconds · Billed as {Math.ceil(duration)} seconds</p>}</div>
      <div className="card p-6"><span className="ws-eyebrow">02 / NEW CHARACTER</span><h2 className="text-xl mt-3 mb-2">Choose the new character</h2><p className="hint mb-4">JPEG, PNG or WebP · Up to 5 MB · A clear photo of one person, 200–4096 pixels per side. Paste a photo with Ctrl+V (⌘V on Mac).</p><label className="label" htmlFor="swap-image">Character photo</label><input id="swap-image" type="file" accept="image/jpeg,image/png,image/webp" required={!image} className="block w-full text-sm mt-2" onChange={event=>{setImage(event.target.files?.[0] ?? null);setError('');}}/>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl && <img src={imageUrl} alt="New character preview" className="mt-5 w-full max-h-80 object-contain rounded-lg bg-surface-2"/>}</div>
    </fieldset>
    <fieldset disabled={pending} className="mt-6 card p-6"><legend className="sr-only">Replacement quality</legend><span className="ws-eyebrow mb-4">03 / FINISH YOUR TAKE</span><div className="grid sm:grid-cols-2 gap-4">{[['wan-std','Standard','Faster processing'],['wan-pro','Professional','Smoother motion and more detail']].map(([id,title,description])=><label key={id} className="option"><input type="radio" name="quality" value={id} checked={mode===id} onChange={()=>setMode(id)}/><strong>{title}</strong><span className="hint">{description} · {settings.rates[id]} credits / second</span></label>)}</div><label className="flex gap-3 items-start text-sm mt-6"><input type="checkbox" required checked={consent} onChange={event=>setConsent(event.target.checked)} className="mt-1"/><span>I have permission to use this video and this person’s likeness.</span></label></fieldset>
    {oversized && <p role="alert" className="text-danger text-sm mt-4">Choose a video under 50 MB and a photo under 5 MB.</p>}
    {mediaError && <p role="alert" className="text-danger text-sm mt-4">{mediaError}</p>}
    {error && <p role="alert" className="text-danger text-sm mt-4">{error}</p>}
    <div className="mt-6 flex flex-wrap gap-5 justify-between items-center"><div><p className="text-lg">{duration>0&&Number.isFinite(credits)?`${credits.toLocaleString('en-US')} credits`:'Upload a video to see the price'}</p><p className="hint">Balance: {creditBalance.toLocaleString('en-US')} credits. Failed processing returns reserved credits.</p>{insufficient && <Link href="/dashboard/billing" className="underline text-sm">Buy more credits →</Link>}</div><button type="submit" disabled={!ready||pending} className="btn btn-primary">{pending?'Uploading and checking files…':'Replace character →'}</button></div>
    <p className="hint mt-5">The model replaces the main person while aiming to keep the performance and scene. Start with a short clip; results can vary with multiple people, occlusion and rapid movement.</p>
  </form>;
}
