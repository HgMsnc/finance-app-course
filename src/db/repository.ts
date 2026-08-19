import { openDb } from './schema';
import type { AppState, Currency, StockHolding, Subscription, Transaction } from '../types';

const DEFAULT_CURRENCY: Currency = 'USD';
const STORE_NAMES = ['transactions', 'subscriptions', 'holdings', 'meta'] as const;

export async function isSeeded(): Promise<boolean> {
  const db = await openDb();
  const record = await db.get('meta', 'seeded');
  return Boolean(record?.value);
}

export async function getCurrency(): Promise<Currency> {
  const db = await openDb();
  const record = await db.get('meta', 'currency');
  return (record?.value as Currency | undefined) ?? DEFAULT_CURRENCY;
}

export async function setCurrency(currency: Currency): Promise<void> {
  const db = await openDb();
  await db.put('meta', { key: 'currency', value: currency });
}

export async function loadAppState(): Promise<AppState> {
  const db = await openDb();
  const [transactions, subscriptions, holdings, currency] = await Promise.all([
    db.getAll('transactions'),
    db.getAll('subscriptions'),
    db.getAll('holdings'),
    getCurrency(),
  ]);
  return { transactions, subscriptions, holdings, currency };
}

export async function putTransaction(transaction: Transaction): Promise<void> {
  const db = await openDb();
  await db.put('transactions', transaction);
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await openDb();
  await db.delete('transactions', id);
}

export async function putSubscription(subscription: Subscription): Promise<void> {
  const db = await openDb();
  await db.put('subscriptions', subscription);
}

export async function deleteSubscription(id: string): Promise<void> {
  const db = await openDb();
  await db.delete('subscriptions', id);
}

export async function putHolding(holding: StockHolding): Promise<void> {
  const db = await openDb();
  await db.put('holdings', holding);
}

export async function deleteHolding(id: string): Promise<void> {
  const db = await openDb();
  await db.delete('holdings', id);
}

/** Atomically clears every store and rewrites it from `state` (used by first-run seeding and JSON "Replace" import). */
export async function replaceAllState(state: AppState): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAMES, 'readwrite');
  const transactionsStore = tx.objectStore('transactions');
  const subscriptionsStore = tx.objectStore('subscriptions');
  const holdingsStore = tx.objectStore('holdings');
  const metaStore = tx.objectStore('meta');

  transactionsStore.clear();
  subscriptionsStore.clear();
  holdingsStore.clear();
  for (const t of state.transactions) transactionsStore.put(t);
  for (const s of state.subscriptions) subscriptionsStore.put(s);
  for (const h of state.holdings) holdingsStore.put(h);
  metaStore.put({ key: 'currency', value: state.currency });
  metaStore.put({ key: 'seeded', value: true });

  await tx.done;
}

/** Upserts every record in `state` by id, leaving existing records that aren't present untouched (used by JSON "Merge" import). */
export async function mergeState(state: AppState): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAMES, 'readwrite');
  const transactionsStore = tx.objectStore('transactions');
  const subscriptionsStore = tx.objectStore('subscriptions');
  const holdingsStore = tx.objectStore('holdings');
  const metaStore = tx.objectStore('meta');

  for (const t of state.transactions) transactionsStore.put(t);
  for (const s of state.subscriptions) subscriptionsStore.put(s);
  for (const h of state.holdings) holdingsStore.put(h);
  metaStore.put({ key: 'currency', value: state.currency });
  metaStore.put({ key: 'seeded', value: true });

  await tx.done;
}

/** Loads existing state, or seeds and persists demo data on first run. Returns the resulting state either way. */
export async function loadOrSeed(buildDemoState: () => AppState): Promise<AppState> {
  if (await isSeeded()) {
    return loadAppState();
  }
  const demo = buildDemoState();
  await replaceAllState(demo);
  return demo;
}
