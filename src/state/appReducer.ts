import type { AppState } from '../types';
import type { Action } from './actions';

export const initialAppState: AppState = {
  transactions: [],
  subscriptions: [],
  holdings: [],
  currency: 'USD',
};

function upsertById<T extends { id: string }>(items: T[], next: T): T[] {
  const index = items.findIndex((item) => item.id === next.id);
  if (index === -1) return [...items, next];
  const copy = items.slice();
  copy[index] = next;
  return copy;
}

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of incoming) byId.set(item.id, item);
  return [...byId.values()];
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
    case 'REPLACE_STATE':
      return action.payload;

    case 'MERGE_STATE':
      return {
        transactions: mergeById(state.transactions, action.payload.transactions),
        subscriptions: mergeById(state.subscriptions, action.payload.subscriptions),
        holdings: mergeById(state.holdings, action.payload.holdings),
        currency: action.payload.currency ?? state.currency,
      };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: upsertById(state.transactions, action.payload) };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload.id) };

    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };
    case 'UPDATE_SUBSCRIPTION':
      return { ...state, subscriptions: upsertById(state.subscriptions, action.payload) };
    case 'DELETE_SUBSCRIPTION':
      return { ...state, subscriptions: state.subscriptions.filter((s) => s.id !== action.payload.id) };

    case 'LOG_SUBSCRIPTION_PAYMENT':
      return {
        ...state,
        transactions: [...state.transactions, action.payload.transaction],
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload.subscriptionId ? { ...s, nextBillingDate: action.payload.nextBillingDate } : s,
        ),
      };

    case 'ADD_HOLDING':
      return { ...state, holdings: [...state.holdings, action.payload] };
    case 'UPDATE_HOLDING':
      return { ...state, holdings: upsertById(state.holdings, action.payload) };
    case 'DELETE_HOLDING':
      return { ...state, holdings: state.holdings.filter((h) => h.id !== action.payload.id) };

    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };

    default:
      return state;
  }
}
