'use client';
import { useRef, useState } from 'react';
const MAX_BYTES=5*1024*1024;
export function VoicePicker({initial,onChange,onInvalid}:{initial?:string;onChange:(value:string|null)=>void;onInvalid:(invalid:boolean)=>void}){
  const [sample,setSample]=useState(initial?{url:initial,name:'Saved voice sample'}:null);
  const [error,setError]=useState('');const input=useRef<HTMLInputElement>(null);
  async function select(file:File|undefined){
    if(!file)return;setError('');
    if(file.size>MAX_BYTES){setError('Choose a voice sample under 5 MB.');onInvalid(true);return;}
    if(!/^audio\/(mpeg|mp3|wav|x-wav|wave|mp4|x-m4a|ogg|webm|aac)$/.test(file.type)){setError('Use an MP3, WAV, M4A, OGG or WebM audio file.');onInvalid(true);return;}
    onInvalid(true);
    try{const url=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file);});setSample({url,name:file.name});onChange(url);}catch{setError('Could not read the voice sample.');}
  }
  function clear(){setSample(null);setError('');onChange(null);onInvalid(false);if(input.current)input.current.value='';}
  return <div className="grid gap-3"><label htmlFor="voice-sample" className="label">Voice sample (optional)</label><p className="hint">Upload 2–15 seconds of clean speech, up to 5 MB. The character will use the sample as a voice reference and speak the dialogue from your prompt. Available with Draft and Standard.</p>
    <input ref={input} id="voice-sample" type="file" accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/ogg,audio/webm,audio/aac,.mp3,.wav,.m4a,.ogg,.webm" className="block w-full text-sm" onChange={event=>void select(event.target.files?.[0])}/>
    {sample && <div className="rounded-xl border border-line bg-surface-2 p-4 grid gap-3"><input type="hidden" name="voiceReference" value={sample.url}/><span className="text-sm break-all">{sample.name}</span><audio key={sample.url} src={sample.url} controls preload="metadata" className="w-full" onLoadedMetadata={event=>{const seconds=event.currentTarget.duration;if(!Number.isFinite(seconds)||seconds<2||seconds>15){setError('Choose a sample between 2 and 15 seconds.');onInvalid(true);}else{setError('');onInvalid(false);}}} onError={()=>{setError('This audio file could not be played. Try MP3 or WAV.');onInvalid(true);}}/><button type="button" className="text-sm underline justify-self-start" onClick={clear}>Remove voice sample</button></div>}
    {!sample && error && <button type="button" className="text-sm underline justify-self-start" onClick={clear}>Clear voice sample</button>}
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    {sample && !error && <p className="hint">A reference guides the voice; an exact match is not guaranteed. Reuse the same sample across scenes.</p>}
  </div>;
}
