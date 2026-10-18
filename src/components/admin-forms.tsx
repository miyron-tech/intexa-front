"use client";
import { useActionState } from "react";
import { savePlan, recordTopUp } from "@/app/actions/admin";
interface Plan {
  id: string;
  name: string;
  monthlyCents: number;
  annualMonthlyCents: number;
  credits: number;
  version: number;
}
export function PlanForm({ plan }: { plan: Plan }) {
  const [state, action, pending] = useActionState(savePlan, {});
  return (
    <form action={action} className="card p-6 flex flex-col gap-5">
      <input type="hidden" name="id" value={plan.id} />
      <input type="hidden" name="version" value={plan.version} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium tracking-tight">{plan.name}</h2>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-[10px] text-ink-muted">
          USD
        </span>
      </div>
      <label className="label">
        Monthly price
        <input
          name="monthly"
          aria-label={`${plan.name} monthly price`}
          className="field mt-2"
          type="number"
          min="0"
          max="100000"
          step="0.01"
          defaultValue={(plan.monthlyCents / 100).toFixed(2)}
          required
        />
      </label>
      <label className="label">
        Annual plan · price per month
        <input
          name="annual"
          aria-label={`${plan.name} annual monthly price`}
          className="field mt-2"
          type="number"
          min="0"
          max="100000"
          step="0.01"
          defaultValue={(plan.annualMonthlyCents / 100).toFixed(2)}
          required
        />
        <span className="hint mt-2 block">
          Billed as 12 months on the public pricing page.
        </span>
      </label>
      <label className="label">
        Included credits
        <input
          name="credits"
          className="field mt-2"
          type="number"
          min="0"
          max="10000000"
          step="1"
          defaultValue={plan.credits}
          required
        />
      </label>
      <p className="hint">
        Saves apply to public plan listings. Existing payments are unchanged.
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-ok">
          {state.success}
        </p>
      )}
      <button className="btn btn-primary w-full mt-auto" disabled={pending}>
        {pending ? "Saving…" : "Save plan"} <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
export function TopUpForm({
  requestId,
  email = "",
}: {
  requestId: string;
  email?: string;
}) {
  const [state, action, pending] = useActionState(recordTopUp, {});
  return (
    <form action={action} className="card p-6 flex flex-col gap-5">
      <input
        type="hidden"
        name="requestId"
        value={state.nextRequestId ?? requestId}
      />
      <div>
        <span className="ws-eyebrow">MANUAL RECORD</span>
        <h2 className="text-2xl mt-2 tracking-tight">Record a top-up</h2>
        <p className="text-xs text-ink-muted leading-relaxed mt-3">
          Record a payment received outside the site and add credits to the
          account. This does not charge a card.
        </p>
      </div>
      <label className="label">
        Account email
        <input
          className="field mt-2"
          name="email"
          type="email"
          autoComplete="off"
          required
          defaultValue={email}
          placeholder="creator@example.com"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="label">
          Received · USD
          <input
            className="field mt-2"
            name="amount"
            type="number"
            min="0.01"
            max="100000"
            step="0.01"
            required
            placeholder="19.00"
          />
        </label>
        <label className="label">
          Credits to add
          <input
            className="field mt-2"
            name="credits"
            type="number"
            min="1"
            max="10000000"
            step="1"
            required
            placeholder="1000"
          />
        </label>
      </div>
      <label className="label">
        Payment reference / reason
        <textarea
          name="note"
          className="field mt-2"
          rows={3}
          minLength={3}
          maxLength={500}
          required
          placeholder="Bank transfer reference or receipt number"
        />
      </label>
      <p className="hint">
        Your admin account is recorded as the author. Submitted entries cannot
        be edited here.
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-ok">
          {state.success}
        </p>
      )}
      <button disabled={pending} className="btn btn-primary">
        {pending ? "Recording…" : "Record payment & add credits"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
