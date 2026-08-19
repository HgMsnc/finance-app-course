import { useMemo } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { KpiCard } from '../ui/KpiCard';
import { QuickActions } from './QuickActions';
import { CashflowTrendChart } from './CashflowTrendChart';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { AssetBreakdownChart } from './AssetBreakdownChart';
import { useAppState } from '../../state/useAppState';
import {
  monthlyExpenses,
  monthlyIncome,
  netWorth,
  portfolioTotals,
  savingsRate,
  totalExpenses,
  totalIncome,
  valuatePortfolio,
} from '../../services/calculations';
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../utils/formatCurrency';
import { todayISO, yearMonth } from '../../utils/dateUtils';

export function DashboardPage() {
  const { state } = useAppState();

  const valuations = useMemo(() => valuatePortfolio(state.holdings), [state.holdings]);
  const portfolio = portfolioTotals(valuations);

  const cashBalance = totalIncome(state.transactions) - totalExpenses(state.transactions);
  const netWorthValue = netWorth(state.transactions, portfolio.totalValue);

  const currentMonth = yearMonth(todayISO());
  const monthIncome = monthlyIncome(state.transactions, currentMonth);
  const monthExpenses = monthlyExpenses(state.transactions, currentMonth);
  const monthNet = monthIncome - monthExpenses;
  const savings = savingsRate(monthIncome, monthExpenses);

  return (
    <PageContainer title="Dashboard">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Net Worth" value={formatCurrency(netWorthValue, state.currency)} />
        <KpiCard
          label="Savings Rate (This Month)"
          value={formatPercent(savings, 0)}
          valueTone={savings >= 0 ? 'positive' : 'negative'}
        />
        <KpiCard
          label="Net Cashflow (This Month)"
          value={formatSignedCurrency(monthNet, state.currency)}
          valueTone={monthNet >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <QuickActions />

      <CashflowTrendChart transactions={state.transactions} currency={state.currency} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ExpenseBreakdownChart transactions={state.transactions} currency={state.currency} />
        <AssetBreakdownChart cashBalance={cashBalance} stockEquity={portfolio.totalValue} currency={state.currency} />
      </div>
    </PageContainer>
  );
}
