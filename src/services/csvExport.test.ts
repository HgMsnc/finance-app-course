import { describe, expect, it } from 'vitest';
import { transactionsToCsv } from './csvExport';
import type { Transaction } from '../types';

describe('csvExport', () => {
  it('produces a header row plus one row per transaction', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 42.5,
        category: 'Food & Groceries',
        description: 'Trader Joe\'s',
        date: '2026-08-01',
        paymentMethod: 'Debit Card',
      },
    ];
    const csv = transactionsToCsv(transactions);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('date,type,category,description,amount,paymentMethod,notes');
    expect(lines[1]).toBe('2026-08-01,expense,Food & Groceries,Trader Joe\'s,42.5,Debit Card,');
  });

  it('quotes and escapes fields containing commas, quotes, or newlines', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 10,
        category: 'Other Expense',
        description: 'Gift for "mom", with love',
        date: '2026-08-01',
        paymentMethod: 'Cash',
        notes: 'line1\nline2',
      },
    ];
    const csv = transactionsToCsv(transactions);
    expect(csv).toContain('"Gift for ""mom"", with love"');
    expect(csv).toContain('"line1\nline2"');
  });
});
