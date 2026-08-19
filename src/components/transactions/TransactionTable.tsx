import { DataTable, type Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, Transaction } from '../../types';

export function TransactionTable({
  transactions,
  currency,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  currency: Currency;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const columns: Column<Transaction>[] = [
    { header: 'Date', render: (t) => t.date },
    { header: 'Type', render: (t) => <Badge tone={t.type === 'income' ? 'positive' : 'negative'}>{t.type}</Badge> },
    { header: 'Category', render: (t) => t.category },
    {
      header: 'Description',
      render: (t) => (
        <div className="flex flex-col">
          <span>{t.description}</span>
          {t.notes && <span className="text-xs text-ink-muted">{t.notes}</span>}
        </div>
      ),
    },
    { header: 'Payment', render: (t) => t.paymentMethod },
    {
      header: 'Amount',
      className: 'text-right font-medium',
      render: (t) => (
        <span className={t.type === 'income' ? 'text-positive' : 'text-negative'}>
          {t.type === 'income' ? '+' : '-'}
          {formatCurrency(t.amount, currency)}
        </span>
      ),
    },
    {
      header: '',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onEdit(t)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => onDelete(t.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={transactions} getRowKey={(t) => t.id} />;
}
