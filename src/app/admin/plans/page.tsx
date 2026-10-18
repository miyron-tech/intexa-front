import { adminApi, type Plan } from "@/lib/admin";
import { PlanForm } from "@/components/admin-forms";
export default async function PlansPage() {
  const plans = await adminApi<Plan[]>("plans");
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl tracking-tight">
          Plans that grow with your creators.
        </h2>
        <p className="text-sm text-ink-muted mt-2">
          Edit internal USD prices and included credits. Credit packages appear on the homepage
          after saving.
        </p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <PlanForm key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="text-xs text-ink-muted mt-6">
        All changes are recorded with the administrator, time, and previous
        values. This editor does not change existing subscriptions or collect
        payments.
      </p>
    </>
  );
}
