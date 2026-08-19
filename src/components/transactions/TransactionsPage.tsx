import { useState } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { Button } from '../ui/Button';
import { KpiCard } from '../ui/KpiCard';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { TransactionForm } from './TransactionForm';
import { useAppState } from '../../state/useAppState';
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { totalExpenses, totalIncome } from '../../services/calculations';
import { transactionsToCsv, downloadFile } from '../../services/csvExport';
import { formatCurrency, formatSignedCurrency } from '../../utils/formatCurrency';
import { todayISO } from '../../utils/dateUtils';
import type { Transaction } from '../../types';

export function TransactionsPage() {
  const { state, deleteTransaction } = useAppState();
  const { filters, setFilters, filtered } = useFilteredTransactions(state.transactions);
  const [modal, setModal] = useState<'new' | Transaction | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const income = totalIncome(filtered);
  const expenses = totalExpenses(filtered);
  const net = income - expenses;

  function handleExportCsv() {
    downloadFile(`transactions-${todayISO()}.csv`, transactionsToCsv(filtered), 'text/csv');
  }


  return (
    <PageContainer
      title="Transactions"
      actions={
        <>
          <Button variant="secondary" onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => setModal('new')}>
            Add Transaction
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Income" value={formatCurrency(income, state.currency)} valueTone="positive" />
        <KpiCard label="Total Expenses" value={formatCurrency(expenses, state.currency)} valueTone="negative" />
        <KpiCard
          label="Net Cashflow"
          value={formatSignedCurrency(net, state.currency)}
          valueTone={net >= 0 ? 'positive' : 'negative'}
        />
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try adjusting your filters, or add a new transaction to get started."
        />
      ) : (
        <TransactionTable
          transactions={filtered}
          currency={state.currency}
          onEdit={setModal}
          onDelete={setDeleteTargetId}
        />
      )}

      {modal && <TransactionForm initial={modal === 'new' ? undefined : modal} onClose={() => setModal(null)} />}

      {deleteTargetId && (
        <ConfirmDialog
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteTransaction(deleteTargetId);
            setDeleteTargetId(null);
          }}
        />
      )}
    </PageContainer>
  );
}
