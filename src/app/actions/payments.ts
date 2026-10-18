'use server';
import { api, ApiError } from '@/lib/api';
import { requireUser } from '@/lib/session';
import { redirect } from 'next/navigation';
export async function checkout(_state: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  await requireUser();
  let url: string;
  try {
    const fields = ['planId','email','firstName','lastName','addressLine1','city','countryCode','postalCode'];
    const body = Object.fromEntries(fields.map(name => [name, String(formData.get(name) ?? '').trim()]));
    body.countryCode = body.countryCode.toUpperCase();
    if (Object.values(body).some(value => !value)) return { error: 'Complete your billing details to continue.' };
    const custom = body.planId === 'custom' ? { customAmountCents: Number(formData.get('customAmountCents')) } : {};
    const payment = await api<{ redirectUrl: string }>('/payments/checkout', { method: 'POST', body: JSON.stringify({ ...body, ...custom }) });
    url = payment.redirectUrl;
  } catch (error) {
    return { error: error instanceof ApiError ? error.messages.join('. ') : 'Could not open checkout. Please try again.' };
  }
  redirect(url);
}
