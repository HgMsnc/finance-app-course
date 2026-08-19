import { useMemo, useState } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import { KpiCard } from '../ui/KpiCard';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { HoldingsTable } from './HoldingsTable';
import { AllocationCharts } from './AllocationCharts';
import { HoldingForm } from './HoldingForm';
import { useAppState } from '../../state/useAppState';
import { portfolioTotals, valuatePortfolio } from '../../services/calculations';
import { formatCurrency, formatPercent, formatSignedCurrency } from '../../utils/formatCurrency';

export function PortfolioPage() {
  const { state, deleteHolding } = useAppState();
  const [modal, setModal] = useState<'new' | 'closed' | string>('closed');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const valuations = useMemo(() => valuatePortfolio(state.holdings), [state.holdings]);
  const totals = portfolioTotals(valuations);
  const editingHolding = state.holdings.find((h) => h.id === modal);

  return (
    <PageContainer
      title="Portfolio"
      actions={
        <Button variant="primary" onClick={() => setModal('new')}>
          Add Stock Holding
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Value" value={formatCurrency(totals.totalValue, state.currency)} />
        <KpiCard label="Cost Basis" value={formatCurrency(totals.totalCostBasis, state.currency)} />
        <KpiCard
          label="Unrealized G/L"
          value={formatSignedCurrency(totals.totalGain, state.currency)}
          valueTone={totals.totalGain >= 0 ? 'positive' : 'negative'}
          delta={formatPercent(totals.totalGainPercent)}
          deltaTone={totals.totalGain >= 0 ? 'positive' : 'negative'}
        />
        <KpiCard
          label="Day G/L"
          value={formatSignedCurrency(totals.totalDayGain, state.currency)}
          valueTone={totals.totalDayGain >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {valuations.length === 0 ? (
        <EmptyState title="No holdings yet" description="Add a stock holding to start tracking your portfolio." />
      ) : (
        <>
          <HoldingsTable
            valuations={valuations}
            currency={state.currency}
            onEdit={setModal}
            onDelete={setDeleteTargetId}
          />
          <AllocationCharts valuations={valuations} currency={state.currency} />
        </>
      )}

      {modal !== 'closed' && (
        <HoldingForm initial={modal === 'new' ? undefined : editingHolding} onClose={() => setModal('closed')} />
      )}

      {deleteTargetId && (
        <ConfirmDialog
          title="Delete Holding"
          message="Are you sure you want to delete this holding? This cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteHolding(deleteTargetId);
            setDeleteTargetId(null);
          }}
        />
      )}
    </PageContainer>
  );
}
