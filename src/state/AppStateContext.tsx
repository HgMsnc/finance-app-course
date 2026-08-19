import { useEffect, useReducer, useState, type ReactNode } from 'react';
import type { StockHolding, Subscription, Transaction } from '../types';
import { appReducer, initialAppState } from './appReducer';
import { AppStateContext, type AppStateApi } from './appStateTypes';
import * as repository from '../db/repository';
import { buildDemoState } from '../db/seed';
import { newId } from '../utils/id';
import { todayISO, advanceBillingDate } from '../utils/dateUtils';
import { exportStateToJson, readBackupFile } from '../services/jsonBackup';
import { downloadFile } from '../services/csvExport';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    let cancelled = false;
    repository.loadOrSeed(buildDemoState).then((loaded) => {
      if (cancelled) return;
      dispatch({ type: 'LOAD_STATE', payload: loaded });
      setStatus('ready');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const api: AppStateApi = {
    state,
    status,

    async addTransaction(input) {
      const transaction: Transaction = { ...input, id: newId() };
      await repository.putTransaction(transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    },

    async updateTransaction(transaction) {
      await repository.putTransaction(transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    },

    async deleteTransaction(id) {
      await repository.deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });
    },

    async addSubscription(input) {
      const subscription: Subscription = { ...input, id: newId() };
      await repository.putSubscription(subscription);
      dispatch({ type: 'ADD_SUBSCRIPTION', payload: subscription });
    },

    async updateSubscription(subscription) {
      await repository.putSubscription(subscription);
      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: subscription });
    },

    async deleteSubscription(id) {
      await repository.deleteSubscription(id);
      dispatch({ type: 'DELETE_SUBSCRIPTION', payload: { id } });
    },

    async logSubscriptionPayment(subscription) {
      const transaction: Transaction = {
        id: newId(),
        type: 'expense',
        amount: subscription.amount,
        category: subscription.category,
        description: `${subscription.name} subscription`,
        date: todayISO(),
        paymentMethod: 'Credit Card',
        isSubscription: true,
      };
      const nextBillingDate = advanceBillingDate(subscription.nextBillingDate, subscription.billingCycle);
      await repository.putTransaction(transaction);
      await repository.putSubscription({ ...subscription, nextBillingDate });
      dispatch({
        type: 'LOG_SUBSCRIPTION_PAYMENT',
        payload: { subscriptionId: subscription.id, transaction, nextBillingDate },
      });
    },

    async addHolding(input) {
      const holding: StockHolding = { ...input, id: newId() };
      await repository.putHolding(holding);
      dispatch({ type: 'ADD_HOLDING', payload: holding });
    },

    async updateHolding(holding) {
      await repository.putHolding(holding);
      dispatch({ type: 'UPDATE_HOLDING', payload: holding });
    },

    async deleteHolding(id) {
      await repository.deleteHolding(id);
      dispatch({ type: 'DELETE_HOLDING', payload: { id } });
    },

    async setCurrency(currency) {
      await repository.setCurrency(currency);
      dispatch({ type: 'SET_CURRENCY', payload: currency });
    },

    exportBackup() {
      const json = exportStateToJson(state);
      downloadFile(`finance-tracker-backup-${todayISO()}.json`, json, 'application/json');
    },

    async importBackup(file, mode) {
      const imported = await readBackupFile(file);
      if (mode === 'replace') {
        await repository.replaceAllState(imported);
        dispatch({ type: 'REPLACE_STATE', payload: imported });
      } else {
        await repository.mergeState(imported);
        dispatch({ type: 'MERGE_STATE', payload: imported });
      }
    },
  };

  return <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>;
}
