"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface Picked {
  id: string;
  name: string;
  dataUrl: string;
}

/**
 * Files travel to the server as data URLs inside a Server Action —
 * no separate upload endpoint is needed while files stay small.
 */
export function ImagePicker({
  label,
  min,
  max,
  onChange,
  onPreview,
  initialInputs = [],
}: {
  initialInputs?: string[];
  label: string;
  min: number;
  max: number;
  onChange?: (count: number) => void;
  onPreview?: (src: string | null) => void;
}) {
  const [items, setItems] = useState<Picked[]>(() => initialInputs.slice(0, max).map((dataUrl, index) => ({ id: `restored-${index}`, name: `Reference ${index + 1}`, dataUrl })));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = useCallback((next: Picked[]) => {
    setItems(next);
    onChange?.(next.length);
    onPreview?.(next[0]?.dataUrl ?? null);
  }, [onChange, onPreview]);

  const handleFiles = useCallback(async (files: FileList | File[] | null) => {
    if (!files?.length) return;
    setError(null);
    const room = max - items.length;
    if (room <= 0) { setError(`Up to ${max} reference photos. Remove one to add another.`); return; }
    const accepted: Picked[] = [];

    for (const file of Array.from(files).slice(0, room)) {
      if (!ACCEPTED.includes(file.type)) {
        setError("Only JPEG, PNG and WebP are supported");
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name}: file is larger than 10 MB`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        name: file.name,
        dataUrl: await readAsDataUrl(file),
      });
    }

    if (accepted.length) update([...items, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  }, [items, max, update]);

  useEffect(() => {
    function paste(event: ClipboardEvent) {
      const files=Array.from(event.clipboardData?.items ?? []).filter(item=>item.kind==='file' && item.type.startsWith('image/')).map(item=>item.getAsFile()).filter((file): file is File=>file!==null);
      if(!files.length)return;
      event.preventDefault();
      void handleFiles(files);
    }
    window.addEventListener('paste',paste);
    return ()=>window.removeEventListener('paste',paste);
  }, [handleFiles]);

  return (
    <div className="flex flex-col gap-2">
      <span className="label">
        {label}
        {min > 0 && <span className="text-danger"> *</span>}
      </span>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <input type="hidden" name="inputs" value={item.dataUrl} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.dataUrl}
              alt={item.name}
              className="h-24 w-24 rounded-xl border border-line object-cover"
            />
            <button
              type="button"
              onClick={() =>
                update(items.filter((candidate) => candidate.id !== item.id))
              }
              aria-label={`Remove ${item.name}`}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper"
            >
              ×
            </button>
          </div>
        ))}

        {items.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="ws-upload flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-sm text-ink-muted transition hover:border-accent hover:text-ink"
          >
            <span className="text-xl leading-none">+</span>
            Add reference
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple={max > 1}
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <p className="hint">
        Up to {max === 1 ? "one file" : `${max} files`}, JPEG, PNG or WebP, max
        10 MB each. You can also paste a photo with Ctrl+V (⌘V on Mac).
      </p>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}
