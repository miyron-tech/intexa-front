"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

export function MobileNavigation({ signedIn, children }: { signedIn: boolean; children?: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => { if (menu.current) menu.current.open = false; };
  return <details className="mobile-menu" ref={menu} onKeyDown={event => { if (event.key === "Escape") { close(); menu.current?.querySelector("summary")?.focus(); } }}><summary aria-label="Open navigation"><span /><span /></summary><nav aria-label="Mobile navigation" onClick={event => { if ((event.target as HTMLElement).closest("a")) close(); }}><Link href="/#possibilities">Explore</Link><Link href="/#use-cases">For creators</Link><Link href="/#how-it-works">How it works</Link><Link href="/#pricing">Pricing</Link><Link href={signedIn ? "/dashboard" : "/login"}>{signedIn ? "Workspace" : "Sign in"}</Link>{children}</nav></details>;
}
