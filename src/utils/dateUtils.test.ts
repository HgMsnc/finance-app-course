import { describe, expect, it } from 'vitest';
import {
  addDaysISO,
  addMonthsClamped,
  advanceBillingDate,
  compareISODates,
  isWithinLastNDays,
  lastNMonths,
} from './dateUtils';

describe('dateUtils', () => {
  it('adds days across month/year boundaries', () => {
    expect(addDaysISO('2026-08-30', 3)).toBe('2026-09-02');
    expect(addDaysISO('2026-12-30', 3)).toBe('2027-01-02');
  });

  it('clamps month-end dates when the target month is shorter', () => {
    expect(addMonthsClamped('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonthsClamped('2028-01-31', 1)).toBe('2028-02-29'); // leap year
    expect(addMonthsClamped('2026-01-15', 1)).toBe('2026-02-15');
  });

  it('advances billing dates per cycle with month-end clamping', () => {
    expect(advanceBillingDate('2026-01-31', 'monthly')).toBe('2026-02-28');
    expect(advanceBillingDate('2026-01-31', 'quarterly')).toBe('2026-04-30');
    expect(advanceBillingDate('2026-01-31', 'yearly')).toBe('2027-01-31');
  });

  it('compares ISO dates', () => {
    expect(compareISODates('2026-01-01', '2026-01-02')).toBeLessThan(0);
    expect(compareISODates('2026-01-02', '2026-01-01')).toBeGreaterThan(0);
    expect(compareISODates('2026-01-01', '2026-01-01')).toBe(0);
  });

  it('checks a rolling N-day window inclusive of the asOf date', () => {
    expect(isWithinLastNDays('2026-08-01', 30, '2026-08-20')).toBe(true);
    expect(isWithinLastNDays('2026-06-01', 30, '2026-08-20')).toBe(false);
    expect(isWithinLastNDays('2026-08-25', 30, '2026-08-20')).toBe(false); // future date
  });

  it('returns the last N months ending with asOf, oldest first', () => {
    expect(lastNMonths(3, '2026-08-19')).toEqual(['2026-06', '2026-07', '2026-08']);
    expect(lastNMonths(3, '2026-01-19')).toEqual(['2025-11', '2025-12', '2026-01']);
  });
});
