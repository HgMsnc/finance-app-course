import { useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SECTORS } from '../../constants/tickers';
import { resolveSeed } from '../../services/priceEngine';
import { useAppState } from '../../state/useAppState';
import { todayISO } from '../../utils/dateUtils';
import type { StockHolding } from '../../types';

export function HoldingForm({ initial, onClose }: { initial?: StockHolding; onClose: () => void }) {
  const { addHolding, updateHolding } = useAppState();
  const [ticker, setTicker] = useState(initial?.ticker ?? '');
  const [companyName, setCompanyName] = useState(initial?.companyName ?? '');
  const [shares, setShares] = useState(initial ? String(initial.shares) : '');
  const [avgBuyPrice, setAvgBuyPrice] = useState(initial ? String(initial.avgBuyPrice) : '');
  const [buyDate, setBuyDate] = useState(initial?.buyDate ?? todayISO());
  const [sector, setSector] = useState(initial?.sector ?? SECTORS[0]);
  const [submitting, setSubmitting] = useState(false);

  function handleLookup() {
    if (!ticker.trim()) return;
    const seed = resolveSeed(ticker);
    setCompanyName(seed.name);
    setSector(seed.sector);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const sharesNum = Number(shares);
    const priceNum = Number(avgBuyPrice);
    if (!ticker.trim() || !(sharesNum > 0) || !(priceNum > 0) || !buyDate) return;

    setSubmitting(true);
    const payload = {
      ticker: ticker.trim().toUpperCase(),
      companyName: companyName.trim() || ticker.trim().toUpperCase(),
      shares: sharesNum,
      avgBuyPrice: priceNum,
      buyDate,
      sector,
    };
    if (initial) {
      await updateHolding({ ...initial, ...payload });
    } else {
      await addHolding(payload);
    }
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal title={initial ? 'Edit Holding' : 'Add Stock Holding'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <TextInput
              label="Ticker"
              required
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="AAPL, NVDA, VOO…"
            />
          </div>
          <Button type="button" variant="secondary" onClick={handleLookup}>
            Look Up
          </Button>
        </div>
        <TextInput label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <TextInput
          label="Shares"
          type="number"
          min="0.0001"
          step="0.0001"
          required
          value={shares}
          onChange={(e) => setShares(e.target.value)}
        />
        <TextInput
          label="Average Buy Price"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={avgBuyPrice}
          onChange={(e) => setAvgBuyPrice(e.target.value)}
        />
        <TextInput label="Buy Date" type="date" required value={buyDate} onChange={(e) => setBuyDate(e.target.value)} />
        <Select label="Sector" value={sector} onChange={(e) => setSector(e.target.value)} options={SECTORS.map((s) => ({ value: s, label: s }))} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {initial ? 'Save Changes' : 'Add Holding'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
