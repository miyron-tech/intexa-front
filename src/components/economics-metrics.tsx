import { usd, type EconomicsMetrics } from "@/lib/admin";
export function EconomicsMetricsView({
  metrics,
}: {
  metrics: EconomicsMetrics;
}) {
  const margin =
    metrics.profitUsd !== null && metrics.revenueUsd > 0
      ? (metrics.profitUsd / metrics.revenueUsd) * 100
      : null;
  const cards = [
    ["Credits used", metrics.creditsUsed.toLocaleString("en-US")],
    ["Payments received", usd(metrics.paymentsUsd)],
    ["Revenue from used credits", usd(metrics.revenueUsd)],
    ["Recorded provider cost", usd(metrics.costUsd)],
    [
      metrics.profitUsd === null
        ? "Gross profit · complete jobs only"
        : "Gross profit",
      usd(metrics.profitUsd ?? metrics.confirmedProfitUsd),
    ],
    ["Gross margin", margin === null ? "—" : `${margin.toFixed(1)}%`],
    [
      "Credits reserved / refunded",
      `${metrics.creditsReserved} / ${metrics.creditsRefunded}`,
    ],
    ["Successful / failed", `${metrics.succeeded} / ${metrics.failed}`],
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <p className="text-xs text-ink-muted">{label}</p>
            <p className="text-xl tracking-tight mt-3 break-words">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-ink-muted mb-8">
        All-time totals. Revenue uses the weighted purchase value of credits at
        reservation, and is recognized only for successful generations. Gross
        profit subtracts reported generation and prompt-processing costs;
        payment fees, taxes and infrastructure are excluded.{" "}
        {metrics.incompleteCosts > 0
          ? `${metrics.incompleteCosts} jobs have incomplete cost data or are still active; profit is not final.`
          : "All recorded job costs are complete."}{" "}
        Legacy jobs retain their recorded costs, but their historical credit
        usage and full costs are unknown.
      </p>
    </>
  );
}
