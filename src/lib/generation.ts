import "server-only";
import { api } from "./api";
import type { Job, ServiceDefinition } from "./generation-types";

export * from "./generation-types";

export async function getCatalog(): Promise<ServiceDefinition[]> {
  const { services } = await api<{ services: ServiceDefinition[] }>(
    "/generation/catalog",
  );
  return services;
}

export async function getJobs(): Promise<Job[]> {
  const { jobs } = await api<{ jobs: Job[] }>("/generation/jobs");
  return jobs;
}

export function getJob(id: string): Promise<Job> {
  return api<Job>(`/generation/jobs/${id}`);
}
