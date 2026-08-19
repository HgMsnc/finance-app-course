import type { Currency } from '../types';

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  CAD: 'en-CA',
  JPY: 'ja-JP',
};

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

export function formatSignedCurrency(amount: number, currency: Currency = 'USD'): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}
