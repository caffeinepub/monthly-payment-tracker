import { useGetMonthlyTotals } from '../../hooks/useTransactions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IncomeVsExpenseChartProps {
  month: number;
  year: number;
  compact?: boolean;
}

export default function IncomeVsExpenseChart({ month, year, compact = false }: IncomeVsExpenseChartProps) {
  const { data: totals, isLoading } = useGetMonthlyTotals(year, month);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const income = totals ? Number(totals.totalReceived) / 100 : 0;
  const expenses = totals ? Number(totals.totalSent) / 100 : 0;

  const data = [
    {
      name: 'This Month',
      Income: income,
      Expenses: expenses,
    },
  ];

  const content = (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <Legend />
        <Bar dataKey="Income" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
        <Bar dataKey="Expenses" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
