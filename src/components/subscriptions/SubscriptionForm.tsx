import { useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { useAppState } from '../../state/useAppState';
import { todayISO } from '../../utils/dateUtils';
import type { BillingCycle, Subscription } from '../../types';

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export function SubscriptionForm({ initial, onClose }: { initial?: Subscription; onClose: () => void }) {
  const { addSubscription, updateSubscription } = useAppState();
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? EXPENSE_CATEGORIES[3]);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initial?.billingCycle ?? 'monthly');
  const [nextBillingDate, setNextBillingDate] = useState(initial?.nextBillingDate ?? todayISO());
  const [status, setStatus] = useState<Subscription['status']>(initial?.status ?? 'active');
  const [autoRenew, setAutoRenew] = useState(initial?.autoRenew ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!(amountNum > 0) || !name.trim() || !nextBillingDate) return;

    setSubmitting(true);
    const payload = { name: name.trim(), category, amount: amountNum, billingCycle, nextBillingDate, status, autoRenew };
    if (initial) {
      await updateSubscription({ ...initial, ...payload });
    } else {
      await addSubscription(payload);
    }
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal title={initial ? 'Edit Subscription' : 'Add Subscription'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextInput label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix, Spotify, Gym…" />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
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
          label="Billing Cycle"
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
          options={BILLING_CYCLES}
        />
        <TextInput
          label="Next Billing Date"
          type="date"
          required
          value={nextBillingDate}
          onChange={(e) => setNextBillingDate(e.target.value)}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Subscription['status'])}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="h-4 w-4 rounded border-border" />
          Auto-renews
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {initial ? 'Save Changes' : 'Add Subscription'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
