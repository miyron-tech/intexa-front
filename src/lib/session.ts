import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { api, ApiError } from "./api";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  tokenCookies,
  type AuthTokens,
  type User,
} from "./auth-cookies";

export async function saveSession(tokens: AuthTokens) {
  const store = await cookies();
  for (const [name, value, options] of tokenCookies(tokens))
    store.set(name, value, options);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

/**
 * Текущий пользователь или null. Мемоизируется на время одного рендера (React cache),
 * поэтому layout и страница не делают два запроса к API.
 * Access-токен к этому моменту уже обновлён в proxy.ts.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await cookies()).has(ACCESS_COOKIE)) return null;
  try {
    return await api<User>("/auth/me");
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 404)
    )
      return null;
    throw error;
  }
});

/** Для защищённых страниц и Server Actions: проверка авторизации рядом с данными, а не только в proxy. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
