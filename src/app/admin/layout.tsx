import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { AdminNavigation } from "@/components/admin-navigation";
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10 py-8 md:py-12">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[9px] tracking-[.2em] text-ink-muted">
            INTEXA-AI.COM / ADMINISTRATION
          </span>
          <h1 className="text-4xl md:text-5xl font-normal tracking-[-.05em] mt-3">
            Behind the creativity.
          </h1>
          <p className="text-sm text-ink-muted mt-3">
            Your people, payments, and plans. In one place.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="hidden sm:block text-xs text-ink-muted"
        >
          Open workspace ↗
        </Link>
      </div>
      <AdminNavigation />
      <div className="mt-8">{children}</div>
    </div>
  );
}
