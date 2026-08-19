import type { Transaction, TransactionType } from '../types';
import { compareISODates, isWithinLastNDays, startOfMonthISO, startOfYearISO, todayISO } from '../utils/dateUtils';

export type TimeframeFilter = 'all' | 'this-month' | 'last-30-days' | 'ytd';

export const TIMEFRAME_OPTIONS: { value: TimeframeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'ytd', label: 'Year-to-Date' },
];

export interface TransactionFilterState {
  type: 'all' | TransactionType;
  category: 'all' | string;
  timeframe: TimeframeFilter;
  search: string;
}

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilterState = {
  type: 'all',
  category: 'all',
  timeframe: 'all',
  search: '',
};

export function isWithinTimeframe(dateIso: string, timeframe: TimeframeFilter, asOf: string = todayISO()): boolean {
  switch (timeframe) {
    case 'all':
      return true;
    case 'this-month':
      return compareISODates(dateIso, startOfMonthISO(asOf)) >= 0 && compareISODates(dateIso, asOf) <= 0;
    case 'last-30-days':
      return isWithinLastNDays(dateIso, 30, asOf);
    case 'ytd':
      return compareISODates(dateIso, startOfYearISO(asOf)) >= 0 && compareISODates(dateIso, asOf) <= 0;
  }
}

export function filterTransactions(transactions: Transaction[], filters: TransactionFilterState): Transaction[] {
  const search = filters.search.trim().toLowerCase();
  return transactions
    .filter((t) => filters.type === 'all' || t.type === filters.type)
    .filter((t) => filters.category === 'all' || t.category === filters.category)
    .filter((t) => isWithinTimeframe(t.date, filters.timeframe))
    .filter(
      (t) =>
        !search ||
        t.description.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search) ||
        (t.notes ?? '').toLowerCase().includes(search),
    )
    .sort((a, b) => compareISODates(b.date, a.date));
}
