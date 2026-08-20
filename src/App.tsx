import { useState } from 'react';
import { AppStateProvider } from './state/AppStateContext';
import { ThemeProvider } from './state/ThemeProvider';
import { useAppState } from './state/useAppState';
import { TopNav } from './components/layout/TopNav';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { TransactionsPage } from './components/transactions/TransactionsPage';
import { SubscriptionsPage } from './components/subscriptions/SubscriptionsPage';
import { PortfolioPage } from './components/portfolio/PortfolioPage';

export type TabId = 'dashboard' | 'transactions' | 'subscriptions' | 'portfolio';

function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { status } = useAppState();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-ink-muted">Loading your finances…</div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'transactions' && <TransactionsPage />}
      {activeTab === 'subscriptions' && <SubscriptionsPage />}
      {activeTab === 'portfolio' && <PortfolioPage />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppShell />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
