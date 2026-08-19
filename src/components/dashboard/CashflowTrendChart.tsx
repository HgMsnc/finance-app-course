import { CashflowChart } from '../charts/AreaBarChart';
import { cashflowByMonth } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, Transaction } from '../../types';

export function CashflowTrendChart({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const data = cashflowByMonth(transactions, 6);
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-sm font-semibold text-ink">Cashflow Trend</h3>
      <CashflowChart data={data} valueFormatter={(v) => formatCurrency(v, currency)} />
    </div>
  );
}
