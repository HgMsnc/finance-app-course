import { useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../../constants/categories';
import { useAppState } from '../../state/useAppState';
import { todayISO } from '../../utils/dateUtils';
import type { PaymentMethod, Transaction, TransactionType } from '../../types';

export function TransactionForm({
  initial,
  defaultType = 'expense',
  onClose,
}: {
  initial?: Transaction;
  defaultType?: TransactionType;
  onClose: () => void;
}) {
  const { addTransaction, updateTransaction } = useAppState();
  const [type, setType] = useState<TransactionType>(initial?.type ?? defaultType);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState(
    initial?.category ?? (defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
  );
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial?.paymentMethod ?? 'Credit Card');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [submitting, setSubmitting] = useState(false);

  const categories: readonly string[] = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(next: TransactionType) {
    setType(next);
    const nextCategories = next === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!(nextCategories as readonly string[]).includes(category)) setCategory(nextCategories[0]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!(amountNum > 0) || !description.trim() || !date) return;

    setSubmitting(true);
    const payload = {
      type,
      amount: amountNum,
      category,
      description: description.trim(),
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    };
    if (initial) {
      await updateTransaction({ ...initial, ...payload });
    } else {
      await addTransaction(payload);
    }
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal title={initial ? 'Edit Transaction' : 'Add Transaction'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-1 rounded-lg bg-surface-alt p-1">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
                type === t ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <TextInput
          label="Amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
        />
        <TextInput
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextInput label="Date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          options={PAYMENT_METHODS.map((p) => ({ value: p, label: p }))}
        />
        <TextInput label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {initial ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
