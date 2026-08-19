import type { ReactNode } from 'react';

export function PageContainer({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </main>
  );
}
