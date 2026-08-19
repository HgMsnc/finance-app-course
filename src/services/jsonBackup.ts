import type { AppState } from '../types';
import { CURRENCIES } from '../constants/categories';

export const BACKUP_FORMAT_VERSION = 1;

export interface BackupFile {
  version: number;
  exportedAt: string;
  data: AppState;
}

export function exportStateToJson(state: AppState): string {
  const backup: BackupFile = {
    version: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  return JSON.stringify(backup, null, 2);
}

function isValidAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.transactions) &&
    Array.isArray(candidate.subscriptions) &&
    Array.isArray(candidate.holdings) &&
    typeof candidate.currency === 'string' &&
    (CURRENCIES as readonly string[]).includes(candidate.currency)
  );
}

export async function readBackupFile(file: File): Promise<AppState> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }

  const candidate =
    parsed && typeof parsed === 'object' && 'data' in (parsed as Record<string, unknown>)
      ? (parsed as BackupFile).data
      : parsed;

  if (!isValidAppState(candidate)) {
    throw new Error('That file does not contain a recognizable backup of this app’s data.');
  }

  return candidate;
}
