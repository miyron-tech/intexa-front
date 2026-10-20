"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  Check,
  ChevronDown,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  Sparkles,
  X,
  Paperclip,
  Film,
  UserRound,
} from "lucide-react";
import { createJob, extendVideo } from "@/app/actions/generation";
import { ImagePicker } from "@/components/image-picker";
import { VoicePicker } from "@/components/voice-picker";
import { VideoDurationInput } from "@/components/video-duration-input";
import { StudioPreview } from "@/components/studio-preview";
import {
  sectionFor,
  sectionTitle,
  studioModes,
  type StudioSection,
} from "@/lib/studio-modes";
import type { Job, ServiceDefinition } from "@/lib/generation-types";
import type { SwapSettings } from "@/components/character-swap-form";

function dataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
function useFileUrl(file: File | null) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return url;
}
const isActive = (j: Job) => j.status === "queued" || j.status === "running";

export function GenerationForm({
  services,
  service,
  section,
  requestId,
  creditBalance,
  initialJob,
  initialJobs = [],
  selectedJobId,
  swapSettings,
  initialSwap = false,
}: {
  services: ServiceDefinition[];
  service: ServiceDefinition;
  section: StudioSection;
  requestId: string;
  creditBalance: number;
  initialJob?: Job;
  initialJobs?: Job[];
  selectedJobId?: string;
  swapSettings?: SwapSettings;
  initialSwap?: boolean;
}) {
  const router = useRouter();
  const modes = studioModes(services, section),
    original = initialJob?.params ?? {};
  const originalMode =
    initialSwap || initialJob?.service === "character_swap"
      ? "character_swap"
      : service.id === "video_ad"
        ? `video_ad:${initialJob?.preset ?? "custom"}`
        : service.id;
  const [modeId, setModeId] = useState(originalMode);
  const mode = modes.find((m) => m.id === modeId) ?? modes[0];
  const definition = services.find((s) => s.id === mode.service) ?? service;
  const swap = mode.service === "character_swap",
    video = section === "video",
    content = section === "content";
  const [preset, setPreset] = useState(
    initialJob?.preset ?? definition.presets[0]?.id ?? "",
  );
  const [description, setDescription] = useState(
    typeof original.description === "string" ? original.description : "",
  );
  const initialInputs = Array.isArray(original.inputs)
    ? original.inputs.filter(
        (x): x is string =>
          typeof x === "string" && x.startsWith("data:image/"),
      )
    : [];
  const [inputs, setInputs] = useState(initialInputs),
    [imageCount, setImageCount] = useState(initialInputs.length),
    [reference, setReference] = useState<string | null>(
      initialInputs[0] ?? null,
    ),
    [inputVersion, setInputVersion] = useState(0);
  const [modelId, setModelId] = useState(
    typeof original.videoModel === "string"
      ? original.videoModel
      : (definition.videoModels?.[0]?.id ?? "draft"),
  );
  const model =
    definition.videoModels?.find((m) => m.id === modelId) ??
    definition.videoModels?.[0];
  const [duration, setDuration] = useState(
    typeof original.duration === "number" ? original.duration : 8,
  );
  const [ratio, setRatio] = useState(
    typeof original.aspectRatio === "string"
      ? original.aspectRatio
      : (definition.aspectRatios?.[0]?.id ?? "1:1"),
  );
  const [marketplace, setMarketplace] = useState(
    typeof original.marketplace === "string"
      ? original.marketplace
      : (definition.marketplaces?.[0]?.id ?? "wildberries"),
  );
  const [count, setCount] = useState(
    typeof original.count === "number" ? original.count : 1,
  );
  const [customSize, setCustomSize] = useState(
    Boolean(original.outputWidth && original.outputHeight),
  );
  const [outputWidth, setOutputWidth] = useState(
      String(original.outputWidth ?? 1024),
    ),
    [outputHeight, setOutputHeight] = useState(
      String(original.outputHeight ?? 1024),
    );
  const [title, setTitle] = useState(
      typeof original.title === "string" ? original.title : "",
    ),
    [badge, setBadge] = useState(
      typeof original.badge === "string" ? original.badge : "",
    );
  const [consent, setConsent] = useState(false),
    [voice, setVoice] = useState(
      typeof original.voiceReference === "string"
        ? original.voiceReference
        : "",
    ),
    [voiceInvalid, setVoiceInvalid] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(
    initialJobs
      .filter((j) => sectionFor(j.service) === section)
      .slice(0, 12)
      .reverse(),
  );
  const [selected, setSelected] = useState<string | null>(
      selectedJobId ??
        initialJobs.find(
          (j) => sectionFor(j.service) === section && isActive(j),
        )?.id ??
        null,
    ),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [pollError, setPollError] = useState("");
  const [submissionId, setSubmissionId] = useState(requestId),
    [extension, setExtension] = useState<Job | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null),
    [personFile, setPersonFile] = useState<File | null>(null),
    [swapDuration, setSwapDuration] = useState(0),
    [swapError, setSwapError] = useState("");
  const [swapQuality, setSwapQuality] = useState(
    initialJob?.preset === "wan-pro" ? "wan-pro" : "wan-std",
  );
  const videoUrl = useFileUrl(videoFile),
    personUrl = useFileUrl(personFile);
  const menu = useRef<HTMLDetailsElement>(null),
    thread = useRef<HTMLDivElement>(null),
    prompt = useRef<HTMLTextAreaElement>(null),
    submitting = useRef(false);
  const activeIds = jobs
    .filter(isActive)
    .map((j) => j.id)
    .join(",");
  const busy = pending || Boolean(activeIds),
    selectedJob = jobs.find((j) => j.id === selected);
  const price = swap
    ? Math.ceil(swapDuration) * (swapSettings?.rates[swapQuality] ?? 0)
    : model
      ? (model.durationPrices?.[duration] ?? model.creditsPerSecond * duration)
      : definition.creditsPerImage * count;
  const enough = price <= creditBalance,
    spec = definition.marketplaces?.find((m) => m.id === marketplace);
  const displayRatio = customSize
    ? `${outputWidth} × ${outputHeight}`
    : spec
      ? `${spec.width} × ${spec.height}`
      : definition.aspectRatios
        ? ratio
        : "Original";
  const descriptionRequired =
    content ||
    Boolean(extension) ||
    (!swap && (imageCount === 0 || (mode.preset === "custom" && video)));
  const missingImage =
    !swap && imageCount < definition.inputImages.min && !extension;
  const swapReady = Boolean(
    swapSettings?.enabled &&
    videoFile &&
    personFile &&
    swapDuration >= swapSettings.minSeconds &&
    swapDuration <= swapSettings.maxSeconds &&
    !swapError &&
    videoFile.size <= swapSettings.maxVideoBytes &&
    personFile.size <= swapSettings.maxImageBytes &&
    consent,
  );
  const blocked =
    busy ||
    !enough ||
    missingImage ||
    (swap && !swapReady) ||
    (!swap &&
      (voiceInvalid || Boolean(voice && !definition.voiceReferenceReady))) ||
    (!swap && Boolean(definition.requiresConsent && !consent));

  useEffect(() => {
    if (!activeIds) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await Promise.all(
          activeIds.split(",").map(async (id) => {
            const r = await fetch(`/api/jobs/${id}`, { cache: "no-store" });
            if (!r.ok) throw new Error();
            return (await r.json()) as Job;
          }),
        );
        if (stopped) return;
        setPollError("");
        setJobs((current) =>
          current.map((j) => next.find((n) => n.id === j.id) ?? j),
        );
        if (next.some((j) => !isActive(j))) router.refresh();
      } catch {
        if (!stopped)
          setPollError(
            "Reconnecting to your generation… Your request is still saved.",
          );
      }
      if (!stopped) timer = setTimeout(() => void poll(), 3000);
    }
    timer = setTimeout(() => void poll(), 1000);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [activeIds, router]);
  useEffect(() => {
    thread.current?.scrollTo({
      top: thread.current.scrollHeight,
      behavior: "smooth",
    });
  }, [jobs.length]);
  useEffect(() => {
    if (!swap) return;
    const paste = (e: ClipboardEvent) => {
      if (busy) return;
      const f = Array.from(e.clipboardData?.items ?? [])
        .find((i) => i.kind === "file" && i.type.startsWith("image/"))
        ?.getAsFile();
      if (!f) return;
      e.preventDefault();
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
        f.size > (swapSettings?.maxImageBytes ?? 5 * 1024 * 1024)
      ) {
        setError("Use a JPEG, PNG or WebP image under 5 MB.");
        return;
      }
      setPersonFile(f);
      setError("");
    };
    window.addEventListener("paste", paste);
    return () => window.removeEventListener("paste", paste);
  }, [swap, busy, swapSettings?.maxImageBytes]);
  function changeMode(id: string) {
    const next = modes.find((m) => m.id === id);
    if (!next) return;
    setModeId(id);
    setPreset(next.preset);
    setError("");
    setExtension(null);
    setSelected(null);
    setConsent(false);
    setCount(1);
    setCustomSize(false);
    setSubmissionId(crypto.randomUUID());
    if (next.service !== mode.service) {
      setInputs([]);
      setImageCount(0);
      setReference(null);
      setInputVersion((v) => v + 1);
      setVoice("");
      setVoiceInvalid(false);
      const s = services.find((s) => s.id === next.service);
      setRatio(s?.aspectRatios?.[0]?.id ?? "1:1");
    }
    if (menu.current) menu.current.open = false;
  }
  function accept(job: Job) {
    setJobs((current) =>
      current.some((j) => j.id === job.id) ? current : [...current, job],
    );
    setSelected(job.id);
    setSubmissionId(crypto.randomUUID());
    setDescription("");
    setExtension(null);
    router.refresh();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blocked || submitting.current) return;
    submitting.current = true;
    const body = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      if (swap) {
        const upload = new FormData();
        upload.set("requestId", submissionId);
        upload.set("mode", swapQuality);
        upload.set("expectedCredits", String(price));
        upload.set("consent", "true");
        upload.set("video", videoFile!);
        upload.set("image", personFile!);
        const r = await fetch("/api/character-swap", {
          method: "POST",
          body: upload,
        });
        const data = await r.json();
        if (!r.ok)
          throw new Error(
            Array.isArray(data.message)
              ? data.message.join(". ")
              : (data.message ?? "Could not start replacement."),
          );
        accept(data as Job);
      } else {
        body.set("inline", "true");
        body.set("requestId", submissionId);
        body.set("expectedCredits", String(price));
        body.set("service", definition.id);
        body.set("preset", video ? mode.preset : preset);
        if (extension) body.set("sourceId", extension.id);
        const result = await (extension ? extendVideo : createJob)({}, body);
        if (result.job) accept(result.job);
        else setError(result.message ?? "Could not start generation.");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not start generation. Please try again.",
      );
    } finally {
      setPending(false);
      submitting.current = false;
    }
  }
  async function useReference(url: string) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error();
      const data = await dataUrl(await r.blob());
      setInputs([data]);
      setImageCount(1);
      setReference(data);
      setInputVersion((v) => v + 1);
      setSelected(null);
      setDescription("");
      prompt.current?.focus();
    } catch {
      setError(
        "Could not load the reference. Try downloading and uploading it.",
      );
    }
  }
  function continueVideo(job: Job) {
    setModeId("video_ad:custom");
    setPreset("custom");
    setExtension(job);
    setDescription("");
    setVoice("");
    setVoiceInvalid(false);
    setInputVersion((v) => v + 1);
    setSubmissionId(crypto.randomUUID());
    prompt.current?.focus();
  }
  function newChat() {
    setJobs([]);
    setSelected(null);
    setDescription("");
    setExtension(null);
    setError("");
    setInputs([]);
    setImageCount(0);
    setReference(null);
    setVoice("");
    setVoiceInvalid(false);
    setInputVersion((v) => v + 1);
    setVideoFile(null);
    setPersonFile(null);
    setSwapDuration(0);
    setSwapError("");
    setConsent(false);
    setSubmissionId(crypto.randomUUID());
    prompt.current?.focus();
  }
  const Icon = mode.icon;
  return (
    <div
      className="studio"
      style={
        {
          "--mode-color": mode.color,
          "--mode-tint": mode.tint,
        } as CSSProperties
      }
    >
      <div className="studio-heading">
        <div>
          <span className="studio-kicker">YOUR CREATIVE STUDIO</span>
          <h1>{sectionTitle[section]}</h1>
        </div>
        <button
          type="button"
          className="studio-new-chat"
          onClick={newChat}
          disabled={busy}
        >
          <Plus size={16} />
          New chat
        </button>
      </div>
      <form className="studio-grid" onSubmit={(event) => void submit(event)}>
        <section className="studio-chat" aria-label="Creative chat">
          <div className="studio-chat-top">
            <details className="studio-mode-menu" ref={menu}>
              <summary>
                <span className="studio-mode-icon">
                  <Icon size={19} />
                </span>
                <div>
                  <small>CREATIVE MODE</small>
                  <strong>{mode.title}</strong>
                </div>
                <ChevronDown size={16} />
              </summary>
              <div className="studio-mode-options">
                {modes.map((m) => {
                  const I = m.icon;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      disabled={busy}
                      onClick={() => changeMode(m.id)}
                      aria-pressed={m.id === mode.id}
                    >
                      <span style={{ background: m.tint, color: m.color }}>
                        <I size={18} />
                      </span>
                      {m.title}
                      {m.id === mode.id && <Check size={15} />}
                    </button>
                  );
                })}
              </div>
            </details>
            <span className="studio-chat-label">
              <MessageSquare size={15} />
              Chat
            </span>
          </div>
          <div
            className="studio-thread"
            ref={thread}
            aria-label="Generation history"
          >
            <div className="studio-assistant-intro">
              <span className="studio-assistant-icon">
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Let’s make something yours.</strong>
                <p>
                  {content
                    ? "Tell me what your TikTok is about, who it’s for and the tone you want. I’ll suggest captions, hooks and hashtags."
                    : swap
                      ? "Upload your original video and a photo of the new character. Fine-tune the settings on the right."
                      : "Choose a mode, add a reference and tell me what you have in mind. Fine-tune your settings on the right."}
                </p>
              </div>
            </div>
            {!jobs.length && !swap && (
              <div className="studio-suggestions">
                {(content
                  ? [
                      "A funny caption for a behind-the-scenes video",
                      "A short hook for my new product launch",
                    ]
                  : video
                    ? [
                        "A cinematic product reveal in soft morning light",
                        "A playful unboxing with close-up details",
                      ]
                    : [
                        "A clean studio shot with a soft natural shadow",
                        "Warm sunlight, natural textures, editorial style",
                      ]
                ).map((s) => (
                  <button
                    type="button"
                    disabled={busy}
                    key={s}
                    onClick={() => {
                      setDescription(s);
                      prompt.current?.focus();
                    }}
                  >
                    {s}
                    <ArrowUp size={14} />
                  </button>
                ))}
              </div>
            )}
            {jobs.map((job) => (
              <div className="studio-exchange" key={job.id}>
                <div className="studio-user-message">
                  <span>You</span>
                  <p>
                    {String(
                      job.params.description ??
                        (job.service === "character_swap"
                          ? "Replace the character in my video."
                          : "Create from my reference."),
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className={`studio-job-message ${selected === job.id ? "is-selected" : ""}`}
                  onClick={() => setSelected(job.id)}
                >
                  <span
                    className={`studio-message-mark ${isActive(job) ? "is-active" : ""}`}
                  >
                    <Sparkles size={16} />
                  </span>
                  <span>
                    <strong>
                      {isActive(job)
                        ? job.status === "queued"
                          ? "Your idea is in the queue"
                          : "Creating your result…"
                        : job.status === "failed"
                          ? "Let’s try another take"
                          : job.service === "content_optimization"
                            ? "Your captions are ready"
                            : "Your creation is ready"}
                    </strong>
                    <small>
                      {job.billingStatus === "refunded"
                        ? `${job.creditsReserved} credits returned`
                        : isActive(job)
                          ? "Keep this chat open or come back later."
                          : "Click to preview on the right"}
                    </small>
                  </span>
                  {!isActive(job) && job.status !== "failed" && (
                    <Check size={15} />
                  )}
                </button>
              </div>
            ))}
            {pending && (
              <div className="studio-job-message" role="status">
                <Sparkles size={16} />
                Sending your idea…
              </div>
            )}
          </div>
          <fieldset className="studio-composer" disabled={busy}>
            {extension && (
              <div className="studio-context">
                <Film size={15} />
                Continue the selected video
                <button
                  type="button"
                  onClick={() => setExtension(null)}
                  aria-label="Cancel video continuation"
                >
                  <X size={15} />
                </button>
              </div>
            )}
            {swap ? (
              <>
                <div className="studio-swap-inputs">
                  <label>
                    <Film size={20} />
                    <strong>{videoFile?.name ?? "Original video"}</strong>
                    <small>MP4 / MOV · 2–30 sec · 50 MB</small>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,.mp4,.mov"
                      onChange={(e) => {
                        setVideoFile(e.target.files?.[0] ?? null);
                        setSwapDuration(0);
                        setSwapError("");
                      }}
                    />
                  </label>
                  <label>
                    <UserRound size={20} />
                    <strong>{personFile?.name ?? "New character"}</strong>
                    <small>Photo · 5 MB · or Ctrl+V</small>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        setPersonFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
                {personUrl && (
                  <img
                    className="studio-person-reference"
                    src={personUrl}
                    alt="New character reference"
                  />
                )}
              </>
            ) : (
              <>
                {!content && !extension && (
                  <div className="studio-attachments">
                    <ImagePicker
                      key={`${mode.service}-${inputVersion}`}
                      initialInputs={inputs}
                      label={
                        voice
                          ? "Character reference"
                          : definition.inputImages.label
                      }
                      min={definition.inputImages.min}
                      max={definition.inputImages.max}
                      onChange={setImageCount}
                      onPreview={setReference}
                    />
                  </div>
                )}
                <label className="sr-only" htmlFor="studio-prompt">
                  {content ? "Describe your TikTok" : "Your prompt"}
                </label>
                <textarea
                  id="studio-prompt"
                  ref={prompt}
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required={descriptionRequired}
                  maxLength={10000}
                  placeholder={
                    content
                      ? "What is your video about? Add your audience, tone and key details…"
                      : extension
                        ? "What happens next? Describe the next scene…"
                        : "Describe your idea. The details make it yours…"
                  }
                  rows={4}
                />
              </>
            )}
            {((definition.requiresConsent && !swap) || swap) && (
              <label className="studio-consent">
                <input
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                I have permission to use these photos and this person’s
                likeness.
              </label>
            )}
            <div className="studio-composer-bottom">
              <div>
                <span>
                  {swap
                    ? swapDuration
                      ? `${price} credits`
                      : "Add a video to see the price"
                    : `${price} credits`}
                </span>
                <small>{creditBalance.toLocaleString("en-US")} available</small>
              </div>
              <button
                className="studio-send"
                type="submit"
                disabled={blocked}
                aria-label={
                  content
                    ? "Generate captions"
                    : swap
                      ? "Replace character"
                      : extension
                        ? "Continue video"
                        : "Generate"
                }
              >
                <span>
                  {pending
                    ? "Sending…"
                    : activeIds
                      ? "Creating…"
                      : content
                        ? "Write captions"
                        : swap
                          ? "Replace character"
                          : extension
                            ? "Continue"
                            : "Generate"}
                </span>
                <ArrowUp size={18} />
              </button>
            </div>
            <p className="studio-composer-hint">
              {content
                ? "3 caption ideas · 5 credits per request"
                : swap
                  ? "Your video and reference stay private."
                  : "Ctrl+V to paste a reference · Results are saved automatically"}
            </p>
          </fieldset>
          {(error || swapError) && (
            <p role="alert" className="studio-error">
              {error || swapError}
            </p>
          )}
          {pollError && (
            <p role="status" className="studio-notice">
              {pollError}
            </p>
          )}
          {!enough && (
            <p className="studio-error">
              You need {price - creditBalance} more credits.{" "}
              <Link href="/dashboard/billing">Buy credits →</Link>
            </p>
          )}
          {missingImage && (
            <p className="studio-notice">
              Add a reference photo to use this mode.
            </p>
          )}
          {swap && !swapSettings?.enabled && (
            <p className="studio-notice">
              Character replacement is awaiting activation. You can preview your
              files.
            </p>
          )}
          {initialJob?.service === "character_swap" && (
            <p className="studio-notice">
              Choose the original files again. Source uploads are removed after
              processing.
            </p>
          )}
        </section>
        <aside
          className="studio-workbench"
          aria-label="Preview and generation settings"
        >
          {swap && videoUrl && !selectedJob && !pending ? (
            <section className="studio-preview">
              <div className="studio-preview-heading">
                <span>Original video</span>
                <span>REFERENCE</span>
              </div>
              <div className="studio-canvas">
                <video
                  className="studio-source-video"
                  src={videoUrl}
                  controls
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    setSwapDuration(v.duration);
                    if (
                      !Number.isFinite(v.duration) ||
                      v.duration < 2 ||
                      v.duration > 30 ||
                      v.videoWidth < 200 ||
                      v.videoHeight < 200 ||
                      v.videoWidth > 2048 ||
                      v.videoHeight > 2048 ||
                      v.videoWidth / v.videoHeight > 3 ||
                      v.videoHeight / v.videoWidth > 3
                    )
                      setSwapError(
                        "Use a 2–30 second video, 200–2048 pixels per side, with aspect ratio between 1:3 and 3:1.",
                      );
                  }}
                  onError={() =>
                    setSwapError(
                      "Could not read this video. Try an MP4 or MOV file.",
                    )
                  }
                />
              </div>
            </section>
          ) : (
            <StudioPreview
              key={selectedJob?.id ?? "empty"}
              job={selectedJob}
              pending={pending}
              reference={swap ? personUrl : reference}
              kind={content ? "text" : video ? "video" : "image"}
              ratio={displayRatio}
              onUseReference={(url) => void useReference(url)}
              onExtend={continueVideo}
              onRetry={(job) =>
                router.push(`/dashboard/${section}?retry=${job.id}`)
              }
            />
          )}
          <fieldset className="studio-settings" disabled={busy}>
            <div className="studio-settings-heading">
              <SlidersHorizontal size={16} />
              <h2>
                {content ? "Writing direction" : "Fine-tune your creation"}
              </h2>
            </div>
            {content ? (
              <>
                <p className="studio-notice">
                  For TikTok · 3 caption options with hooks, calls to action and
                  relevant hashtags.
                </p>
                <p className="studio-notice">
                  Add the language, audience and tone to your message. The copy
                  follows your instructions.
                </p>
              </>
            ) : swap ? (
              <>
                <label>
                  Quality
                  <select
                    value={swapQuality}
                    onChange={(e) => setSwapQuality(e.target.value)}
                  >
                    <option value="wan-std">
                      Standard · {swapSettings?.rates["wan-std"]} credits / sec
                    </option>
                    <option value="wan-pro">
                      Professional · {swapSettings?.rates["wan-pro"]} credits /
                      sec
                    </option>
                  </select>
                </label>
                <p className="studio-notice">
                  {swapDuration > 0
                    ? `${swapDuration.toFixed(1)} sec · billed as ${Math.ceil(swapDuration)} sec`
                    : "The original video sets the length and framing."}
                </p>
                {((videoFile &&
                  videoFile.size > (swapSettings?.maxVideoBytes ?? 0)) ||
                  (personFile &&
                    personFile.size > (swapSettings?.maxImageBytes ?? 0))) && (
                  <p className="studio-error">
                    Use a video under 50 MB and a photo under 5 MB.
                  </p>
                )}
              </>
            ) : (
              <>
                {!video && definition.presets.length > 1 && (
                  <label>
                    Visual style
                    <select
                      aria-label="Visual style"
                      name="preset"
                      value={preset}
                      onChange={(e) => setPreset(e.target.value)}
                    >
                      {definition.presets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {model && (
                  <label>
                    Quality
                    <select
                      aria-label="Quality"
                      name="videoModel"
                      value={model.id}
                      onChange={(e) => setModelId(e.target.value)}
                    >
                      {definition.videoModels?.map((m) => (
                        <option
                          key={m.id}
                          value={m.id}
                          disabled={Boolean(voice) && m.id === "premium"}
                        >
                          {m.title} · {m.resolution}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <div className="studio-settings-row">
                  {definition.aspectRatios && (
                    <label>
                      Aspect ratio
                      <select
                        aria-label="Aspect ratio"
                        name="aspectRatio"
                        disabled={customSize}
                        value={ratio}
                        onChange={(e) => setRatio(e.target.value)}
                      >
                        {definition.aspectRatios.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {definition.maxOutputs > 1 && (
                    <label>
                      Variations
                      <select
                        aria-label="Variations"
                        name="count"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                      >
                        {Array.from(
                          { length: definition.maxOutputs },
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} image{i ? "s" : ""}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                  )}
                </div>
                {spec && (
                  <>
                    <label>
                      Marketplace format
                      <select
                        aria-label="Marketplace format"
                        name="marketplace"
                        value={marketplace}
                        onChange={(e) => setMarketplace(e.target.value)}
                      >
                        {definition.marketplaces?.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <details className="studio-extra">
                      <summary>
                        Headline & badge
                        <Plus size={14} />
                      </summary>
                      <label>
                        Headline
                        <input
                          name="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={120}
                          placeholder="Optional headline"
                        />
                      </label>
                      <label>
                        Badge
                        <input
                          name="badge"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          maxLength={40}
                          placeholder="New, −30%…"
                        />
                      </label>
                    </details>
                  </>
                )}
                {!video && (
                  <div className="studio-output-size">
                    <label className="studio-size-toggle">
                      <input
                        type="checkbox"
                        checked={customSize}
                        onChange={(e) => {
                          setCustomSize(e.target.checked);
                          if (e.target.checked) {
                            setOutputWidth(String(spec?.width ?? 1024));
                            setOutputHeight(String(spec?.height ?? 1024));
                          }
                        }}
                      />
                      Custom output size
                    </label>
                    {customSize ? (
                      <>
                        <div className="studio-settings-row">
                          <label>
                            Width (px)
                            <input
                              type="number"
                              name="outputWidth"
                              min={256}
                              max={2048}
                              step={1}
                              required
                              value={outputWidth}
                              onChange={(e) => setOutputWidth(e.target.value)}
                            />
                          </label>
                          <label>
                            Height (px)
                            <input
                              type="number"
                              name="outputHeight"
                              min={256}
                              max={2048}
                              step={1}
                              required
                              value={outputHeight}
                              onChange={(e) => setOutputHeight(e.target.value)}
                            />
                          </label>
                        </div>
                        <p className="studio-notice">
                          256–2048 px per side. The generated image is cropped
                          to fit.
                        </p>
                      </>
                    ) : spec ? (
                      <div className="studio-dimensions">
                        <span>
                          Width
                          <strong>
                            {spec.width}
                            <small>px</small>
                          </strong>
                        </span>
                        <X size={12} />
                        <span>
                          Height
                          <strong>
                            {spec.height}
                            <small>px</small>
                          </strong>
                        </span>
                      </div>
                    ) : (
                      <p className="studio-notice">
                        {definition.aspectRatios
                          ? "The image is cropped to your chosen aspect ratio."
                          : "Uses the generated image’s original dimensions."}
                      </p>
                    )}
                  </div>
                )}
                {model && (
                  <label className="studio-duration">
                    {extension ? "Additional length" : "Video length"}
                    <VideoDurationInput
                      value={duration}
                      onChange={setDuration}
                    />
                  </label>
                )}
                {model && duration > Math.max(...model.durations) && (
                  <p className="studio-notice">
                    Long videos are created in consecutive scenes. Voice and
                    motion may vary between scenes.
                  </p>
                )}
                {model && price > duration * model.creditsPerSecond && (
                  <p className="studio-notice">
                    Includes {price / model.creditsPerSecond} generated seconds,
                    trimmed to {duration}s.
                  </p>
                )}
                {video && !extension && definition.voiceReferenceConfigured && (
                  <details className="studio-extra">
                    <summary>
                      Voice reference
                      <Paperclip size={14} />
                    </summary>
                    <VoicePicker
                      key={inputVersion}
                      initial={voice || undefined}
                      onInvalid={setVoiceInvalid}
                      onChange={(value) => {
                        setVoice(value ?? "");
                        if (value && modelId === "premium")
                          setModelId("standard");
                      }}
                    />
                    {voice && !definition.voiceReferenceReady && (
                      <p className="studio-notice">
                        Voice-guided generation is awaiting activation. Remove
                        the sample to generate now.
                      </p>
                    )}
                  </details>
                )}
              </>
            )}
            <p className="studio-settings-footnote">
              Credits are reserved when you start and returned if generation
              fails.
            </p>
          </fieldset>
        </aside>
      </form>
    </div>
  );
}
