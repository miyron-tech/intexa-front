"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Wallet, SlidersHorizontal } from "lucide-react";
const links = [
  { href: "/admin", label: "Users", icon: Users },
  { href: "/admin/economics", label: "Unit economics", icon: SlidersHorizontal },
  { href: "/admin/top-ups", label: "Top-ups", icon: Wallet },
  { href: "/admin/plans", label: "Plans & pricing", icon: SlidersHorizontal },
];
export function AdminNavigation() {
  const path = usePathname();
  return (
    <nav aria-label="Administration" className="flex gap-2 flex-wrap">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs transition ${path === href ? "bg-[#252922] text-white" : "bg-surface text-ink-muted hover:bg-accent-soft"}`}
        >
          <Icon size={15} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
