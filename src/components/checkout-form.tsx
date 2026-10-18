'use client';
import { useActionState, useState } from 'react';
import { checkout } from '@/app/actions/payments';
import type { BillingDetails, CreditPackage, CustomPackage } from '@/lib/billing-types';
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const fields: { name: keyof BillingDetails; label: string; autoComplete: string; max: number }[] = [
  { name:'email', label:'Payment email', autoComplete:'email', max:254 },
  { name:'firstName', label:'First name', autoComplete:'given-name', max:100 },
  { name:'lastName', label:'Last name', autoComplete:'family-name', max:100 },
  { name:'addressLine1', label:'Billing address', autoComplete:'address-line1', max:200 },
  { name:'city', label:'City', autoComplete:'address-level2', max:100 },
  { name:'countryCode', label:'Country code (e.g. US, KZ)', autoComplete:'country', max:2 },
  { name:'postalCode', label:'Postal code', autoComplete:'postal-code', max:20 },
];
export function CheckoutForm({ plans, customPackage, profile, accountEmail, initialPlan }: { plans: CreditPackage[]; customPackage: CustomPackage; profile: BillingDetails | null; accountEmail: string; initialPlan?: string }) {
  const [state, action, pending] = useActionState(checkout, {});
  const [planId, setPlanId] = useState(initialPlan === 'custom' ? 'custom' : plans.find(p => p.id === initialPlan)?.id ?? plans[0]?.id ?? 'custom');
  const minCredits = customPackage.minAmountCents / customPackage.stepAmountCents * customPackage.creditsPerStep;
  const maxCredits = customPackage.maxAmountCents / customPackage.stepAmountCents * customPackage.creditsPerStep;
  const defaultCredits = customPackage.defaultAmountCents / customPackage.stepAmountCents * customPackage.creditsPerStep;
  const [customQuantity, setCustomQuantity] = useState(String(defaultCredits));
  const quantity = Number(customQuantity);
  const customValid = customQuantity.trim() !== '' && Number.isSafeInteger(quantity) && quantity >= minCredits && quantity <= maxCredits && quantity % customPackage.creditsPerStep === 0;
  const customAmountCents = customValid ? quantity / customPackage.creditsPerStep * customPackage.stepAmountCents : 0;
  const sliderCredits = Math.min(maxCredits, Math.max(minCredits, Number.isFinite(quantity) ? quantity : defaultCredits));
  const initialEmail = profile?.email ?? accountEmail;
  const [editing, setEditing] = useState(!profile || /\.(local|localhost|test|invalid|example|internal|lan)$/i.test(initialEmail));
  const [details, setDetails] = useState<BillingDetails>({ ...(profile ?? { firstName:'',lastName:'',addressLine1:'',city:'',countryCode:'',postalCode:'' }), email: initialEmail });
  const showFields = editing || Boolean(state.error);
  const selected = planId === 'custom' ? { id:'custom', name:'Custom credits', credits:quantity, monthlyCents:customAmountCents } : plans.find(p => p.id === planId);
  const selectionValid = planId !== 'custom' || customValid;
  if (!selected) return <p>Credit packages are temporarily unavailable.</p>;
  return <form action={action}>
    <fieldset disabled={pending}><legend className="text-sm font-medium mb-4">1. Choose your package</legend>
      <div className="grid gap-5 md:grid-cols-2">{plans.map(plan => <label key={plan.id} className={`rounded-2xl border p-6 cursor-pointer ${planId === plan.id ? 'border-ink bg-surface' : 'border-line'}`}>
        <div className="flex items-center justify-between gap-3"><span className="ws-eyebrow">{plan.name}</span><input type="radio" name="planId" value={plan.id} checked={planId === plan.id} onChange={() => setPlanId(plan.id)} className="accent-ink"/></div>
        <span className="block text-3xl mt-4">{plan.credits.toLocaleString('en-US')} credits</span><span className="block text-2xl mt-3">{money(plan.monthlyCents)}</span><span className="block hint mt-3">One-time payment · No subscription</span>
      </label>)}</div>
      <div className={`custom-package mt-5 ${planId === 'custom' ? 'is-selected' : ''}`}>
        <label className="custom-package-choice"><span><span className="ws-eyebrow">CUSTOM</span><span className="block text-2xl mt-2">Choose your own credits</span><span className="block hint mt-2">From {money(customPackage.minAmountCents)} · Adjust in {money(customPackage.stepAmountCents)} steps</span></span><input type="radio" name="planId" value="custom" checked={planId === 'custom'} onChange={() => setPlanId('custom')} className="accent-ink"/></label>
        {planId === 'custom' && <div className="custom-package-controls">
          <div className="custom-package-values"><label htmlFor="custom-credit-input" className="text-sm">Credits<input id="custom-credit-input" type="number" inputMode="numeric" min={minCredits} max={maxCredits} step={customPackage.creditsPerStep} required value={customQuantity} onChange={event => setCustomQuantity(event.target.value)} aria-describedby="custom-credit-hint" aria-invalid={!customValid} className="block w-full rounded-lg border border-line p-3 mt-2 text-2xl"/></label><div className="text-right"><span className="text-sm">Your price</span><output aria-live="polite" className="block text-3xl mt-2">{customValid ? money(customAmountCents) : '—'}</output><span className="hint">One-time payment</span></div></div>
          <label htmlFor="custom-credit-slider" className="sr-only">Adjust credit quantity</label><input id="custom-credit-slider" type="range" min={minCredits} max={maxCredits} step={customPackage.creditsPerStep} value={sliderCredits} onChange={event => setCustomQuantity(event.target.value)} aria-valuetext={`${sliderCredits.toLocaleString('en-US')} credits, ${money(sliderCredits / customPackage.creditsPerStep * customPackage.stepAmountCents)}`} aria-describedby="custom-credit-hint" className="custom-credit-slider"/>
          <div className="flex justify-between text-xs text-ink-muted"><span>{minCredits.toLocaleString('en-US')} credits · {money(customPackage.minAmountCents)}</span><span>{maxCredits.toLocaleString('en-US')} credits · {money(customPackage.maxAmountCents)}</span></div>
          <p id="custom-credit-hint" className={`text-xs mt-4 ${customValid ? 'text-ink-muted' : 'text-danger'}`}>{customPackage.creditsPerStep.toLocaleString('en-US')} credits per {money(customPackage.stepAmountCents)} step. Enter {minCredits.toLocaleString('en-US')}–{maxCredits.toLocaleString('en-US')} credits or move the slider.</p>
          <input type="hidden" name="customAmountCents" value={customValid ? customAmountCents : ''}/>
        </div>}
      </div>
    </fieldset>
    <section className="rounded-2xl border border-line p-6 mt-6" aria-label="Billing details">
      <div className="flex justify-between items-center gap-4"><h2 className="text-sm font-medium">2. Billing details</h2>{!showFields && <button type="button" onClick={() => setEditing(true)} className="text-sm underline">Edit details</button>}</div>
      {showFields ? <><p className="hint mt-2 mb-4">Enter these once. We’ll save them to your account for your next purchase.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{fields.map(({name,label,autoComplete,max}) => <label key={name} className={`text-xs flex flex-col gap-1 ${name === 'email' ? 'sm:col-span-2' : ''}`}>{label}<input type={name === 'email' ? 'email' : 'text'} name={name} autoComplete={autoComplete} required maxLength={max} minLength={name === 'countryCode' ? 2 : 1} pattern={name === 'countryCode' ? '[A-Za-z]{2}' : undefined} value={details[name] ?? ''} onChange={event => setDetails({...details,[name]:event.target.value})} className="rounded-lg border border-line bg-surface p-3 w-full"/>{name === 'email' && <span className="hint">Use a valid email for payment. Changing it here does not change your sign-in email.</span>}</label>)}</div></> : <div className="mt-4 text-sm"><p className="font-medium">{details.firstName} {details.lastName}</p><p className="text-ink-muted mt-1">{details.email}</p><p className="text-ink-muted mt-1">{details.addressLine1}, {details.city}, {details.postalCode}, {details.countryCode}</p><p className="hint mt-3">Saved to your account. Ready for checkout.</p>{fields.map(({name}) => <input key={name} type="hidden" name={name} value={details[name] ?? ''}/>)}</div>}
    </section>
    <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"><div><p className="text-lg">Total: <strong>{selectionValid ? money(selected.monthlyCents) : '—'}</strong></p><p className="hint">{selectionValid ? `${selected.credits.toLocaleString('en-US')} credits · ` : ''}Secure checkout by Wemopay</p></div><button type="submit" disabled={pending || !selectionValid} className="btn-primary p-4 rounded-lg">{pending ? 'Opening secure checkout…' : selectionValid ? `Pay ${money(selected.monthlyCents)} →` : 'Choose a valid quantity'}</button></div>
    {state.error && <p role="alert" className="text-danger mt-3 text-sm">{state.error}</p>}
  </form>;
}
