# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build
- `npm run lint` — run oxlint
- `npm run test` — run the full vitest suite once
- `npx vitest run <path>` — run a single test file (e.g. `npx vitest run src/services/priceEngine.test.ts`)
- `npx vitest` — run tests in watch mode
- `npm run preview` — preview the production build

There is no separate typecheck script; `tsc -b` runs as part of `npm run build`.

## Architecture

This is a client-only React 19 + TypeScript + Vite app (no backend). All data lives in the browser via IndexedDB (through `idb`). It's a personal finance tracker with three domains: transactions, subscriptions, and a stock portfolio.

### Data flow: db → state → components

- **`src/db/schema.ts`** defines the IndexedDB schema (`finance-tracker` database, one object store per domain: `transactions`, `subscriptions`, `holdings`, `meta`) and exposes a memoized `openDb()`.
- **`src/db/repository.ts`** is the only module that talks to IndexedDB directly. It exposes CRUD functions per store plus two whole-state operations used by JSON backup/restore: `replaceAllState` (clear + rewrite, also used for first-run seeding) and `mergeState` (upsert by id, used for JSON "Merge" import).
- **`src/state/AppStateContext.tsx`** (`AppStateProvider`) is the single source of truth at runtime. On mount it calls `repository.loadOrSeed(buildDemoState)` — if the DB has never been seeded, it generates demo data (`src/db/seed.ts`) and persists it; otherwise it loads existing state. Every mutating method on the context API (e.g. `addTransaction`, `logSubscriptionPayment`) follows the same pattern: **write to IndexedDB first, then dispatch a reducer action** to update in-memory state. Components never call `src/db/repository.ts` directly — they go through `useAppState()` (`src/state/useAppState.ts`), which reads the context built in `AppStateContext.tsx`.
- **`src/state/appReducer.ts`** is a pure reducer over `AppState` (`{ transactions, subscriptions, holdings, currency }`). Actions are typed in `src/state/actions.ts`. `LOG_SUBSCRIPTION_PAYMENT` is notable: it both appends a generated transaction and advances the subscription's `nextBillingDate` in one action.
- Components read `state` and call the mutation methods from `useAppState()`; they hold no IndexedDB or reducer knowledge themselves.

### Derived data lives in `src/services/`, not components

- **`calculations.ts`** — pure functions computing totals, savings rate, subscription burn rate, portfolio valuation/gains, category/sector breakdowns, and cashflow-by-month. Components call these rather than recomputing aggregates inline.
- **`priceEngine.ts`** — there is no real market data API. Stock quotes are **deterministically synthesized**: `getQuote(ticker, asOf?)` hashes the ticker (+ date) through a seeded PRNG (`mulberry32`) to produce a stable, reproducible price/drift/volatility per ticker per calendar day. Known tickers get realistic seed profiles from `src/constants/tickers.ts` (`KNOWN_TICKERS`); unknown tickers get a synthesized profile (`synthesizeTicker`) that's still stable across calls. Drift is anchored to `2024-01-01`, not the Unix epoch, to avoid extreme compounding — keep that anchor in mind if changing drift math.
- **`filters.ts`** — transaction filtering logic used by the transactions page and `useFilteredTransactions` hook.
- **`csvExport.ts`** / **`jsonBackup.ts`** — CSV export and full-state JSON export/import (backup/restore), driving `AppStateApi.exportBackup`/`importBackup`.

### UI structure

- `src/App.tsx` renders `AppStateProvider` wrapping a simple tab switcher (`dashboard` | `transactions` | `subscriptions` | `portfolio`) — no router.
- Feature pages live under `src/components/{dashboard,transactions,subscriptions,portfolio}/`, each with a `*Page.tsx` entry component plus supporting forms/tables/charts.
- `src/components/ui/` holds generic primitives (Button, Modal, DataTable, Select, TextInput, FilterBar, KpiCard, ConfirmDialog, Badge, EmptyState) reused across feature pages.
- `src/components/charts/` holds shared Recharts wrappers (`AreaBarChart`, `DonutChart`) and `chartTheme.ts` for consistent chart styling; feature-specific chart components (e.g. `ExpenseBreakdownChart`) compose these.
- Styling is Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — config is CSS-based in `src/index.css`).

### Conventions worth knowing

- Dates are stored as `YYYY-MM-DD` ISO strings throughout (`Transaction.date`, `Subscription.nextBillingDate`, etc.); date math helpers live in `src/utils/dateUtils.ts`.
- IDs are generated with `crypto.randomUUID()` (`src/utils/id.ts`); domain objects take an `Omit<T, 'id'>` input at creation time and the id is assigned in `AppStateContext`.
- Currency is a single global setting (`AppState.currency`), not per-transaction; formatting goes through `src/utils/formatCurrency.ts`.
- Tests are colocated with source (`*.test.ts` next to the module) and use vitest + jsdom + Testing Library (setup in `src/test/setup.ts`).
