import { describe, expect, it } from 'vitest';
import { appReducer, initialAppState } from './appReducer';
import type { Subscription, Transaction } from '../types';

const subscription: Subscription = {
  id: 'sub-1',
  name: 'Netflix',
  category: 'Subscriptions & SaaS',
  amount: 15.99,
  billingCycle: 'monthly',
  nextBillingDate: '2026-08-31',
  status: 'active',
  autoRenew: true,
};

describe('appReducer', () => {
  it('adds, updates, and deletes transactions', () => {
    const transaction: Transaction = {
      id: 't1',
      type: 'expense',
      amount: 50,
      category: 'Dining & Cafes',
      description: 'Lunch',
      date: '2026-08-01',
      paymentMethod: 'Cash',
    };
    let state = appReducer(initialAppState, { type: 'ADD_TRANSACTION', payload: transaction });
    expect(state.transactions).toHaveLength(1);

    const updated = { ...transaction, amount: 75 };
    state = appReducer(state, { type: 'UPDATE_TRANSACTION', payload: updated });
    expect(state.transactions[0].amount).toBe(75);

    state = appReducer(state, { type: 'DELETE_TRANSACTION', payload: { id: 't1' } });
    expect(state.transactions).toHaveLength(0);
  });

  it('logs a subscription payment as a transaction and advances the next billing date, clamped at month-end', () => {
    const stateWithSub = { ...initialAppState, subscriptions: [subscription] };
    const transaction: Transaction = {
      id: 'tx-log',
      type: 'expense',
      amount: 15.99,
      category: 'Subscriptions & SaaS',
      description: 'Netflix subscription',
      date: '2026-08-19',
      paymentMethod: 'Credit Card',
      isSubscription: true,
    };
    const nextBillingDate = '2026-09-30';

    const state = appReducer(stateWithSub, {
      type: 'LOG_SUBSCRIPTION_PAYMENT',
      payload: { subscriptionId: 'sub-1', transaction, nextBillingDate },
    });

    expect(state.transactions).toContainEqual(transaction);
    expect(state.subscriptions[0].nextBillingDate).toBe('2026-09-30');
  });

  it('merges imported state by id without dropping existing records', () => {
    const existing = {
      ...initialAppState,
      transactions: [{ id: 'keep', type: 'income', amount: 1, category: 'Other Income', description: 'x', date: '2026-01-01', paymentMethod: 'Cash' } as Transaction],
    };
    const incoming = {
      transactions: [{ id: 'new', type: 'expense', amount: 2, category: 'Other Expense', description: 'y', date: '2026-01-02', paymentMethod: 'Cash' } as Transaction],
      subscriptions: [],
      holdings: [],
      currency: 'EUR' as const,
    };
    const state = appReducer(existing, { type: 'MERGE_STATE', payload: incoming });
    expect(state.transactions.map((t) => t.id).sort()).toEqual(['keep', 'new']);
    expect(state.currency).toBe('EUR');
  });
});
