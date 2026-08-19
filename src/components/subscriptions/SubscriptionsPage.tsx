import { useState } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import { KpiCard } from '../ui/KpiCard';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { UpcomingBillingTimeline } from './UpcomingBillingTimeline';
import { SubscriptionTable } from './SubscriptionTable';
import { SubscriptionForm } from './SubscriptionForm';
import { useAppState } from '../../state/useAppState';
import { monthlyBurnRate, projectedAnnualCost } from '../../services/calculations';
import { formatCurrency } from '../../utils/formatCurrency';
import type { Subscription } from '../../types';

export function SubscriptionsPage() {
  const { state, deleteSubscription, logSubscriptionPayment } = useAppState();
  const [modal, setModal] = useState<'new' | Subscription | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const activeCount = state.subscriptions.filter((s) => s.status === 'active').length;
  const burnRate = monthlyBurnRate(state.subscriptions);
  const annualCost = projectedAnnualCost(state.subscriptions);

  return (
    <PageContainer
      title="Subscriptions"
      actions={
        <Button variant="primary" onClick={() => setModal('new')}>
          Add Subscription
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Monthly Burn Rate" value={`${formatCurrency(burnRate, state.currency)}/mo`} />
        <KpiCard label="Projected Annual Cost" value={`${formatCurrency(annualCost, state.currency)}/yr`} />
        <KpiCard label="Active Subscriptions" value={String(activeCount)} />
      </div>

      <UpcomingBillingTimeline subscriptions={state.subscriptions} currency={state.currency} />

      {state.subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions yet" description="Add a subscription to start tracking recurring costs." />
      ) : (
        <SubscriptionTable
          subscriptions={state.subscriptions}
          currency={state.currency}
          onEdit={setModal}
          onDelete={setDeleteTargetId}
          onLogPayment={logSubscriptionPayment}
        />
      )}

      {modal && <SubscriptionForm initial={modal === 'new' ? undefined : modal} onClose={() => setModal(null)} />}

      {deleteTargetId && (
        <ConfirmDialog
          title="Delete Subscription"
          message="Are you sure you want to delete this subscription? This cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteSubscription(deleteTargetId);
            setDeleteTargetId(null);
          }}
        />
      )}
    </PageContainer>
  );
}
