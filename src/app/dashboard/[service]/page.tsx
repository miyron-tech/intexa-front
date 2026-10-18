import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenerationForm } from "@/components/generation-form";
import { api } from "@/lib/api";
import type { Job } from "@/lib/generation-types";
import { getCatalog } from "@/lib/generation";
import { requireUser } from "@/lib/session";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/[service]">): Promise<Metadata> {
  const { service: id } = await params;
  const service = (await getCatalog()).find((candidate) => candidate.id === id);
  return { title: service?.title ?? "Service" };
}

export default async function ServicePage({
  params, searchParams,
}: PageProps<"/dashboard/[service]">) {
  const user = await requireUser();
  const { service: id } = await params;
  const service = (await getCatalog()).find((candidate) => candidate.id === id);
  if (!service) notFound();
  const { retry } = await searchParams;
  let initialJob: Job | undefined;
  if (typeof retry === "string" && /^[0-9a-f-]{36}$/i.test(retry)) {
    initialJob = await api<Job>(`/generation/jobs/${retry}/retry`);
    if (initialJob.service !== service.id) notFound();
  }


  return (
    <div className="ws-editor">
      <Link href="/dashboard" className="text-sm text-ink-muted hover:text-ink">
        ← All creative tools
      </Link>
      <h1 className="ws-editor-title">{service.title}</h1>
      <p className="mt-2 text-ink-muted">{service.description}</p>

      <div className="ws-editor-body">
        <GenerationForm key={initialJob?.id ?? "new"} initialJob={initialJob} service={service} requestId={randomUUID()} creditBalance={user.creditBalance} />
      </div>
    </div>
  );
}
