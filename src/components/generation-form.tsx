"use client";

import { useActionState, useState } from "react";
import { VideoDurationInput } from "@/components/video-duration-input";
import Link from 'next/link';
import { createJob } from "@/app/actions/generation";
import { serviceVisuals } from "@/lib/service-visuals";
import { VoicePicker } from "@/components/voice-picker";
import { ImagePicker } from "@/components/image-picker";
import type { Job, ServiceDefinition } from "@/lib/generation-types";

export function GenerationForm({ service, requestId, creditBalance, initialJob }: { service: ServiceDefinition; requestId: string; creditBalance: number; initialJob?: Job }) {
  const [state, action, pending] = useActionState(createJob, {});
  const initial = initialJob?.params ?? {};
  const initialInputs = Array.isArray(initial.inputs) ? initial.inputs.filter((value): value is string => typeof value === "string" && value.startsWith("data:image/")) : [];
  const initialModel = service.videoModels?.find(model => model.id === initial.videoModel) ?? service.videoModels?.[0];
  const text = (name: string) => typeof initial[name] === "string" ? initial[name] as string : undefined;
  const descriptionLimit = service.kind === "video" ? 10000 : 1000;
  const [description, setDescription] = useState(text("description") ?? "");
  const [reference, setReference] = useState<string | null>(initialInputs[0] ?? null);
  const [hasVoice, setHasVoice] = useState(Boolean(text("voiceReference")));
  const [voiceInvalid, setVoiceInvalid] = useState(false);
  const [imageCount, setImageCount] = useState(initialInputs.length);
  const [count, setCount] = useState(typeof initial.count === "number" ? Math.max(1, Math.min(service.maxOutputs, initial.count)) : service.maxOutputs > 1 ? 2 : 1);
  const [videoModelId, setVideoModelId] = useState(
    initialModel?.id ?? "",
  );
  const [duration, setDuration] = useState(
    typeof initial.duration === "number" && (initialModel?.totalDurations ?? initialModel?.durations)?.includes(initial.duration) ? initial.duration : initialModel?.durations[0] ?? 5,
  );
  const [presetId, setPresetId] = useState(service.presets.find(preset => preset.id === initialJob?.preset)?.id ?? service.presets[0]?.id ?? "");

  const videoModel = service.videoModels?.find(
    (model) => model.id === videoModelId,
  );
  const isCustomPrompt = service.id === "video_ad" && presetId === "custom";
  const descriptionRequired = isCustomPrompt || (service.inputImages.min === 0 && imageCount === 0);
  const estimate = videoModel ? (videoModel.durationPrices?.[duration] ?? videoModel.creditsPerSecond * duration) : service.creditsPerImage * count;
  const insufficientCredits = creditBalance < estimate;
  const notEnoughImages = imageCount < service.inputImages.min;

  return (
    <form action={action} className="ws-generation-grid">
      <div className="ws-controls flex flex-col gap-8">
      <div className="ws-panel-heading"><span>01 / MAKE IT YOUR OWN</span><h2>Shape your idea.</h2></div>
      <input type="hidden" name="service" value={service.id} />
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="expectedCredits" value={estimate} />

      <fieldset>
        <legend className="label mb-3">Look</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {service.presets.map((preset) => (
            <label key={preset.id} className="option">
              <input
                type="radio"
                name="preset"
                value={preset.id}
                checked={presetId === preset.id}
                onChange={() => setPresetId(preset.id)}
                className="sr-only"
                required
              />
              <span className="font-semibold">{preset.title}</span>
              <span className="text-sm text-ink-muted">
                {preset.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {service.inputImages.max > 0 && (
        <ImagePicker
          initialInputs={initialInputs}
          label={hasVoice ? "Character reference (optional)" : service.inputImages.label}
          min={service.inputImages.min}
          max={service.inputImages.max}
          onChange={setImageCount}
          onPreview={setReference}
        />
      )}

      {service.id === "video_ad" && (service.voiceReferenceConfigured ? <VoicePicker initial={text("voiceReference")} onInvalid={setVoiceInvalid} onChange={value=>{setHasVoice(Boolean(value));if(value && videoModelId==='premium')setVideoModelId('standard');}}/> : <p className="hint">Voice samples are awaiting provider connection.</p>)}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="label">
          {isCustomPrompt
            ? "Your custom prompt"
            : service.kind === "video"
            ? "What happens in the clip"
            : "Product description"}
          {descriptionRequired && (
            <span className="text-danger"> *</span>
          )}
        </label>
        <textarea
          id="description"
          name="description"
          rows={isCustomPrompt ? 6 : 3}
          required={descriptionRequired}
          maxLength={descriptionLimit}
          value={description}
          onChange={event => setDescription(event.target.value)}
          placeholder={
            isCustomPrompt
              ? "Describe the scene, what happens, camera movement, lighting and mood. For example: a perfume bottle on black stone, the camera slowly moves closer as golden light sweeps across the glass."
              : service.kind === "video"
              ? "A serum bottle on a marble shelf, water drops, morning light"
              : "Ceramic mug, 350 ml, matte beige glaze"
          }
          className="field"
        />
        <p className="hint">
          {isCustomPrompt
            ? "Your prompt is sent as written, without a preset. You can write in any language. Up to 10,000 characters."
            : "Write in any language — it is turned into an English prompt for you."}
        </p>
      </div>

      <p className="hint -mt-6" aria-live="polite">{description.length.toLocaleString("en-US")} / {descriptionLimit.toLocaleString("en-US")} characters</p>

      {service.marketplaces && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="marketplace" className="label">
              Marketplace
            </label>
            <select
              id="marketplace"
              name="marketplace"
              className="field"
              defaultValue={text("marketplace") ?? "wildberries"}
            >
              {service.marketplaces.map((marketplace) => (
                <option key={marketplace.id} value={marketplace.id}>
                  {marketplace.title} — {marketplace.width}×{marketplace.height}
                </option>
              ))}
            </select>
            <p className="hint">
              Check the current spec of your marketplace before publishing.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="label">
              Headline on the image
            </label>
            <input
              id="title"
              name="title"
              maxLength={120}
              defaultValue={state.values?.title ?? text("title")}
              placeholder="Optional"
              className="field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="badge" className="label">
              Badge
            </label>
            <input
              id="badge"
              name="badge"
              maxLength={40}
              defaultValue={state.values?.badge ?? text("badge")}
              placeholder="New, −30%"
              className="field"
            />
            <p className="hint">
              Headline and badge are drawn by us, so the text is always correct.
            </p>
          </div>
        </div>
      )}

      {hasVoice && !service.voiceReferenceReady && <p role="status" className="rounded-xl border border-line bg-surface-2 p-4 text-sm">Voice-guided video is awaiting activation. You can upload and preview your sample now; generation with a voice sample will become available after activation.</p>}
      {hasVoice && <p className="hint">Your voice sample uses Wan video generation with Draft or Standard quality. Remove the sample to use Premium.</p>}

      {service.videoModels && (
        <fieldset>
          <legend className="label mb-3">Quality</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {service.videoModels.map((model) => (
              <label key={model.id} className="option">
                <input
                  type="radio"
                  name="videoModel"
                  disabled={hasVoice && model.id === "premium"}
                  value={model.id}
                  checked={videoModelId === model.id}
                  onChange={() => {
                    setVideoModelId(model.id);
                    setDuration(current => (model.totalDurations ?? model.durations).includes(current) ? current : model.durations[0]);
                  }}
                  className="sr-only"
                />
                <span className="font-semibold">{model.title}</span>
                <span className="text-sm text-ink-muted">
                  {model.description}
                </span>
                <span className="hint">
                  {model.resolution} · {model.creditsPerSecond} credits / second
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        {videoModel && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="duration" className="label">
              Final video length
            </label>
            <VideoDurationInput value={duration} onChange={setDuration}/>
          </div>
        )}

        {service.aspectRatios && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="aspectRatio" className="label">
              Aspect ratio
            </label>
            <select
              id="aspectRatio"
              name="aspectRatio"
              className="field"
              defaultValue={text("aspectRatio") ?? service.aspectRatios[0]?.id}
            >
              {service.aspectRatios.map((ratio) => (
                <option key={ratio.id} value={ratio.id}>
                  {ratio.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {service.maxOutputs > 1 && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="count" className="label">
              Variants
            </label>
            <select id="count" name="count" className="field" value={count} onChange={event => setCount(Number(event.target.value))}>
              {Array.from(
                { length: service.maxOutputs },
                (_, index) => index + 1,
              ).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {videoModel && duration > Math.max(...videoModel.durations) && <p role="status" className="hint">One video, generated automatically in consecutive scenes. The full price is shown below. Voice and motion can change between scenes. If a scene fails, any completed portion is saved and all reserved credits are returned.</p>}

      {videoModel && estimate > duration*videoModel.creditsPerSecond && <p className="hint">The model generates {estimate/videoModel.creditsPerSecond} seconds, then trims the video to your selected length. The price includes all generated seconds.</p>}

      {service.requiresConsent && (
        <label className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 p-4">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 accent-[var(--accent)]"
          />
          <span className="text-sm text-ink-muted">
            These are my own photos, or I have the consent of the person shown.
            Processing someone else&apos;s face without consent is not allowed.
          </span>
        </label>
      )}

      {state.message && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending || notEnoughImages || insufficientCredits || voiceInvalid || (hasVoice && !service.voiceReferenceReady)}
          className="btn btn-primary"
        >
          {pending ? "Sending…" : "Generate"}
        </button>
        {estimate !== null && (
          <span className="text-sm text-ink-muted">
            {estimate} credits · Balance: {creditBalance.toLocaleString("en-US")}
          </span>
        )}
        <p className="hint w-full">Credits are reserved when you start and returned if generation fails.</p>
        {insufficientCredits && <p className="text-sm text-danger w-full">You need {estimate - creditBalance} more credits. <Link className="underline font-medium" href="/dashboard/billing">Buy credits →</Link></p>}
        {notEnoughImages && (
          <span className="text-sm text-ink-muted">
            Upload a photo to continue
          </span>
        )}
      </div>
      </div>
      <aside className="ws-preview">
        <div className="ws-panel-heading"><span>02 / YOUR CREATIVE DIRECTION</span><h2>A little inspiration.</h2></div>
        <div className="ws-preview-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={reference ?? serviceVisuals[service.id].imageLarge} srcSet={reference ? undefined : `${serviceVisuals[service.id].image} 303w, ${serviceVisuals[service.id].imageMedium} 640w, ${serviceVisuals[service.id].imageLarge} 1182w`} sizes="(max-width: 760px) 90vw, (max-width: 1200px) 40vw, 560px" alt={reference ? "Your uploaded reference" : "Creative inspiration — not a generated result"}/>
          <span>{reference ? "YOUR REFERENCE" : "INSPIRATION / SAMPLE"}</span>
        </div>
        <div className="ws-preview-details"><span className="ws-eyebrow">SELECTED DIRECTION</span><h3>{service.presets.find(p => p.id === presetId)?.title}</h3><p>{service.presets.find(p => p.id === presetId)?.description}</p><div><span>{service.kind === "video" ? `${duration}s · ${videoModel?.resolution ?? "Video"}` : "IMAGE GENERATION"}</span><span>{imageCount} reference{imageCount === 1 ? "" : "s"}</span></div></div>
        <p className="ws-preview-note">Your result will appear in your workspace after generation. This is a reference preview.</p>
      </aside>
    </form>
  );
}
