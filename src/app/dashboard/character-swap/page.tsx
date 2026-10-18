import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Job } from '@/lib/generation-types';
import { api } from '@/lib/api';
import { requireUser } from '@/lib/session';
import { CharacterSwapForm, type SwapSettings } from '@/components/character-swap-form';
export const metadata={title:'Replace a character in video'};
export default async function CharacterSwapPage({searchParams}: {searchParams: Promise<Record<string,string|string[]|undefined>>}) {
  const user=await requireUser();
  const {retry}=await searchParams;
  const job=typeof retry==='string' && /^[0-9a-f-]{36}$/i.test(retry) ? await api<Job>(`/generation/jobs/${retry}/retry`) : undefined;
  if(job && job.service!=='character_swap')notFound();
  const settings=await api<SwapSettings>('/generation/character-swap/config');
  return <div className="ws-editor"><Link href="/dashboard" className="text-sm text-ink-muted">← All creative tools</Link><h1 className="ws-editor-title">A new character.<br/>The same performance.</h1><p className="mt-3 text-ink-muted mb-8">Upload a short video and a character photo. Replace the main person while keeping their movement and the original scene.</p><CharacterSwapForm key={job?.id ?? "new"} retry={Boolean(job)} initialMode={job?.preset} settings={settings} requestId={randomUUID()} creditBalance={user.creditBalance}/></div>;
}
