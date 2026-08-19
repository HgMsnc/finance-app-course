import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextInput({ label, id, className = '', ...props }: TextInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-ink-muted">{label}</span>}
      <input
        id={inputId}
        className={`rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft ${className}`}
        {...props}
      />
    </label>
  );
}
