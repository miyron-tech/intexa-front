'use client';
import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from 'lucide-react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  errors?: string[];
}

export function Field({ label, name, errors, type, ...input }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  const errorId = errors?.length ? `${name}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <div className="relative"><input
        id={name}
        name={name}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className={`field ${password ? 'pr-12' : ''}`}
        {...input}
        type={password ? visible ? 'text' : 'password' : type}
      />{password && <button type="button" onClick={() => setVisible(value => !value)} disabled={input.disabled} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} aria-controls={name} className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-lg text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent">{visible ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}</button>}</div>
      {errorId && (
        <ul id={errorId} className="text-sm text-danger">
          {errors!.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
