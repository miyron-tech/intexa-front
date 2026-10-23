"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { api, ApiError } from "@/lib/api";
import type { AuthTokens, User } from "@/lib/auth-cookies";
import { type FormState, LoginSchema, RegisterSchema } from "@/lib/definitions";
import { clearSession, saveSession } from "@/lib/session";

type AuthResponse = { user: User; tokens: AuthTokens };

/** Only internal paths: otherwise ?next=https://evil.com is an open redirect */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
    ? next
    : "/dashboard";
}

function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429)
      return "Too many attempts. Please wait a minute and try again.";
    if (error.status < 500) return error.messages.join(". ");
  }
  console.error(error);
  return "The service is temporarily unavailable. Please try again later.";
}

export async function register(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors, email };

  try {
    const { tokens } = await api<AuthResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });
    await saveSession(tokens);
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { errors: { email: ["This email is already registered"] }, email };
    }
    return { message: apiErrorMessage(error), email };
  }
  redirect("/dashboard");
}

export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success)
    return { errors: z.flattenError(parsed.error).fieldErrors, email };

  try {
    const { tokens } = await api<AuthResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify(parsed.data),
    });
    await saveSession(tokens);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { message: "Incorrect email or password", email };
    }
    return { message: apiErrorMessage(error), email };
  }
  redirect(safeNext(formData.get("next")));
}

export async function logout(): Promise<void> {
  // Revoke the session on the backend; clear cookies even if the access token already expired
  await api("/auth/logout", { method: "POST", signal: AbortSignal.timeout(3000) }).catch(() => undefined);
  await clearSession();
  redirect("/login");
}

export type RecoveryState = { success?: boolean; message?: string; email?: string };
export async function requestPasswordReset(_state: RecoveryState, data: FormData): Promise<RecoveryState> {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  if (!z.email().max(320).safeParse(email).success) return { email, message: "Enter a valid email address" };
  try {
    await api("/auth/forgot-password", { method: "POST", auth: false, body: JSON.stringify({ email }) });
    return { success: true, email };
  } catch (error) { return { email, message: apiErrorMessage(error) }; }
}
export async function resetPassword(_state: RecoveryState, data: FormData): Promise<RecoveryState> {
  const password = String(data.get("password") ?? "");
  const parsed = RegisterSchema.safeParse({ email: "validation@example.com", password, confirmPassword: data.get("confirmPassword"), acceptTerms: "on" });
  if (!parsed.success) return { message: parsed.error.issues[0].message };
  const token = String(data.get("token") ?? "");
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return { message: "This reset link is invalid. Request a new one." };
  try {
    await api("/auth/reset-password", { method: "POST", auth: false, body: JSON.stringify({ token, password }) });
    await clearSession();
    return { success: true };
  } catch (error) { return { message: apiErrorMessage(error) }; }
}
