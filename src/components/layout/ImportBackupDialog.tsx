import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { ImportMode } from '../../state/appStateTypes';

export function ImportBackupDialog({
  onImport,
  onClose,
}: {
  onImport: (mode: ImportMode) => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleChoice(mode: ImportMode) {
    setBusy(true);
    setError(null);
    try {
      await onImport(mode);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import backup file.');
      setBusy(false);
    }
  }

  return (
    <Modal title="Import Backup" onClose={onClose}>
      <p className="text-sm text-ink-muted">
        Replace overwrites all existing data with this backup. Merge upserts by ID and keeps everything else.
      </p>
      {error && <p className="mt-3 rounded-lg bg-negative-soft px-3 py-2 text-sm text-negative">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={() => handleChoice('merge')} disabled={busy}>
          Merge
        </Button>
        <Button variant="danger" onClick={() => handleChoice('replace')} disabled={busy}>
          Replace All
        </Button>
      </div>
    </Modal>
  );
}
