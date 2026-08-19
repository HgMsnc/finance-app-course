import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { daysUntil } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Currency, Subscription } from '../../types';

function countdownLabel(days: number): { label: string; tone: 'neutral' | 'positive' | 'negative' } {
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'negative' };
  if (days === 0) return { label: 'Due today', tone: 'negative' };
  if (days <= 3) return { label: `in ${days}d`, tone: 'negative' };
  if (days <= 7) return { label: `in ${days}d`, tone: 'neutral' };
  return { label: `in ${days}d`, tone: 'positive' };
}

export function UpcomingBillingTimeline({ subscriptions, currency }: { subscriptions: Subscription[]; currency: Currency }) {
  const upcoming = subscriptions
    .filter((s) => s.status === 'active')
    .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate));

  if (upcoming.length === 0) {
    return <EmptyState title="No upcoming bills" description="Active subscriptions will appear here as a countdown." />;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-ink">Upcoming Billing</h3>
      <ul className="flex flex-col divide-y divide-border">
        {upcoming.map((s) => {
          const countdown = countdownLabel(daysUntil(s.nextBillingDate));
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">{s.name}</span>
                <span className="text-xs text-ink-muted">{s.nextBillingDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-ink">{formatCurrency(s.amount, currency)}</span>
                <Badge tone={countdown.tone}>{countdown.label}</Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
