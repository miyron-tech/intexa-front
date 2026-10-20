'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LayoutGrid, Image, Film, Captions, ArrowUpRight, Menu, X, LogOut, History, Shield } from 'lucide-react';
import { Wordmark } from './logo';
import type { ServiceDefinition } from '@/lib/generation-types';
const sections=[{id:'images',href:'/dashboard/images',title:'Image generation',icon:Image,color:'#7b66ab',tint:'#eee8f7',paths:['images','marketplace_card','product_shot','avatar']},{id:'video',href:'/dashboard/video',title:'Video generation',icon:Film,color:'#aa7148',tint:'#f4e8da',paths:['video','video_ad','character-swap']},{id:'content',href:'/dashboard/content',title:'Content optimization',icon:Captions,color:'#51877f',tint:'#e1eee8',paths:['content','content_optimization']}];
export function WorkspaceShell({email,children,isAdmin,creditBalance}:{email:string;isAdmin:boolean;creditBalance:number;services:ServiceDefinition[];children:ReactNode;logoutAction:()=>Promise<void>}){
  const path=usePathname(),[open,setOpen]=useState(false);
  const current=sections.find(s=>s.paths.includes(path.split('/')[2]));
  return <div className="workspace-shell">
    <aside className={`ws-sidebar ${open?'is-open':''}`}><div className="ws-brand"><Link href="/" aria-label="intexa-ai.com home"><Wordmark/></Link><button className="ws-close" onClick={()=>setOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <nav aria-label="Workspace navigation" onClick={()=>setOpen(false)}><Link href="/dashboard" className={path==='/dashboard'?'active':''}><LayoutGrid size={17}/>Overview</Link><p className="ws-nav-label">CREATE WITH AI</p>{sections.map(s=>{const Icon=s.icon;return <Link key={s.id} href={s.href} className={current?.id===s.id?'active':''} aria-current={current?.id===s.id?'page':undefined}><i className="studio-nav-icon" style={{color:s.color,background:s.tint}}><Icon size={17}/></i>{s.title}</Link>})}<p className="ws-nav-label">YOUR WORKSPACE</p><Link href="/dashboard#recent-work"><History size={17}/>Your creations</Link>{isAdmin&&<Link href="/admin"><Shield size={17}/>Administration</Link>}</nav>
      <div className="ws-sidebar-bottom"><div className="studio-credit-card"><span className="ws-eyebrow">YOUR BALANCE</span><strong>{(creditBalance??0).toLocaleString('en-US')}<small>credits</small></strong><Link href="/dashboard/billing">Add credits<ArrowUpRight size={15}/></Link></div><div className="ws-account"><span className="ws-avatar">{email[0]?.toUpperCase()}</span><div><b>Your workspace</b><p title={email}>{email}</p></div><form action="/api/auth/logout" method="post"><button type="submit" aria-label="Sign out" title="Sign out"><LogOut size={16}/></button></form></div></div>
    </aside>
    {open&&<button className="ws-scrim" onClick={()=>setOpen(false)} aria-label="Close navigation overlay"/>}
    <div className="ws-main"><header className="ws-topbar"><button className="ws-menu" onClick={()=>setOpen(true)} aria-label="Open workspace navigation" aria-expanded={open}><Menu size={21}/></button><span>Workspace<span className="ws-slash">/</span><b>{current?.title??(path.includes('billing')?'Buy credits':'Overview')}</b></span><Link href="/dashboard#recent-work" className="studio-autosaved"><span/>All creations saved</Link></header><div className="ws-content">{children}</div></div>
  </div>;
}
