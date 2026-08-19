import { DonutChart } from '../charts/DonutChart';
import { categoryBreakdown } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, Transaction } from '../../types';

export function ExpenseBreakdownChart({ transactions, currency }: { transactions: Transaction[]; currency: Currency }) {
  const data = categoryBreakdown(transactions, 'expense').map((c) => ({ name: c.category, value: c.total }));
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-sm font-semibold text-ink">Expense Breakdown</h3>
      <DonutChart data={data} valueFormatter={(v) => formatCurrency(v, currency)} />
    </div>
  );
}
