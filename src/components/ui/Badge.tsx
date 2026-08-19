import type { ReactNode } from 'react';

type Tone = 'neutral' | 'positive' | 'negative' | 'brand';

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-surface-alt text-ink-muted',
  positive: 'bg-positive-soft text-positive',
  negative: 'bg-negative-soft text-negative',
  brand: 'bg-brand-soft text-brand',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
