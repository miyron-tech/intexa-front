"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { Field } from "@/components/field";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.email}
        errors={state?.errors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        errors={state?.errors?.password}
      />
      <Field
        label="Repeat password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        errors={state?.errors?.confirmPassword}
      />
      <p className="hint">At least 8 characters, with a letter and a digit.</p>
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2.5 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            className="mt-1 size-4 shrink-0 accent-[var(--accent)]"
            aria-invalid={state?.errors?.acceptTerms ? true : undefined}
            aria-describedby={state?.errors?.acceptTerms ? "acceptTerms-error" : undefined}
          />
          <span>
            I am 18 or older and agree to the{" "}
            <Link href="/legal/terms" target="_blank" className="font-medium underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/legal/acceptable-use" target="_blank" className="font-medium underline">Acceptable Use Policy</Link>.
            I have read the{" "}
            <Link href="/legal/privacy" target="_blank" className="font-medium underline">Privacy Policy</Link>.
          </span>
        </label>
        {state?.errors?.acceptTerms && (
          <p id="acceptTerms-error" className="text-sm text-danger">{state.errors.acceptTerms[0]}</p>
        )}
      </div>
      {state?.message && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary mt-1">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
