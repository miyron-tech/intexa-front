"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LayoutGrid, Image, Camera, Film, UserRound, ArrowUpRight, Menu, X, LogOut } from 'lucide-react';
import { Wordmark } from './logo';
import { serviceVisuals } from '@/lib/service-visuals';
import type { ServiceDefinition } from '@/lib/generation-types';
const icons = { marketplace_card: Image, product_shot: Camera, video_ad: Film, avatar: UserRound, character_swap: Film };
export function WorkspaceShell({ email, services, children, isAdmin, creditBalance }: { email: string; isAdmin: boolean; creditBalance: number; services: ServiceDefinition[]; children: ReactNode; logoutAction: () => Promise<void> }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const current = services.find(s => path === `/dashboard/${s.id}`) ?? (path === '/dashboard/character-swap' ? {id:'character_swap' as const} : undefined);
  return <div className="workspace-shell">
    <aside className={`ws-sidebar ${open ? 'is-open' : ''}`}>
      <div className="ws-brand"><Link href="/" aria-label="intexa-ai.com home"><Wordmark /></Link><button className="ws-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <p className="ws-eyebrow">YOUR CREATIVE SPACE</p>
      <nav aria-label="Workspace navigation" onClick={() => setOpen(false)}>
        <Link href="/dashboard" className={path === '/dashboard' ? 'active' : ''} aria-current={path === '/dashboard' ? 'page' : undefined}><LayoutGrid size={17}/>Overview<span>↗</span></Link>
        <p className="ws-nav-label">CREATE SOMETHING</p>
        {services.map(s => { const Icon = icons[s.id]; const active = path === `/dashboard/${s.id}`; return <Link href={`/dashboard/${s.id}`} key={s.id} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}><Icon size={17}/>{serviceVisuals[s.id].label}</Link>; })}
        <Link href="/dashboard/character-swap" className={path === '/dashboard/character-swap' ? 'active' : ''}><Film size={17}/>Replace character</Link>
        {isAdmin && <Link href="/admin"><LayoutGrid size={17}/>Administration</Link>}
        <Link href="/dashboard/billing" className={path === "/dashboard/billing" ? "active" : ""}><ArrowUpRight size={17}/>Buy credits</Link><Link href="/dashboard#recent-work"><LayoutGrid size={17}/>Your creations</Link>
      </nav>
      <div className="ws-sidebar-bottom"><div className="mb-4 rounded-xl border border-line bg-surface p-4"><span className="ws-eyebrow">CREDIT BALANCE</span><strong className="block text-2xl font-normal mt-2">{(creditBalance ?? 0).toLocaleString("en-US")} <span className="text-xs text-ink-muted">credits</span></strong><p className="hint mt-2">Available for new generations. Failed generations return their credits.</p><Link href="/dashboard/billing" className="btn-primary mt-3 w-full">Buy credits ↗</Link></div><div className="ws-note"><span>✳</span><p>A little imagination.<br/>Endless possibilities.</p><Link href="/#possibilities">Find your next idea <ArrowUpRight size={14}/></Link></div><div className="ws-account"><span className="ws-avatar">{email[0]?.toUpperCase()}</span><div><b>Your workspace</b><p title={email}>{email}</p></div><form action="/api/auth/logout" method="post"><button type="submit" aria-label="Sign out" title="Sign out"><LogOut size={16}/><span>Sign out</span></button></form></div></div>
    </aside>
    {open && <button className="ws-scrim" onClick={() => setOpen(false)} aria-label="Close navigation overlay"/>}
    <div className="ws-main"><header className="ws-topbar"><button className="ws-menu" onClick={() => setOpen(true)} aria-label="Open workspace navigation" aria-expanded={open}><Menu size={21}/></button><span>Workspace <span className="ws-slash">/</span> <b>{current ? serviceVisuals[current.id].label : path === '/dashboard/billing' ? 'Buy credits' : path.includes('/jobs/') ? 'Your result' : 'Overview'}</b></span><div className="flex items-center gap-4"><Link href="/dashboard/billing">Buy credits ↗</Link><form action="/api/auth/logout" method="post"><button type="submit" className="ws-logout"><LogOut size={15}/>Sign out</button></form></div></header><div className="ws-content">{children}</div></div>
  </div>;
}
