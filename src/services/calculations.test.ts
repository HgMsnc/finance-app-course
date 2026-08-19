import { describe, expect, it } from 'vitest';
import {
  categoryBreakdown,
  monthlyBurnRate,
  netWorth,
  portfolioTotals,
  projectedAnnualCost,
  savingsRate,
  totalExpenses,
  totalIncome,
  valuateHolding,
} from './calculations';
import type { StockHolding, StockQuote, Subscription, Transaction } from '../types';

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: 'id',
    type: 'expense',
    amount: 100,
    category: 'Other Expense',
    description: 'test',
    date: '2026-08-01',
    paymentMethod: 'Cash',
    ...overrides,
  };
}

describe('calculations', () => {
  it('sums income and expenses independently', () => {
    const transactions = [
      tx({ type: 'income', amount: 1000 }),
      tx({ type: 'expense', amount: 400 }),
      tx({ type: 'expense', amount: 100 }),
    ];
    expect(totalIncome(transactions)).toBe(1000);
    expect(totalExpenses(transactions)).toBe(500);
  });

  it('computes savings rate as a percentage, guarding against zero income', () => {
    expect(savingsRate(1000, 600)).toBeCloseTo(40, 5);
    expect(savingsRate(0, 100)).toBe(0);
  });

  it('normalizes subscription billing cycles to a monthly burn rate', () => {
    const subs: Subscription[] = [
      { id: '1', name: 'A', category: 'x', amount: 12, billingCycle: 'monthly', nextBillingDate: '2026-09-01', status: 'active', autoRenew: true },
      { id: '2', name: 'B', category: 'x', amount: 120, billingCycle: 'yearly', nextBillingDate: '2026-09-01', status: 'active', autoRenew: true },
      { id: '3', name: 'C', category: 'x', amount: 30, billingCycle: 'quarterly', nextBillingDate: '2026-09-01', status: 'active', autoRenew: true },
      { id: '4', name: 'D', category: 'x', amount: 999, billingCycle: 'monthly', nextBillingDate: '2026-09-01', status: 'paused', autoRenew: true },
    ];
    expect(monthlyBurnRate(subs)).toBeCloseTo(12 + 10 + 10, 5);
    expect(projectedAnnualCost(subs)).toBeCloseTo((12 + 10 + 10) * 12, 5);
  });

  it('values a holding against a quote', () => {
    const holding: StockHolding = {
      id: '1',
      ticker: 'AAPL',
      companyName: 'Apple',
      shares: 10,
      avgBuyPrice: 100,
      buyDate: '2026-01-01',
      sector: 'Technology',
    };
    const quote: StockQuote = {
      ticker: 'AAPL',
      name: 'Apple',
      currentPrice: 120,
      closingPrice: 110,
      dayChange: 10,
      dayChangePercent: 9.09,
      sector: 'Technology',
      lastUpdated: '2026-08-01',
    };
    const valuation = valuateHolding(holding, quote);
    expect(valuation.marketValue).toBe(1200);
    expect(valuation.costBasis).toBe(1000);
    expect(valuation.unrealizedGain).toBe(200);
    expect(valuation.unrealizedGainPercent).toBeCloseTo(20, 5);
    expect(valuation.dayGain).toBe(100);
  });

  it('rolls up portfolio totals across holdings', () => {
    const holding: StockHolding = { id: '1', ticker: 'X', companyName: 'X', shares: 1, avgBuyPrice: 50, buyDate: '2026-01-01', sector: 'Technology' };
    const quote: StockQuote = { ticker: 'X', name: 'X', currentPrice: 60, closingPrice: 55, dayChange: 5, dayChangePercent: 9, sector: 'Technology', lastUpdated: '2026-08-01' };
    const totals = portfolioTotals([valuateHolding(holding, quote)]);
    expect(totals.totalValue).toBe(60);
    expect(totals.totalCostBasis).toBe(50);
    expect(totals.totalGain).toBe(10);
    expect(totals.totalDayGain).toBe(5);
  });

  it('groups transactions by category for a given type', () => {
    const transactions = [
      tx({ type: 'expense', category: 'Food & Groceries', amount: 50 }),
      tx({ type: 'expense', category: 'Food & Groceries', amount: 25 }),
      tx({ type: 'expense', category: 'Dining & Cafes', amount: 10 }),
      tx({ type: 'income', category: 'Salary & Wages', amount: 5000 }),
    ];
    expect(categoryBreakdown(transactions, 'expense')).toEqual([
      { category: 'Food & Groceries', total: 75 },
      { category: 'Dining & Cafes', total: 10 },
    ]);
  });

  it('computes net worth as cash position plus portfolio value', () => {
    const transactions = [tx({ type: 'income', amount: 1000 }), tx({ type: 'expense', amount: 300 })];
    expect(netWorth(transactions, 5000)).toBe(1000 - 300 + 5000);
  });
});
