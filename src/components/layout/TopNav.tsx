import { useRef, useState } from 'react';
import { CURRENCIES } from '../../constants/categories';
import { useAppState } from '../../state/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ImportBackupDialog } from './ImportBackupDialog';
import type { TabId } from '../../App';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'portfolio', label: 'Portfolio' },
];

export function TopNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (tab: TabId) => void }) {
  const { state, setCurrency, exportBackup, importBackup } = useAppState();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) setPendingImportFile(file);
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1 rounded-lg bg-surface-alt p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg border border-border p-1.5 text-ink hover:bg-surface-alt"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
          <select
            aria-label="Currency"
            value={state.currency}
            onChange={(e) => setCurrency(e.target.value as typeof state.currency)}
            className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={exportBackup}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-alt"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-alt"
          >
            Import JSON
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />
        </div>
      </div>

      {pendingImportFile && (
        <ImportBackupDialog
          onImport={(mode) => importBackup(pendingImportFile, mode)}
          onClose={() => setPendingImportFile(null)}
        />
      )}
    </header>
  );
}
