export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Cash';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  isSubscription?: boolean;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBillingDate: string; // YYYY-MM-DD
  status: 'active' | 'paused';
  autoRenew: boolean;
}

export interface StockHolding {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgBuyPrice: number;
  buyDate: string;
  sector: string;
}

export interface StockQuote {
  ticker: string;
  name: string;
  currentPrice: number;
  closingPrice: number;
  dayChange: number;
  dayChangePercent: number;
  sector: string;
  lastUpdated: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'JPY';

export interface AppState {
  transactions: Transaction[];
  subscriptions: Subscription[];
  holdings: StockHolding[];
  currency: Currency;
}

export interface HoldingValuation {
  holding: StockHolding;
  quote: StockQuote;
  marketValue: number;
  costBasis: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dayGain: number;
}
