import type { BillingCycle } from '../types';

// All ISO dates are treated as UTC-midnight instants so calendar math never drifts
// across local timezone boundaries (e.g. evaluating "today" near midnight).

function toUtcMs(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtcMs(ms: number): string {
  const date = new Date(ms);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function toISODate(date: Date): string {
  return fromUtcMs(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  return fromUtcMs(toUtcMs(iso) + days * 86_400_000);
}

const MS_PER_DAY = 86_400_000;
const EPOCH_MS = Date.UTC(1970, 0, 1);

export function daysSinceEpoch(iso: string): number {
  return Math.floor((toUtcMs(iso) - EPOCH_MS) / MS_PER_DAY);
}

export function compareISODates(a: string, b: string): number {
  return toUtcMs(a) - toUtcMs(b);
}

export function addMonthsClamped(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const targetMonthIndex = m - 1 + months;
  const targetYear = y + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const clampedDay = Math.min(d, daysInTargetMonth);
  return fromUtcMs(Date.UTC(targetYear, targetMonth, clampedDay));
}

export function advanceBillingDate(iso: string, cycle: BillingCycle): string {
  const monthsToAdd = cycle === 'monthly' ? 1 : cycle === 'quarterly' ? 3 : 12;
  return addMonthsClamped(iso, monthsToAdd);
}

export function yearMonth(iso: string): string {
  return iso.slice(0, 7);
}

export function startOfMonthISO(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export function startOfYearISO(iso: string): string {
  return `${iso.slice(0, 4)}-01-01`;
}

export function isWithinLastNDays(iso: string, n: number, asOf: string = todayISO()): boolean {
  const diffDays = (toUtcMs(asOf) - toUtcMs(iso)) / MS_PER_DAY;
  return diffDays >= 0 && diffDays < n;
}

export function daysUntil(iso: string, asOf: string = todayISO()): number {
  return Math.round((toUtcMs(iso) - toUtcMs(asOf)) / MS_PER_DAY);
}

/** Last N months as 'YYYY-MM' strings, oldest first, ending with the current month. */
export function lastNMonths(n: number, asOf: string = todayISO()): string[] {
  const [y, m] = asOf.split('-').map(Number);
  const months: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const idx = (m - 1) - i;
    const year = y + Math.floor(idx / 12);
    const month = ((idx % 12) + 12) % 12;
    months.push(`${year}-${String(month + 1).padStart(2, '0')}`);
  }
  return months;
}
