import { apiUrl } from '@/lib/auth-cookies';
export async function POST(request: Request) {
  try {
    const response = await fetch(apiUrl('/payments/wemopay/webhook'), {
      method: 'POST', headers: { 'content-type': 'application/json', signature: request.headers.get('signature') ?? '' },
      body: await request.arrayBuffer(), signal: AbortSignal.timeout(20000), cache: 'no-store',
    });
    return new Response(await response.text(), { status: response.status, headers: { 'content-type': 'application/json' } });
  } catch { return Response.json({ error: 'Payment service unavailable' }, { status: 503 }); }
}
