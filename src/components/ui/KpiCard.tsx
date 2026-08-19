import type { ReactNode } from 'react';

type Tone = 'neutral' | 'positive' | 'negative';

const DELTA_CLASSES: Record<Tone, string> = {
  neutral: 'text-ink-muted',
  positive: 'text-positive',
  negative: 'text-negative',
};

const VALUE_CLASSES: Record<Tone, string> = {
  neutral: 'text-ink',
  positive: 'text-positive',
  negative: 'text-negative',
};

export function KpiCard({
  label,
  value,
  valueTone = 'neutral',
  delta,
  deltaTone = 'neutral',
  icon,
}: {
  label: string;
  value: string;
  valueTone?: Tone;
  delta?: string;
  deltaTone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
        {icon}
      </div>
      <span className={`text-2xl font-semibold ${VALUE_CLASSES[valueTone]}`}>{value}</span>
      {delta && <span className={`text-xs font-medium ${DELTA_CLASSES[deltaTone]}`}>{delta}</span>}
    </div>
  );
}
