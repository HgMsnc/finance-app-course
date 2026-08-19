import { useContext } from 'react';
import { AppStateContext, type AppStateApi } from './appStateTypes';

export function useAppState(): AppStateApi {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
