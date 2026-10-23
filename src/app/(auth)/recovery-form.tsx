"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { requestPasswordReset, resetPassword, type RecoveryState } from "@/app/actions/auth";
import { Field } from "@/components/field";
export function RecoveryForm({ mode }: { mode: "request" | "reset" }) {
  const [state, action, pending] = useActionState<RecoveryState, FormData>(mode === "request" ? requestPasswordReset : resetPassword, {});
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (mode === "reset") setToken(new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "");
  }, [mode]);
  useEffect(() => {
    if (state.success && mode === "reset") window.history.replaceState(null, "", window.location.pathname);
  }, [state.success, mode]);
  const invalid = mode === "reset" && token !== null && !/^[A-Za-z0-9_-]{43}$/.test(token);
  return <>
    <h1 className="mb-4 text-2xl font-bold">{state.success ? mode === "request" ? "Check your inbox" : "Password updated" : invalid ? "This link is incomplete" : mode === "request" ? "Forgot password?" : "Choose a new password"}</h1>
    <p className="mb-6 text-sm text-ink-muted">{state.success ? mode === "request"
      ? "If an account exists for this email, you’ll receive a reset link shortly. Check your spam folder too. The link is valid for 30 minutes."
      : "Your password has been changed and previous sessions have been signed out. Sign in with your new password."
      : invalid ? "Open the full link from your email, or request a new one."
      : mode === "request" ? "Enter your account email and we’ll send you a link to reset your password."
      : "Use 8–128 characters, including at least one letter and one number."}</p>
    {!state.success && !invalid && <form action={action} className="flex flex-col gap-4" noValidate>
      {mode === "request" ? <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} /> : <>
        <input type="hidden" name="token" value={token ?? ""} />
        <Field label="New password" name="password" type="password" autoComplete="new-password" required />
        <Field label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required />
      </>}
      {state.message && <p role="alert" className="text-sm text-danger">{state.message}</p>}
      <button type="submit" className="btn btn-primary mt-1" disabled={pending || (mode === "reset" && token === null)}>{pending ? "Please wait…" : mode === "request" ? "Send reset link" : "Save new password"}</button>
    </form>}
    {mode === "reset" && !state.success && <p className="mt-4 text-sm"><Link href="/forgot-password" className="hover:underline">Request a new reset link</Link></p>}
    {state.success && mode === "request" && <p role="status" className="text-sm text-ink-muted">You can request another link after one minute.</p>}
    <p className="mt-6 text-sm"><Link href="/login" className="font-medium hover:underline">Back to sign in →</Link></p>
    {state.success && mode === "request" && <p className="mt-3 text-sm"><a href="/forgot-password" className="text-ink-muted hover:underline">Try another email or resend</a></p>}
  </>;
}
