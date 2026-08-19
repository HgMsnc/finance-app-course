import { DonutChart } from '../charts/DonutChart';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency } from '../../types';

export function AssetBreakdownChart({
  cashBalance,
  stockEquity,
  currency,
}: {
  cashBalance: number;
  stockEquity: number;
  currency: Currency;
}) {
  const data = [
    { name: 'Cash Balance', value: Math.max(cashBalance, 0) },
    { name: 'Stock Equity', value: Math.max(stockEquity, 0) },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-2 text-sm font-semibold text-ink">Asset Breakdown</h3>
      <DonutChart data={data} valueFormatter={(v) => formatCurrency(v, currency)} />
    </div>
  );
}
