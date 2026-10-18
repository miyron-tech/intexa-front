import {
  adminApi,
  usd,
  type EconomicsMetrics,
  type ModelUsage,
} from "@/lib/admin";
import { EconomicsMetricsView } from "@/components/economics-metrics";
export default async function EconomicsPage() {
  const data = await adminApi<EconomicsMetrics & { models: ModelUsage[] }>(
    "economics",
  );
  return (
    <>
      <h2 className="text-2xl mb-6">Unit economics</h2>
      <EconomicsMetricsView metrics={data} />
      <div className="card p-5 mb-8">
        <h3 className="font-semibold">Credit pricing</h3>
        <p className="text-sm text-ink-muted mt-2">
          Images: 10 credits per variant. Video: Draft 10, Standard 20, Premium
          25 credits per second. Unspent purchase value, including reservations:{" "}
          {usd(data.unspentValueUsd)}.
        </p>
      </div>
      <h3 className="text-xl mb-4">Provider usage by model</h3>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2">
            <tr>
              {[
                "Model",
                "Purpose",
                "Calls",
                "Input tokens",
                "Output tokens",
                "Recorded cost",
                "Unknown costs",
              ].map((h) => (
                <th key={h} className="p-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.models.map((m) => (
              <tr key={`${m.model}-${m.kind}`} className="border-t border-line">
                <td className="p-4 font-mono text-xs">{m.model}</td>
                <td className="p-4">{m.kind}</td>
                <td className="p-4">{m.calls}</td>
                <td className="p-4">
                  {m.inputTokens?.toLocaleString("en-US") ?? "Not reported"}
                </td>
                <td className="p-4">
                  {m.outputTokens?.toLocaleString("en-US") ?? "Not reported"}
                </td>
                <td className="p-4">{usd(m.costUsd)}</td>
                <td className="p-4">{m.unknownCosts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.models.length && (
          <p className="p-8 text-sm text-ink-muted">
            Detailed provider usage will appear for new generations.
          </p>
        )}
      </div>
    </>
  );
}
