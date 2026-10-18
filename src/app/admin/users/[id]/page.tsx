/* eslint-disable @next/next/no-img-element -- Authenticated result URLs must stream without image optimization. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import { adminApi, usd, type UserEconomics } from "@/lib/admin";
import { EconomicsMetricsView } from "@/components/economics-metrics";
import { AdminPagination } from "@/components/admin-table-tools";
export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const page = Math.max(
    1,
    Math.min(100000, Math.floor(Number(query.page) || 1)),
  );
  let data: UserEconomics;
  try {
    data = await adminApi<UserEconomics>(
      `users/${encodeURIComponent(id)}?page=${page}`,
    );
  } catch (error) {
    if (error instanceof ApiError && [400, 404].includes(error.status))
      notFound();
    throw error;
  }
  return (
    <>
      <Link href="/admin" className="text-sm text-ink-muted">
        ← All users
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 my-6">
        <div>
          <h2 className="text-2xl break-all">{data.user.email}</h2>
          <p className="text-sm text-ink-muted mt-2">
            {data.user.creditBalance.toLocaleString("en-US")} credits available
            · {data.user.generations} generations
          </p>
        </div>
        <Link
          className="btn btn-primary"
          href={`/admin/top-ups?email=${encodeURIComponent(data.user.email)}`}
        >
          Add top-up
        </Link>
      </div>
      <EconomicsMetricsView metrics={data.user} />
      <h3 className="text-xl mb-5">Generation history</h3>
      <div className="grid gap-5">
        {data.jobs.rows.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-line bg-surface p-5 md:p-6"
          >
            <div className="flex justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-semibold">
                  {job.service} · {job.status}
                </h4>
                <p className="text-xs text-ink-muted mt-1">
                  {new Date(job.createdAt)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, 19)}{" "}
                  UTC · {job.id}
                </p>
              </div>
              <span className="text-xs">
                {job.billingStatus === "legacy"
                  ? "Legacy: credit usage unknown"
                  : `${job.creditsCharged} credits used · ${job.creditsReserved} quoted · ${job.billingStatus}`}
              </span>
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-5 text-sm">
              <div>
                <dt className="hint">Generation model</dt>
                <dd className="break-all font-mono text-xs mt-1">
                  {job.model ?? "Not started"}
                </dd>
              </div>
              <div>
                <dt className="hint">Recognized revenue</dt>
                <dd>{usd(job.revenueUsd)}</dd>
              </div>
              <div>
                <dt className="hint">Recorded provider cost</dt>
                <dd>
                  {usd(job.costUsd)}
                  {!job.costComplete && " · incomplete"}
                </dd>
              </div>
              <div>
                <dt className="hint">Gross profit</dt>
                <dd>
                  {job.profitUsd === null
                    ? "Pending cost data"
                    : usd(job.profitUsd)}
                </dd>
              </div>
            </dl>
            <details className="rounded-xl bg-surface-2 p-4">
              <summary className="cursor-pointer text-sm font-medium">
                Prompts, settings & provider calls
              </summary>
              <p className="hint mt-4">User description</p>
              <p className="whitespace-pre-wrap break-words text-sm mt-1">
                {String(job.params.description ?? "—")}
              </p>
              <p className="hint mt-4">Final generation prompt</p>
              <p className="whitespace-pre-wrap break-words text-sm mt-1">
                {job.prompt ?? "—"}
              </p>
              <pre className="text-xs whitespace-pre-wrap break-all mt-4">
                {JSON.stringify(
                  {
                    settings: job.params,
                    preset: job.preset,
                    pricingVersion: job.pricingVersion,
                    remoteId: job.remoteId,
                    finishedAt: job.finishedAt,
                  },
                  null,
                  2,
                )}
              </pre>
              {job.usage.map((call) => (
                <div key={call.id} className="mt-4 border-t border-line pt-4">
                  <p className="text-xs font-mono break-all">
                    {call.kind} · {call.model} ·{" "}
                    {call.costUsd === null
                      ? "Cost not reported"
                      : usd(call.costUsd)}
                  </p>
                  <p className="hint mt-1">
                    Provider tokens: {call.inputTokens ?? "—"} input /{" "}
                    {call.outputTokens ?? "—"} output ·{" "}
                    {call.providerId ?? call.state}
                  </p>
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">
                      Exact request prompt
                    </summary>
                    <p className="whitespace-pre-wrap break-words text-xs mt-2">
                      {call.prompt}
                    </p>
                  </details>
                </div>
              ))}
            </details>
            {job.error && (
              <p className="text-sm text-danger whitespace-pre-wrap break-words mt-4">
                {job.error}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 mt-5">
              {job.outputs.map((output) => {
                const url = `/api/admin/files/${job.id}/${output.index}`;
                return (
                  <figure key={output.index}>
                    {output.mimeType.startsWith("video/") ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        src={url}
                        className="w-full max-h-96 rounded-xl bg-black"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Generated result ${output.index + 1}`}
                        loading="lazy"
                        className="w-full max-h-96 object-contain rounded-xl"
                      />
                    )}
                    <figcaption className="text-xs text-ink-muted mt-2 flex justify-between">
                      <span>
                        {output.mimeType} · {Math.round(output.bytes / 1024)} KB
                      </span>
                      <a href={url} download className="text-accent">
                        Download
                      </a>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            {!job.outputs.length && (
              <p className="hint mt-4">
                No saved result
                {job.status === "failed" ? " — generation failed" : ""}.
              </p>
            )}
          </article>
        ))}
      </div>
      {!data.jobs.rows.length && (
        <p className="text-ink-muted py-10">
          This user has no generations yet.
        </p>
      )}
      <AdminPagination page={data.jobs.page} total={data.jobs.total} q="" />
    </>
  );
}
