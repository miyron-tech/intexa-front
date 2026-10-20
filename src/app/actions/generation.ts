"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Job } from "@/lib/generation";
import { requireUser } from "@/lib/session";

export interface GenerationFormState {
  job?: Job;
  message?: string;
  values?: Record<string, string>;
}

/** Numeric form fields arrive as strings — convert to a number or undefined */
function num(value: FormDataEntryValue | null): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function str(value: FormDataEntryValue | null): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : undefined;
}

export async function createJob(
  _state: GenerationFormState,
  formData: FormData,
): Promise<GenerationFormState> {
  // Auth check next to the action itself, not only in proxy
  await requireUser();

  const service = String(formData.get("service") ?? "");
  const description = str(formData.get("description"));
  // The client encodes files as data URLs: one inputs field per photo
  const inputs = formData
    .getAll("inputs")
    .filter(
      (value): value is string =>
        typeof value === "string" && value.startsWith("data:"),
    );

  const values: Record<string, string> = {
    description: description ?? "",
    title: String(formData.get("title") ?? ""),
    badge: String(formData.get("badge") ?? ""),
  };

  let job: Job;
  try {
    job = await api<Job>("/generation/jobs", {
      method: "POST",
      body: JSON.stringify({
        service,
        requestId: str(formData.get("requestId")),
        expectedCredits: num(formData.get("expectedCredits")),
        preset: String(formData.get("preset") ?? ""),
        description,
        inputs,
        voiceReference: str(formData.get("voiceReference")),
        count: num(formData.get("count")),
        marketplace: str(formData.get("marketplace")),
        aspectRatio: str(formData.get("aspectRatio")),
        outputWidth: num(formData.get("outputWidth")),
        outputHeight: num(formData.get("outputHeight")),
        title: str(formData.get("title")),
        badge: str(formData.get("badge")),
        videoModel: str(formData.get("videoModel")),
        duration: num(formData.get("duration")),
        consent: formData.get("consent") === "on",
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) {
        return { message: "Too many requests. Wait a minute.", values };
      }
      if (error.status < 500)
        return { message: error.messages.join(". "), values };
    }
    console.error(error);
    return {
      message: "Could not start the generation. Try again later.",
      values,
    };
  }

  revalidatePath("/dashboard", "layout");
  if (formData.get('inline') === 'true') return { job };
  redirect(`/dashboard/jobs/${job.id}`);
}

export async function extendVideo(_state: GenerationFormState, formData: FormData): Promise<GenerationFormState> {
  await requireUser();
  const sourceId=String(formData.get('sourceId') ?? '');
  if(!/^[0-9a-f-]{36}$/i.test(sourceId))return {message:'Invalid source video'};
  let job: Job;
  try {
    job=await api<Job>(`/generation/jobs/${sourceId}/extend`,{method:'POST',body:JSON.stringify({
      requestId:str(formData.get('requestId')),description:str(formData.get('description')),
      videoModel:str(formData.get('videoModel')),duration:num(formData.get('duration')),expectedCredits:num(formData.get('expectedCredits')),
    })});
  } catch(error) {
    return {message:error instanceof ApiError && error.status<500 ? error.messages.join('. ') : 'Could not start the continuation. Please try again.'};
  }
  revalidatePath('/dashboard','layout');
  if (formData.get('inline') === 'true') return { job };
  redirect(`/dashboard/jobs/${job.id}`);
}
