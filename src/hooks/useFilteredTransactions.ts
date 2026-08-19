import { useMemo, useState } from 'react';
import type { Transaction } from '../types';
import { DEFAULT_TRANSACTION_FILTERS, filterTransactions, type TransactionFilterState } from '../services/filters';
import { useDebouncedValue } from './useDebouncedValue';

export function useFilteredTransactions(transactions: Transaction[]) {
  const [filters, setFilters] = useState<TransactionFilterState>(DEFAULT_TRANSACTION_FILTERS);
  const debouncedSearch = useDebouncedValue(filters.search, 200);

  const filtered = useMemo(
    () => filterTransactions(transactions, { ...filters, search: debouncedSearch }),
    [transactions, filters, debouncedSearch],
  );

  return { filters, setFilters, filtered };
}
