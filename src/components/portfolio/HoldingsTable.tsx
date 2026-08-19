import { DataTable, type Column } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../utils/formatCurrency';
import type { Currency, HoldingValuation } from '../../types';

export function HoldingsTable({
  valuations,
  currency,
  onEdit,
  onDelete,
}: {
  valuations: HoldingValuation[];
  currency: Currency;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const columns: Column<HoldingValuation>[] = [
    {
      header: 'Holding',
      render: (v) => (
        <div className="flex flex-col">
          <span className="font-medium text-ink">{v.holding.ticker}</span>
          <span className="text-xs text-ink-muted">{v.holding.companyName}</span>
        </div>
      ),
    },
    { header: 'Shares', render: (v) => v.holding.shares },
    { header: 'Avg Cost', render: (v) => formatCurrency(v.holding.avgBuyPrice, currency) },
    {
      header: 'Price',
      render: (v) => (
        <div className="flex flex-col">
          <span>{formatCurrency(v.quote.currentPrice, currency)}</span>
          <span className={v.quote.dayChange >= 0 ? 'text-xs text-positive' : 'text-xs text-negative'}>
            {formatSignedCurrency(v.quote.dayChange, currency)} ({formatPercent(v.quote.dayChangePercent)})
          </span>
        </div>
      ),
    },
    { header: 'Market Value', render: (v) => formatCurrency(v.marketValue, currency) },
    {
      header: 'Unrealized G/L',
      render: (v) => (
        <div className={`flex flex-col ${v.unrealizedGain >= 0 ? 'text-positive' : 'text-negative'}`}>
          <span>{formatSignedCurrency(v.unrealizedGain, currency)}</span>
          <span className="text-xs">{formatPercent(v.unrealizedGainPercent)}</span>
        </div>
      ),
    },
    {
      header: 'Day G/L',
      render: (v) => (
        <span className={v.dayGain >= 0 ? 'text-positive' : 'text-negative'}>{formatSignedCurrency(v.dayGain, currency)}</span>
      ),
    },
    {
      header: '',
      className: 'text-right',
      render: (v) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onEdit(v.holding.id)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => onDelete(v.holding.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={valuations} getRowKey={(v) => v.holding.id} />;
}
