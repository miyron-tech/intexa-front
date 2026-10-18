import Link from 'next/link';
import { api } from '@/lib/api';
import { requireUser } from '@/lib/session';
import type { Plan } from '@/lib/admin';
import { CheckoutForm } from '@/components/checkout-form';
import { PaymentRefresh } from '@/components/payment-refresh';
import type { BillingDetails, CustomPackage } from '@/lib/billing-types';
import './billing.css';
type Payment = { id: string; planName: string; amountCents: number; credits: number; currency: string; status: string; createdAt: string };
const money = (cents: number, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
export default async function BillingPage({ searchParams }: { searchParams: Promise<{ payment?: string; plan?: string }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const [plans, payments, profile, customPackage] = await Promise.all([api<Plan[]>('/plans', { auth: false }), api<Payment[]>('/payments'), api<{ details: BillingDetails | null }>('/payments/billing-profile'), api<CustomPackage>('/payments/custom-package')]);
  const returned = payments.find(p => p.id === params.payment);
  return <div className="billing-page"><div className="ws-page-heading"><div><span className="ws-eyebrow">YOUR CREDIT BALANCE</span><h1>Keep creating.</h1><p><strong>{user.creditBalance.toLocaleString('en-US')} credits</strong> available. Choose a package to top up your account.</p></div></div>
    {params.payment && <div role="status" className="rounded-xl border border-line p-5 mb-6"><strong>{returned?.status === 'completed' ? 'Payment received. Your credits are ready.' : returned?.status === 'failed' || returned?.status === 'cancelled' ? 'Payment was not completed. Choose a package to try again.' : 'Waiting for payment confirmation…'}</strong><p className="hint mt-2">Credits are added automatically once Wemopay confirms payment.</p><PaymentRefresh pending={!returned || returned.status === 'pending'}/></div>}
    <CheckoutForm plans={plans.filter(p => p.monthlyCents > 0 && p.credits > 0).map(({id,name,credits,monthlyCents}) => ({id,name,credits,monthlyCents}))} customPackage={customPackage} profile={profile.details} accountEmail={user.email} initialPlan={params.plan}/>
    <p className="hint mt-6">Secure card checkout by Wemopay. <Link href="/legal/refunds" className="underline">Refund policy</Link> · <Link href="/legal/terms" className="underline">Terms</Link></p>
    <h2 className="text-xl mt-10 mb-4">Payment history</h2>{payments.length ? <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left p-3">Package</th><th>Amount</th><th>Credits</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map(payment => <tr key={payment.id} className="border-t border-line"><td className="p-3">{payment.planName}</td><td className="text-center">{money(payment.amountCents, payment.currency)}</td><td className="text-center">{payment.credits}</td><td className="text-center">{payment.status}</td><td className="text-center">{new Date(payment.createdAt).toLocaleDateString('en-US')}</td></tr>)}</tbody></table></div> : <p className="hint">Your payments will appear here.</p>}
  </div>;
}
