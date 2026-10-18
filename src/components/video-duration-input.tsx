'use client';
import { useEffect, useState } from 'react';
export function VideoDurationInput({value,onChange,id='duration'}:{value:number;onChange:(value:number)=>void;id?:string}) {
  const [draft,setDraft]=useState(String(value));
  useEffect(()=>setDraft(String(value)),[value]);
  return <div className="grid gap-3">
    <div className="flex items-center gap-3"><input id={id} name="duration" type="range" min={2} max={60} step={1} value={value} onChange={event=>onChange(Number(event.target.value))} className="w-full min-w-0 accent-[var(--accent)]"/><input aria-label="Duration in seconds" type="number" min={2} max={60} step={1} value={draft} onChange={event=>{setDraft(event.target.value);const next=Number(event.target.value);if(Number.isInteger(next)&&next>=2&&next<=60)onChange(next);}} onBlur={()=>{const next=draft.trim()?Math.max(2,Math.min(60,Math.round(Number(draft)))):value;const safe=Number.isFinite(next)?next:value;setDraft(String(safe));onChange(safe);}} className="field w-20 shrink-0"/></div>
    <div className="flex justify-between text-xs text-ink-muted"><span>2 sec</span><strong>{value} seconds</strong><span>60 sec</span></div>
  </div>;
}
