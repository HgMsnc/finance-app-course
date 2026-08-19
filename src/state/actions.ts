import type { AppState, Currency, StockHolding, Subscription, Transaction } from '../types';

export type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'DELETE_SUBSCRIPTION'; payload: { id: string } }
  | {
      type: 'LOG_SUBSCRIPTION_PAYMENT';
      payload: { subscriptionId: string; transaction: Transaction; nextBillingDate: string };
    }
  | { type: 'ADD_HOLDING'; payload: StockHolding }
  | { type: 'UPDATE_HOLDING'; payload: StockHolding }
  | { type: 'DELETE_HOLDING'; payload: { id: string } }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'REPLACE_STATE'; payload: AppState }
  | { type: 'MERGE_STATE'; payload: AppState };
