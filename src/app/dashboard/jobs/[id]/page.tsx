import { randomUUID } from 'node:crypto';
import { VideoExtensionForm } from '@/components/video-extension-form';
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobView } from "@/components/job-view";
import { ApiError } from "@/lib/api";
import {
  getCatalog,
  getJob,
  type Job,
  type ServiceDefinition,
} from "@/lib/generation";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Result" };

async function load(id: string): Promise<[Job, ServiceDefinition[]] | null> {
  try {
    return await Promise.all([getJob(id), getCatalog()]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export default async function JobPage({
  params,
}: PageProps<"/dashboard/jobs/[id]">) {
  const user=await requireUser();
  const { id } = await params;

  const loaded = await load(id);
  if (!loaded) notFound();

  const [job, services] = loaded;
  const serviceTitle =
    services.find((service) => service.id === job.service)?.title ??
    (job.service === 'character_swap' ? 'Character replacement' : job.service);

  return (
    <div className="ws-result">
      <JobView key={job.id} initialJob={job} serviceTitle={serviceTitle} />
      {job.status === 'succeeded' && job.outputs[0]?.mimeType.startsWith('video/') && <VideoExtensionForm key={job.id} sourceId={job.id} models={services.find(s=>s.id==='video_ad')?.videoModels ?? []} creditBalance={user.creditBalance} requestId={randomUUID()} initialModel={typeof job.params.videoModel==='string'?job.params.videoModel:undefined}/>}

    </div>
  );
}
