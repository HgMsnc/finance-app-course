import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { StockHolding, Subscription, Transaction } from '../types';

export const DB_NAME = 'finance-tracker';
export const DB_VERSION = 1;

export interface MetaRecord {
  key: string;
  value: unknown;
}

export interface FinanceDBSchema extends DBSchema {
  transactions: { key: string; value: Transaction };
  subscriptions: { key: string; value: Subscription };
  holdings: { key: string; value: StockHolding };
  meta: { key: string; value: MetaRecord };
}

let dbPromise: Promise<IDBPDatabase<FinanceDBSchema>> | null = null;

export function openDb(): Promise<IDBPDatabase<FinanceDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<FinanceDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('subscriptions')) {
          db.createObjectStore('subscriptions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('holdings')) {
          db.createObjectStore('holdings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}
