import type { ReactNode } from 'react';

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">{children}</div>;
}
