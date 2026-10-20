import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { getCatalog, getJobs } from '@/lib/generation';
import { requireUser } from '@/lib/session';
import { serviceVisuals } from '@/lib/service-visuals';
export const metadata: Metadata = { title: 'Your creative workspace' };
export default async function DashboardPage() {
  await requireUser();
  const [services, jobs] = await Promise.all([getCatalog(), getJobs()]);
  const titles = new Map(services.map(s => [s.id, s.title]));
  titles.set('character_swap','Character replacement');
  const spent = jobs.reduce((sum, job) => sum + job.creditsCharged, 0);
  return <>
    <div className="ws-page-heading"><div><span className="ws-eyebrow">A NEW DAY. A NEW POSSIBILITY.</span><h1>What will you<br/><em>make possible?</em></h1><p>One space for your products, stories, and next big ideas.</p></div><div className="ws-stats"><div><strong>{jobs.length.toString().padStart(2,'0')}</strong><span>Generations</span></div><div><strong>{jobs.filter(j=>j.status==='succeeded').length.toString().padStart(2,'0')}</strong><span>Ready to use</span></div><div><strong>{spent.toLocaleString("en-US")}</strong><span>Credits used · last 50</span></div></div></div>
    <div className="ws-section-title"><h2>Start with an idea</h2><span>THREE WAYS TO CREATE</span></div>
    <div className="ws-service-grid">{['marketplace_card','video_ad','content_optimization'].flatMap(id=>services.find(s=>s.id===id)??[]).map(s=>{const visual=serviceVisuals[s.id];return <Link href={`/dashboard/${s.id === "video_ad" ? "video" : s.id === "content_optimization" ? "content" : "images"}`} className={`ws-service-card ws-service-${s.id}`} key={s.id}><div className="ws-service-image"><Image src={visual.image} alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1100px) 40vw, 22vw"/><span className="ws-image-label">{s.kind === 'video' ? 'IDEA → MOTION' : s.kind === 'text' ? 'IDEA → WORDS' : 'IDEA → IMAGE'}</span><span className="ws-service-arrow"><ArrowUpRight size={19}/></span></div><div className="ws-service-copy"><span>{visual.number} / CREATE</span><h3>{s.id === "video_ad" ? "Video generation" : s.id === "content_optimization" ? "Content optimization" : "Image generation"}</h3><p>{visual.tagline}</p></div></Link>})}</div>
    <div className="ws-inspiration"><Sparkles size={23}/><div><h3>Your point of view is the starting point.</h3><p>Choose a look, add a reference, and make it your own.</p></div><Link href="/#how-it-works">How it works <ArrowUpRight size={16}/></Link></div>
    <section id="recent-work"><div className="ws-section-title"><div><span className="ws-eyebrow">YOUR PERSONAL COLLECTION</span><h2>Recent creations <span className="ws-count">{jobs.length}</span></h2></div><span>SAVED IN YOUR WORKSPACE</span></div>{jobs.length ? <div className="ws-jobs-grid">{jobs.map(job=><JobCard key={job.id} job={job} serviceTitle={titles.get(job.service)??job.service}/>)}</div> : <div className="ws-empty"><span className="ws-empty-mark">✳</span><h3>Your next favorite starts here.</h3><p>Choose a creative studio above.<br/>Your creations will find their home right here.</p><Link href="/dashboard/images" className="btn btn-primary">Make your first creation <ArrowUpRight size={16}/></Link></div>}</section>
  </>;
}
