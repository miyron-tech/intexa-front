"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/job-card";
import type { Job } from "@/lib/generation-types";

/** Poll until the job settles: there is no queue yet, the server works in-process. */
export function JobView({
  initialJob,
  serviceTitle,
}: {
  initialJob: Job;
  serviceTitle: string;
}) {
  const router = useRouter();
  const [job, setJob] = useState(initialJob);
  const active = job.status === "queued" || job.status === "running";

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${job.id}`, { cache: "no-store" });
        if (res.ok) {
          const next = (await res.json()) as Job;
          setJob(next);
          if (next.status === "succeeded" || next.status === "failed") router.refresh();
        }
      } catch {
        // transient network error — try again on the next tick
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [active, job.id, router]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{serviceTitle}</h1>
        <StatusBadge status={job.status} />
      </div>

      {active && (
        <div className="card mt-8 flex flex-col items-center gap-3 py-20">
          <span
            aria-hidden
            className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent"
          />
          <p role="status" className="font-medium">
            {job.status === "queued" ? "Queued…" : typeof job.params.totalSegments === "number" && job.params.totalSegments > 1 ? `Generating scene ${Math.min(Number(job.params.completedSegments ?? 0)+1,job.params.totalSegments)} of ${job.params.totalSegments}…` : "Generating…"}
          </p>
          <p className="hint max-w-sm text-center">
            Images take up to a minute, video a few minutes. You can leave this
            page — the result is saved to your studio.
          </p>
        </div>
      )}

      {job.status === "failed" && (
        <div className="card mt-8 border-danger/40 p-6">
          <p className="font-semibold text-danger">Generation failed</p>
          <p className="mt-1 text-sm text-ink-muted">{job.error}</p>
          {job.outputs.length > 0 && <p className="hint mt-2">Your completed portion is saved below. All reserved credits have been returned.</p>}
        </div>
      )}

      {(job.status === "succeeded" || job.status === "failed") && job.outputs.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {job.outputs.map((output) => {
            const url = `/api/files/${job.id}/${output.index}?v=${output.bytes}`;
            return (
              <figure key={output.index} className="flex flex-col gap-2">
                {output.mimeType.startsWith("video/") ? (
                  <video
                    src={url}
                    controls
                    playsInline
                    className="w-full rounded-2xl bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={`Result ${output.index + 1}`}
                    className="w-full rounded-2xl border border-line"
                  />
                )}
                <figcaption className="flex items-center justify-between text-sm text-ink-muted">
                  <span>
                    {output.width && output.height
                      ? `${output.width}×${output.height}`
                      : "video"}{" "}
                    · {Math.round(output.bytes / 1024)} KB
                  </span>
                  <a
                    href={url}
                    download
                    className="font-semibold text-accent hover:underline"
                  >
                    Download
                  </a>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {typeof job.params.extensionSourceJobId === "string" && <p className="hint mt-6">Continuation from the last frame · <Link className="underline" href={`/dashboard/jobs/${job.params.extensionSourceJobId}`}>View original video</Link></p>}
      <dl className="card mt-10 grid gap-4 p-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="hint">Credits</dt>
          <dd className="font-semibold">{job.billingStatus === "reserved" ? `${job.creditsReserved} reserved` : job.billingStatus === "refunded" ? `${job.creditsReserved} returned` : job.billingStatus === "legacy" ? "Before credit billing" : `${job.creditsCharged} used`}</dd>
        </div>
        {job.prompt && (
          <div className="sm:col-span-2">
            <dt className="hint">Generation prompt</dt>
            <dd className="mt-1 rounded-xl bg-surface-2 p-3 text-xs leading-relaxed">
              {job.prompt}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex gap-3">
        <Link href={`/dashboard/${job.service === "character_swap" ? "character-swap" : job.service}?retry=${job.id}`} className="btn btn-primary">
          Generate again
        </Link>
        <Link href="/dashboard" className="btn btn-ghost">
          Back to studio
        </Link>
      </div>
    </>
  );
}
