import { type NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  apiUrl,
  type AuthTokens,
  isAccessTokenFresh,
  REFRESH_COOKIE,
  tokenCookies,
} from "@/lib/auth-cookies";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const GUEST_ONLY = ["/login", "/register"];

/**
 * 1. Если access-токен истёк, а refresh есть — обновляет пару до рендера,
 *    чтобы серверные компоненты уже получили свежий токен.
 * 2. Оптимистичные редиректы: гость → /login, авторизованный → /dashboard.
 *    Окончательная проверка всё равно в requireUser() и на бэкенде.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let refreshed: AuthTokens | null = null;
  let refreshFailed = false;

  if (!isAccessTokenFresh(accessToken) && refreshToken) {
    refreshed = await refresh(request, refreshToken);
    if (refreshed) {
      accessToken = refreshed.accessToken;
      // Прокидываем новые cookies в текущий запрос, чтобы cookies() в рендере их увидел
      request.cookies.set(ACCESS_COOKIE, refreshed.accessToken);
      request.cookies.set(REFRESH_COOKIE, refreshed.refreshToken);
    } else {
      refreshFailed = true;
      accessToken = undefined;
      request.cookies.delete(ACCESS_COOKIE);
      request.cookies.delete(REFRESH_COOKIE);
    }
  }

  const isAuthenticated = isAccessTokenFresh(accessToken, 0);
  let response: NextResponse;

  if (
    !isAuthenticated &&
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthenticated && GUEST_ONLY.includes(pathname)) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    response = NextResponse.next({ request: { headers: request.headers } });
  }

  if (refreshed) {
    for (const [name, value, options] of tokenCookies(refreshed))
      response.cookies.set(name, value, options);
  } else if (refreshFailed) {
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  }
  return response;
}

async function refresh(
  request: NextRequest,
  refreshToken: string,
): Promise<AuthTokens | null> {
  try {
    const res = await fetch(apiUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": request.headers.get("user-agent") ?? "",
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return ((await res.json()) as { tokens: AuthTokens }).tokens;
  } catch {
    return null;
  }
}

export const config = {
  // Все страницы, кроме статики и API-роутов
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
