import "server-only";
import { cookies, headers } from "next/headers";
import { ACCESS_COOKIE, apiUrl } from "./auth-cookies";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[],
  ) {
    super(messages.join(", "));
  }
}

/** Запрос к NestJS с сервера Next.js. Пробрасывает IP и User-Agent клиента, подставляет access-токен. */
export async function api<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, ...rest } = init;
  const incoming = await headers();
  const reqHeaders = new Headers(rest.headers);
  reqHeaders.set("content-type", "application/json");

  const forwardedFor = incoming.get("x-forwarded-for");
  if (forwardedFor) reqHeaders.set("x-forwarded-for", forwardedFor);
  const userAgent = incoming.get("user-agent");
  if (userAgent) reqHeaders.set("user-agent", userAgent);

  if (auth) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (token) reqHeaders.set("authorization", `Bearer ${token}`);
  }

  const res = await fetch(apiUrl(path), {
    ...rest,
    headers: reqHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message ?? res.statusText;
    throw new ApiError(
      res.status,
      Array.isArray(message) ? message : [String(message)],
    );
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}
