export const EXPENSE_CATEGORIES = [
  'Housing & Rent',
  'Food & Groceries',
  'Dining & Cafes',
  'Subscriptions & SaaS',
  'Utilities & Bills',
  'Transportation',
  'Healthcare & Fitness',
  'Entertainment & Shopping',
  'Other Expense',
] as const;

export const INCOME_CATEGORIES = [
  'Salary & Wages',
  'Freelance & Consulting',
  'Stock Dividends',
  'Other Income',
] as const;

export const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'] as const;

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'JPY'] as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  JPY: '¥',
};
