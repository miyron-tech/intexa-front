// Types and constants without server-only: client components import these too

export type ServiceId =
  "marketplace_card" | "product_shot" | "video_ad" | "avatar" | "character_swap" | "content_optimization";
export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export interface Preset {
  id: string;
  title: string;
  description: string;
}

export interface MarketplaceSpec {
  id: string;
  title: string;
  width: number;
  height: number;
  note: string;
}

export interface VideoModelOption {
  id: string;
  title: string;
  description: string;
  resolution: string;
  durations: number[];
  totalDurations?: number[];
  durationPrices?: Record<number,number>;
  creditsPerSecond: number;
}

export interface ServiceDefinition {
  id: ServiceId;
  title: string;
  description: string;
  kind: "image" | "video" | "text";
  inputImages: { min: number; max: number; label: string };
  presets: Preset[];
  maxOutputs: number;
  creditsPerImage: number;
  pricingVersion: string;
  marketplaces?: MarketplaceSpec[];
  videoModels?: VideoModelOption[];
  aspectRatios?: { id: string; title: string }[];
  requiresConsent?: boolean;
  voiceReferenceConfigured?: boolean;
  voiceReferenceReady?: boolean;
}

export interface JobOutput {
  index: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  bytes: number;
}

export interface Job {
  id: string;
  service: ServiceId;
  preset: string;
  status: JobStatus;
  params: Record<string, unknown>;
  prompt: string | null;
  creditsReserved: number;
  creditsCharged: number;
  billingStatus: "legacy" | "reserved" | "charged" | "refunded";
  error: string | null;
  createdAt: string;
  finishedAt: string | null;
  outputs: JobOutput[];
}

export const STATUS_LABELS: Record<JobStatus, string> = {
  queued: "Queued",
  running: "Generating",
  succeeded: "Ready",
  failed: "Failed",
};
