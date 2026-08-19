import type { HoldingValuation, StockHolding, StockQuote, Subscription, Transaction } from '../types';
import { getQuote } from './priceEngine';
import { lastNMonths, yearMonth } from '../utils/dateUtils';

export function totalIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

export function totalExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function monthlyIncome(transactions: Transaction[], month: string): number {
  return totalIncome(transactions.filter((t) => yearMonth(t.date) === month));
}

export function monthlyExpenses(transactions: Transaction[], month: string): number {
  return totalExpenses(transactions.filter((t) => yearMonth(t.date) === month));
}

export function savingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return ((income - expenses) / income) * 100;
}

const MONTHLY_MULTIPLIER: Record<Subscription['billingCycle'], number> = {
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

export function monthlyBurnRate(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount * MONTHLY_MULTIPLIER[s.billingCycle], 0);
}

export function projectedAnnualCost(subscriptions: Subscription[]): number {
  return monthlyBurnRate(subscriptions) * 12;
}

export function valuateHolding(holding: StockHolding, quote: StockQuote = getQuote(holding.ticker)): HoldingValuation {
  const marketValue = holding.shares * quote.currentPrice;
  const costBasis = holding.shares * holding.avgBuyPrice;
  const unrealizedGain = marketValue - costBasis;
  const unrealizedGainPercent = costBasis === 0 ? 0 : (unrealizedGain / costBasis) * 100;
  const dayGain = holding.shares * quote.dayChange;
  return { holding, quote, marketValue, costBasis, unrealizedGain, unrealizedGainPercent, dayGain };
}

export function valuatePortfolio(holdings: StockHolding[]): HoldingValuation[] {
  return holdings.map((h) => valuateHolding(h));
}

export function portfolioTotals(valuations: HoldingValuation[]) {
  const totalValue = valuations.reduce((sum, v) => sum + v.marketValue, 0);
  const totalCostBasis = valuations.reduce((sum, v) => sum + v.costBasis, 0);
  const totalGain = totalValue - totalCostBasis;
  const totalGainPercent = totalCostBasis === 0 ? 0 : (totalGain / totalCostBasis) * 100;
  const totalDayGain = valuations.reduce((sum, v) => sum + v.dayGain, 0);
  return { totalValue, totalCostBasis, totalGain, totalGainPercent, totalDayGain };
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export function categoryBreakdown(transactions: Transaction[], type: Transaction['type']): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== type) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function sectorBreakdown(valuations: HoldingValuation[]) {
  const totals = new Map<string, number>();
  for (const v of valuations) {
    totals.set(v.holding.sector, (totals.get(v.holding.sector) ?? 0) + v.marketValue);
  }
  return [...totals.entries()]
    .map(([sector, value]) => ({ sector, value }))
    .sort((a, b) => b.value - a.value);
}

export function stockBreakdown(valuations: HoldingValuation[]) {
  return valuations
    .map((v) => ({ ticker: v.holding.ticker, value: v.marketValue }))
    .sort((a, b) => b.value - a.value);
}

export interface MonthlyCashflow {
  month: string;
  income: number;
  expenses: number;
}

export function cashflowByMonth(transactions: Transaction[], months = 6): MonthlyCashflow[] {
  return lastNMonths(months).map((month) => ({
    month,
    income: monthlyIncome(transactions, month),
    expenses: monthlyExpenses(transactions, month),
  }));
}

export function netWorth(transactions: Transaction[], portfolioValue: number): number {
  return totalIncome(transactions) - totalExpenses(transactions) + portfolioValue;
}
