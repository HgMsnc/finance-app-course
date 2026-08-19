import type { Transaction } from '../types';

const CSV_COLUMNS: (keyof Transaction)[] = [
  'date',
  'type',
  'category',
  'description',
  'amount',
  'paymentMethod',
  'notes',
];

function escapeCsvField(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = transactions.map((t) => CSV_COLUMNS.map((col) => escapeCsvField(t[col])).join(','));
  return [header, ...rows].join('\n');
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
