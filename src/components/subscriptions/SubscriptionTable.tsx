import { DataTable, type Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, Subscription } from '../../types';

const CYCLE_LABEL: Record<Subscription['billingCycle'], string> = {
  monthly: '/mo',
  quarterly: '/qtr',
  yearly: '/yr',
};

export function SubscriptionTable({
  subscriptions,
  currency,
  onEdit,
  onDelete,
  onLogPayment,
}: {
  subscriptions: Subscription[];
  currency: Currency;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onLogPayment: (subscription: Subscription) => void;
}) {
  const columns: Column<Subscription>[] = [
    { header: 'Name', render: (s) => <span className="font-medium text-ink">{s.name}</span> },
    { header: 'Category', render: (s) => s.category },
    { header: 'Amount', render: (s) => `${formatCurrency(s.amount, currency)}${CYCLE_LABEL[s.billingCycle]}` },
    { header: 'Next Billing', render: (s) => s.nextBillingDate },
    { header: 'Status', render: (s) => <Badge tone={s.status === 'active' ? 'positive' : 'neutral'}>{s.status}</Badge> },
    { header: 'Auto-Renew', render: (s) => (s.autoRenew ? 'Yes' : 'No') },
    {
      header: '',
      className: 'text-right',
      render: (s) => (
        <div className="flex justify-end gap-2">
          {s.status === 'active' && (
            <Button variant="secondary" onClick={() => onLogPayment(s)}>
              Log as Expense
            </Button>
          )}
          <Button variant="ghost" onClick={() => onEdit(s)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => onDelete(s.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={subscriptions} getRowKey={(s) => s.id} />;
}
