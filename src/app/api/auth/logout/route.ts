import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth-cookies';
export async function POST(request: Request) {
  // Native form navigation also clears the client router's cached authenticated pages.
  const origin = request.headers.get('origin');
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || new URL(origin).host !== forwardedHost) return new Response('Forbidden', { status: 403 });
  await api('/auth/logout', { method: 'POST', signal: AbortSignal.timeout(3000) }).catch(() => undefined);
  const response = NextResponse.redirect(new URL('/login', origin), 303);
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
