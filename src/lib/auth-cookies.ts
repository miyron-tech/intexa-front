// Общие константы и утилиты для proxy.ts и серверного кода (без 'server-only', т.к. proxy тоже их импортирует)

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  role: "user" | "admin";
  creditBalance: number;
}

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  expires: Date;
}

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Пары [имя, значение, опции] — подходят и для cookies() из next/headers, и для NextResponse.cookies. */
export function tokenCookies(
  tokens: AuthTokens,
): [string, string, CookieOptions][] {
  return [
    [
      ACCESS_COOKIE,
      tokens.accessToken,
      { ...baseOptions, expires: new Date(tokens.accessTokenExpiresAt) },
    ],
    [
      REFRESH_COOKIE,
      tokens.refreshToken,
      { ...baseOptions, expires: new Date(tokens.refreshTokenExpiresAt) },
    ],
  ];
}

/**
 * Проверяет только срок действия JWT (подпись проверяет бэкенд).
 * Нужно proxy, чтобы заранее обновить токен, который вот-вот истечёт.
 */
export function isAccessTokenFresh(
  token: string | undefined,
  leewaySeconds = 30,
): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return (
      typeof payload.exp === "number" &&
      payload.exp - leewaySeconds > Date.now() / 1000
    );
  } catch {
    return false;
  }
}

export function apiUrl(path: string): string {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL is not set");
  return new URL(path, base).toString();
}
