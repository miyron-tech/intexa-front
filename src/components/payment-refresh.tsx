'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export function PaymentRefresh({ pending }: { pending: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!pending) return;
    let attempts = 0;
    const timer = setInterval(() => { router.refresh(); if (++attempts >= 24) clearInterval(timer); }, 5000);
    return () => clearInterval(timer);
  }, [pending, router]);
  return <button className="btn-secondary mt-3" onClick={() => router.refresh()}>Refresh payment status</button>;
}
