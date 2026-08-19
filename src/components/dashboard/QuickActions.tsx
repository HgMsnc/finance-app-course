import { useState } from 'react';
import { Button } from '../ui/Button';
import { TransactionForm } from '../transactions/TransactionForm';
import { SubscriptionForm } from '../subscriptions/SubscriptionForm';
import { HoldingForm } from '../portfolio/HoldingForm';

type QuickAction = 'log-expense' | 'log-income' | 'add-holding' | 'add-subscription' | null;

export function QuickActions() {
  const [action, setAction] = useState<QuickAction>(null);

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-4">
      <Button variant="secondary" onClick={() => setAction('log-expense')}>
        Log Expense
      </Button>
      <Button variant="secondary" onClick={() => setAction('log-income')}>
        Log Income
      </Button>
      <Button variant="secondary" onClick={() => setAction('add-holding')}>
        Add Stock Holding
      </Button>
      <Button variant="secondary" onClick={() => setAction('add-subscription')}>
        Add Subscription
      </Button>

      {(action === 'log-expense' || action === 'log-income') && (
        <TransactionForm defaultType={action === 'log-income' ? 'income' : 'expense'} onClose={() => setAction(null)} />
      )}
      {action === 'add-holding' && <HoldingForm onClose={() => setAction(null)} />}
      {action === 'add-subscription' && <SubscriptionForm onClose={() => setAction(null)} />}
    </div>
  );
}
