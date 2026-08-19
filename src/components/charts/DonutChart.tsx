import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { colorForIndex } from './chartTheme';

export interface DonutDatum {
  name: string;
  value: number;
}

export function DonutChart({
  data,
  valueFormatter = (v: number) => v.toLocaleString(),
  emptyLabel = 'No data yet',
}: {
  data: DonutDatum[];
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}) {
  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-ink-muted">{emptyLabel}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colorForIndex(index)} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
