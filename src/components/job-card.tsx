import Link from "next/link";
import { type Job, STATUS_LABELS } from "@/lib/generation-types";

const STATUS_CLASS: Record<Job["status"], string> = {
  queued: "bg-surface-2 text-ink-muted",
  running: "bg-accent-soft text-accent",
  succeeded: "bg-ok/12 text-ok",
  failed: "bg-danger/12 text-danger",
};

export function StatusBadge({ status }: { status: Job["status"] }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function JobCard({
  job,
  serviceTitle,
}: {
  job: Job;
  serviceTitle: string;
}) {
  const preview = job.outputs[0];
  const isVideo = preview?.mimeType.startsWith("video/");

  return (
    <Link
      href={`/dashboard/${job.service === "content_optimization" ? "content" : ["video_ad","character_swap"].includes(job.service) ? "video" : "images"}?job=${job.id}`}
      className="card ws-job-card transition hover:border-accent"
    >
      <div className="ws-job-thumb">
        {preview && !isVideo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/files/${job.id}/${preview.index}`}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-ink-muted">
            {job.service === "content_optimization" ? "✦ TikTok captions" : isVideo ? "▷ Video creation" : job.status === "failed" ? "Let’s try another take" : "✳ Bringing your idea to life"}
          </span>
        )}
      </div>
      <div className="ws-job-copy flex min-w-0 flex-col items-start gap-1.5">
        <span className="font-medium">{serviceTitle}</span>
        <StatusBadge status={job.status} />
        <span className="hint">
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(job.createdAt))}
        </span>
      </div>
    </Link>
  );
}
