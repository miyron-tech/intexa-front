'use client';
import { useActionState, useState } from 'react';
import { VideoDurationInput } from '@/components/video-duration-input';
import Link from 'next/link';
import { extendVideo } from '@/app/actions/generation';
import type { VideoModelOption } from '@/lib/generation-types';
export function VideoExtensionForm({sourceId,models,creditBalance,requestId,initialModel}:{sourceId:string;models:VideoModelOption[];creditBalance:number;requestId:string;initialModel?:string}) {
  const [description,setDescription]=useState('');
  const [state,action,pending]=useActionState(extendVideo,{});
  const [modelId,setModelId]=useState(models.find(m=>m.id===initialModel)?.id ?? models[0]?.id);
  const model=models.find(m=>m.id===modelId)!;
  const [duration,setDuration]=useState(model.durations.at(-1)!);
  const price=model.durationPrices?.[duration] ?? duration*model.creditsPerSecond;
  return <details className="card mt-8 p-6"><summary className="cursor-pointer font-semibold">Extend video →</summary>
    <p className="hint mt-3">Create the next scene from the last frame, then join both clips into one video. Your original stays saved. Voice and movement may change at the join.</p>
    <form action={action} className="mt-5 grid gap-5">
      <input type="hidden" name="sourceId" value={sourceId}/><input type="hidden" name="requestId" value={requestId}/><input type="hidden" name="expectedCredits" value={price}/>
      <label className="grid gap-2"><span className="label">What happens next?</span><textarea name="description" required maxLength={10000} value={description} onChange={event=>setDescription(event.target.value)} rows={3} className="field" placeholder="Describe the next action. For dialogue, use a short line that fits the added seconds."/></label>
      <p className="hint" aria-live="polite">{description.length.toLocaleString('en-US')} / 10,000 characters</p>
      <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="label">Quality</span><select name="videoModel" className="field" value={modelId} onChange={e=>{const next=models.find(m=>m.id===e.target.value)!;setModelId(next.id);setDuration(next.durations.at(-1)!);}}>{models.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label>
      <label className="grid gap-2"><span className="label">Add duration</span><VideoDurationInput value={duration} onChange={setDuration} id="extension-duration"/></label></div>
      <p className="hint">{price} credits for the added video · Balance: {creditBalance.toLocaleString('en-US')}. Credits are returned if continuation fails. Combined videos can be up to 120 seconds.</p>
      {price>duration*model.creditsPerSecond && <p className="hint">The model generates {price/model.creditsPerSecond} seconds; the added video is trimmed to {duration} seconds. The price includes all generated seconds.</p>}
      {state.message && <p role="alert" className="text-danger text-sm">{state.message}</p>}
      {price>creditBalance && <Link className="underline text-sm" href="/dashboard/billing">Buy more credits →</Link>}
      <button className="btn btn-primary justify-self-start" disabled={pending || price>creditBalance}>{pending?'Starting…':`Extend · ${price} credits`}</button>
    </form>
  </details>;
}
