import { FilterBar } from '../ui/FilterBar';
import { Select } from '../ui/Select';
import { TextInput } from '../ui/TextInput';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import { TIMEFRAME_OPTIONS, type TransactionFilterState } from '../../services/filters';

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function TransactionFilters({
  filters,
  onChange,
}: {
  filters: TransactionFilterState;
  onChange: (filters: TransactionFilterState) => void;
}) {
  return (
    <FilterBar>
      <Select
        label="Type"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as TransactionFilterState['type'] })}
        options={[
          { value: 'all', label: 'All' },
          { value: 'income', label: 'Income' },
          { value: 'expense', label: 'Expense' },
        ]}
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        options={[{ value: 'all', label: 'All Categories' }, ...ALL_CATEGORIES.map((c) => ({ value: c, label: c }))]}
      />
      <Select
        label="Timeframe"
        value={filters.timeframe}
        onChange={(e) => onChange({ ...filters, timeframe: e.target.value as TransactionFilterState['timeframe'] })}
        options={TIMEFRAME_OPTIONS}
      />
      <div className="min-w-[200px] flex-1">
        <TextInput
          label="Search"
          placeholder="Description, category, notes…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
    </FilterBar>
  );
}
