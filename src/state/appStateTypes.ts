import { createContext } from 'react';
import type { AppState, Currency, StockHolding, Subscription, Transaction } from '../types';

export type ImportMode = 'replace' | 'merge';

export interface AppStateApi {
  state: AppState;
  status: 'loading' | 'ready';
  addTransaction: (input: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addSubscription: (input: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (subscription: Subscription) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  logSubscriptionPayment: (subscription: Subscription) => Promise<void>;
  addHolding: (input: Omit<StockHolding, 'id'>) => Promise<void>;
  updateHolding: (holding: StockHolding) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
  setCurrency: (currency: Currency) => Promise<void>;
  exportBackup: () => void;
  importBackup: (file: File, mode: ImportMode) => Promise<void>;
}

export const AppStateContext = createContext<AppStateApi | null>(null);
