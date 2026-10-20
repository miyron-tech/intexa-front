import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { GenerationForm } from "@/components/generation-form";
import type { SwapSettings } from "@/components/character-swap-form";
import { api } from "@/lib/api";
import { getCatalog, getJobs } from "@/lib/generation";
import type { Job } from "@/lib/generation-types";
import { sectionFor } from "@/lib/studio-modes";
import { requireUser } from "@/lib/session";
export async function StudioPage({
  id,
  query,
}: {
  id: string;
  query: Record<string, string | string[] | undefined>;
}) {
  const user = await requireUser();
  const aliases: Record<string, string> = {
    images: "marketplace_card",
    video: "video_ad",
    content: "content_optimization",
    "character-swap": "video_ad",
  };
  const [services, jobs] = await Promise.all([getCatalog(), getJobs()]);
  let service = services.find((s) => s.id === (aliases[id] ?? id));
  if (!service) notFound();
  const section = sectionFor(service.id);
  let initialJob: Job | undefined, selectedJob: Job | undefined;
  if (typeof query.retry === "string" && /^[0-9a-f-]{36}$/i.test(query.retry)) {
    initialJob = await api<Job>(`/generation/jobs/${query.retry}/retry`);
    if (sectionFor(initialJob.service) !== section) notFound();
    service = services.find((s) => s.id === initialJob!.service) ?? service;
  }
  if (typeof query.job === "string" && /^[0-9a-f-]{36}$/i.test(query.job)) {
    selectedJob = await api<Job>(`/generation/jobs/${query.job}`);
    if (sectionFor(selectedJob.service) !== section) notFound();
    const index = jobs.findIndex((j) => j.id === selectedJob!.id);
    if (index >= 0) jobs.splice(index, 1);
    jobs.unshift(selectedJob);
  }
  const swapSettings =
    section === "video"
      ? await api<SwapSettings>("/generation/character-swap/config")
      : undefined;
  return (
    <GenerationForm
      key={`${section}-${initialJob?.id ?? selectedJob?.id ?? id}`}
      services={services}
      service={service}
      section={section}
      requestId={randomUUID()}
      creditBalance={user.creditBalance}
      initialJob={initialJob}
      initialJobs={jobs}
      selectedJobId={selectedJob?.id}
      initialSwap={id === "character-swap"}
      swapSettings={swapSettings}
    />
  );
}
