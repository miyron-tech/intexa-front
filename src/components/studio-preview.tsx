"use client";
import { useState } from "react";
import {
  ArrowDownToLine,
  Check,
  Copy,
  ImagePlus,
  Maximize2,
  Sparkles,
  Video,
  FileText,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import type { Job } from "@/lib/generation-types";
export function StudioPreview({
  job,
  pending,
  reference,
  kind,
  ratio,
  onUseReference,
  onExtend,
  onRetry,
}: {
  job?: Job;
  pending: boolean;
  reference: string | null;
  kind: "image" | "video" | "text";
  ratio: string;
  onUseReference: (url: string) => void;
  onExtend: (job: Job) => void;
  onRetry: (job: Job) => void;
}) {
  const [index, setIndex] = useState(0),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState("");
  const active =
    pending || job?.status === "queued" || job?.status === "running";
  const output = job?.outputs[index] ?? job?.outputs[0];
  const url =
    output && job
      ? `/api/files/${job.id}/${output.index}?v=${output.bytes}`
      : null;
  const text =
    typeof job?.params.contentResult === "string"
      ? job.params.contentResult
      : "";
  const total = Number(job?.params.totalSegments ?? 0),
    complete = Number(job?.params.completedSegments ?? 0);
  const status = pending
    ? "Preparing your request"
    : job?.status === "queued"
      ? "Waiting in the queue"
      : total > 1
        ? `Creating scene ${Math.min(complete + 1, total)} of ${total}`
        : "Bringing your idea to life";
  const Icon =
    kind === "video" ? Video : kind === "text" ? FileText : ImageIcon;
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError("");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Select the text below to copy it.");
    }
  }
  return (
    <section className="studio-preview" aria-label="Preview and result">
      <div className="studio-preview-heading">
        <span>
          <span className={`studio-status-dot ${active ? "is-active" : ""}`} />
          {active
            ? "Creating"
            : job?.status === "succeeded"
              ? "Your result"
              : job?.status === "failed"
                ? "Try another take"
                : reference
                  ? "Your reference"
                  : "Your canvas"}
        </span>
        <span>
          {kind === "text"
            ? "COPY STUDIO"
            : output?.width && output?.height
              ? `${output.width} × ${output.height}`
              : typeof job?.params.aspectRatio === "string"
                ? job.params.aspectRatio
                : ratio}
        </span>
      </div>
      <div
        className={`studio-canvas ${active ? "is-generating" : ""} ${text ? "has-copy" : ""}`}
        aria-busy={active}
      >
        {url && !active ? (
          <div className="studio-media">
            {output?.mimeType.startsWith("video/") ? (
              <video
                src={url}
                controls
                playsInline
                preload="metadata"
                aria-label="Generated video"
              />
            ) : (
              <img src={url} alt={`Generated result ${index + 1}`} />
            )}
          </div>
        ) : text && !active ? (
          <div className="studio-generated-copy">
            <span className="studio-kicker">READY FOR YOUR NEXT POST</span>
            <div>{text}</div>
          </div>
        ) : reference ? (
          <img
            className="studio-reference"
            src={reference}
            alt="Your uploaded reference"
          />
        ) : !active ? (
          <div className="studio-canvas-empty">
            <span className="studio-empty-icon">
              <Icon size={30} strokeWidth={1.2} />
            </span>
            <h2>
              {kind === "text"
                ? "A little context. Better captions."
                : "A little imagination starts here."}
            </h2>
            <p>
              {kind === "text"
                ? "Describe your video on the left. Your hook, captions and hashtags will appear here."
                : "Add a reference or describe your idea. Your creation will appear right here."}
            </p>
            <span className="studio-canvas-corner top-left" />
            <span className="studio-canvas-corner bottom-right" />
          </div>
        ) : null}
        {active && (
          <div className="studio-generating">
            <div className="studio-aurora" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="studio-generation-status" role="status">
              <Sparkles size={28} strokeWidth={1.3} />
              <h2>{status}</h2>
              <p>
                {kind === "text"
                  ? "Finding the right words for your idea."
                  : "You can stay here. We’ll reveal it when it’s ready."}
              </p>
              {total > 1 ? (
                <>
                  <progress
                    max={total}
                    value={complete}
                    aria-label="Completed scenes"
                  />
                  <small>
                    {complete} of {total} scenes completed
                  </small>
                </>
              ) : (
                <span className="studio-wait-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
          </div>
        )}
        {job?.status === "failed" && !active && (
          <div className="studio-preview-error" role="alert">
            <strong>Generation didn’t finish</strong>
            <p>{job.error}</p>
            <small>
              {job.billingStatus === "refunded"
                ? `${job.creditsReserved} credits returned.`
                : ""}{" "}
              {job.outputs.length > 0 ? "Your completed portion is saved." : ""}
            </small>
          </div>
        )}
      </div>
      {job && job.outputs.length > 1 && (
        <div className="studio-variants" aria-label="Result variants">
          {job.outputs.map((o, i) => (
            <button
              type="button"
              key={o.index}
              onClick={() => setIndex(i)}
              aria-pressed={index === i}
              aria-label={`View variant ${i + 1}`}
            >
              <img
                src={`/api/files/${job.id}/${o.index}`}
                alt={`Variant ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
      <div className="studio-preview-footer">
        <span>
          {output
            ? `${output.width && output.height ? `${output.width} × ${output.height} · ` : ""}${Math.round(output.bytes / 1024)} KB`
            : active
              ? "Saved automatically to your creations"
              : "Made with your imagination"}
        </span>
        <div>
          {url && !active && (
            <>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label="Open full size"
              >
                <Maximize2 size={16} />
              </a>
              <a href={url} download aria-label="Download result">
                <ArrowDownToLine size={17} />
              </a>
            </>
          )}
          {text && !active && (
            <button type="button" onClick={() => void copy()}>
              {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
              {copied ? "Copied" : "Copy text"}
            </button>
          )}
        </div>
      </div>
      {copyError && (
        <p role="alert" className="studio-error">
          {copyError}
        </p>
      )}
      {job && !active && (
        <div className="studio-retry">
          <button type="button" onClick={() => onRetry(job)}>
            Generate again with these settings
          </button>
        </div>
      )}
      {url && !active && job?.status === "succeeded" && (
        <div className="studio-result-actions">
          {output?.mimeType.startsWith("image/") ? (
            <button type="button" onClick={() => onUseReference(url)}>
              <ImagePlus size={15} />
              Use as reference
            </button>
          ) : (
            <button type="button" onClick={() => onExtend(job)}>
              <ArrowRight size={15} />
              Continue this video
            </button>
          )}
          <span>{job.creditsCharged} credits used</span>
        </div>
      )}
    </section>
  );
}
