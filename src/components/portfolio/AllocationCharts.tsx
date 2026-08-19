import { DonutChart } from '../charts/DonutChart';
import { sectorBreakdown, stockBreakdown } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, HoldingValuation } from '../../types';

export function AllocationCharts({ valuations, currency }: { valuations: HoldingValuation[]; currency: Currency }) {
  const byStock = stockBreakdown(valuations).map((d) => ({ name: d.ticker, value: d.value }));
  const bySector = sectorBreakdown(valuations).map((d) => ({ name: d.sector, value: d.value }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-2 text-sm font-semibold text-ink">Allocation by Stock</h3>
        <DonutChart data={byStock} valueFormatter={(v) => formatCurrency(v, currency)} />
      </div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="mb-2 text-sm font-semibold text-ink">Allocation by Sector</h3>
        <DonutChart data={bySector} valueFormatter={(v) => formatCurrency(v, currency)} />
      </div>
    </div>
  );
}
