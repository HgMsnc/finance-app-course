import type { AppState, StockHolding, Subscription, Transaction } from '../types';
import { addDaysISO, addMonthsClamped, compareISODates, startOfMonthISO, todayISO } from '../utils/dateUtils';
import { newId } from '../utils/id';

// Returns null (filtered out below) rather than a future-dated transaction — demo data for the
// current month must stop at "today" since a transaction is a record of something that already happened.
function tx(offsetDaysFromMonthStart: number, monthsAgo: number, fields: Omit<Transaction, 'id' | 'date'>): Transaction | null {
  const monthStart = startOfMonthISO(addMonthsClamped(todayISO(), -monthsAgo));
  const date = addDaysISO(monthStart, offsetDaysFromMonthStart);
  if (compareISODates(date, todayISO()) > 0) return null;
  return { id: newId(), date, ...fields };
}

export function buildDemoState(): AppState {
  const transactions: (Transaction | null)[] = [];

  for (let monthsAgo = 3; monthsAgo >= 0; monthsAgo--) {
    transactions.push(
      tx(0, monthsAgo, {
        type: 'income',
        amount: 5200,
        category: 'Salary & Wages',
        description: 'Monthly paycheck',
        paymentMethod: 'Bank Transfer',
      }),
      tx(2, monthsAgo, {
        type: 'expense',
        amount: 1650,
        category: 'Housing & Rent',
        description: 'Apartment rent',
        paymentMethod: 'Bank Transfer',
      }),
      tx(4, monthsAgo, {
        type: 'expense',
        amount: 210,
        category: 'Food & Groceries',
        description: 'Whole Foods',
        paymentMethod: 'Debit Card',
      }),
      tx(9, monthsAgo, {
        type: 'expense',
        amount: 68,
        category: 'Dining & Cafes',
        description: 'Blue Bottle Coffee',
        paymentMethod: 'Credit Card',
      }),
      tx(11, monthsAgo, {
        type: 'expense',
        amount: 145,
        category: 'Utilities & Bills',
        description: 'Electric & internet',
        paymentMethod: 'Bank Transfer',
      }),
      tx(14, monthsAgo, {
        type: 'expense',
        amount: 90,
        category: 'Transportation',
        description: 'Gas & rideshare',
        paymentMethod: 'Credit Card',
      }),
      tx(18, monthsAgo, {
        type: 'expense',
        amount: 65,
        category: 'Healthcare & Fitness',
        description: 'Gym membership',
        paymentMethod: 'Credit Card',
        isSubscription: true,
      }),
      tx(20, monthsAgo, {
        type: 'expense',
        amount: 15.99,
        category: 'Subscriptions & SaaS',
        description: 'Netflix',
        paymentMethod: 'Credit Card',
        isSubscription: true,
      }),
      tx(21, monthsAgo, {
        type: 'expense',
        amount: 10.99,
        category: 'Subscriptions & SaaS',
        description: 'Spotify',
        paymentMethod: 'Credit Card',
        isSubscription: true,
      }),
      tx(25, monthsAgo, {
        type: 'expense',
        amount: 120,
        category: 'Entertainment & Shopping',
        description: 'Amazon order',
        paymentMethod: 'Credit Card',
      }),
    );

    if (monthsAgo % 2 === 0) {
      transactions.push(
        tx(15, monthsAgo, {
          type: 'income',
          amount: 850,
          category: 'Freelance & Consulting',
          description: 'Freelance design project',
          paymentMethod: 'Bank Transfer',
        }),
      );
    }
  }

  transactions.push(
    tx(6, 1, {
      type: 'income',
      amount: 42.5,
      category: 'Stock Dividends',
      description: 'VOO dividend payout',
      paymentMethod: 'Bank Transfer',
    }),
  );

  const subscriptions: Subscription[] = [
    {
      id: newId(),
      name: 'Netflix',
      category: 'Subscriptions & SaaS',
      amount: 15.99,
      billingCycle: 'monthly',
      nextBillingDate: addDaysISO(todayISO(), 6),
      status: 'active',
      autoRenew: true,
    },
    {
      id: newId(),
      name: 'Spotify',
      category: 'Subscriptions & SaaS',
      amount: 10.99,
      billingCycle: 'monthly',
      nextBillingDate: addDaysISO(todayISO(), 11),
      status: 'active',
      autoRenew: true,
    },
    {
      id: newId(),
      name: 'Gym Membership',
      category: 'Healthcare & Fitness',
      amount: 65,
      billingCycle: 'monthly',
      nextBillingDate: addDaysISO(todayISO(), 2),
      status: 'active',
      autoRenew: true,
    },
    {
      id: newId(),
      name: 'Cloud Storage Plan',
      category: 'Subscriptions & SaaS',
      amount: 99,
      billingCycle: 'yearly',
      nextBillingDate: addDaysISO(todayISO(), 45),
      status: 'active',
      autoRenew: true,
    },
    {
      id: newId(),
      name: 'Streaming Bundle',
      category: 'Entertainment & Shopping',
      amount: 24,
      billingCycle: 'quarterly',
      nextBillingDate: addDaysISO(todayISO(), 20),
      status: 'paused',
      autoRenew: false,
    },
  ];

  const holdings: StockHolding[] = [
    {
      id: newId(),
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      shares: 12,
      avgBuyPrice: 189.5,
      buyDate: addMonthsClamped(todayISO(), -9),
      sector: 'Technology',
    },
    {
      id: newId(),
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      shares: 8,
      avgBuyPrice: 98.2,
      buyDate: addMonthsClamped(todayISO(), -14),
      sector: 'Technology',
    },
    {
      id: newId(),
      ticker: 'VOO',
      companyName: 'Vanguard S&P 500 ETF',
      shares: 5.5,
      avgBuyPrice: 470.0,
      buyDate: addMonthsClamped(todayISO(), -20),
      sector: 'Diversified / ETF',
    },
    {
      id: newId(),
      ticker: 'JNJ',
      companyName: 'Johnson & Johnson',
      shares: 15,
      avgBuyPrice: 162.3,
      buyDate: addMonthsClamped(todayISO(), -6),
      sector: 'Healthcare',
    },
    {
      id: newId(),
      ticker: 'ARKK',
      companyName: 'ARKK Holdings Inc.',
      shares: 20,
      avgBuyPrice: 45.0,
      buyDate: addMonthsClamped(todayISO(), -4),
      sector: 'Technology',
    },
  ];

  return { transactions: transactions.filter((t): t is Transaction => t !== null), subscriptions, holdings, currency: 'USD' };
}
