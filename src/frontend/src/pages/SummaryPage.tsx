import { useEffect } from 'react';
import { useSelectedMonth } from '../hooks/useSelectedMonth';
import MonthPicker from '../components/month/MonthPicker';
import MonthlyTotalsCard from '../components/summary/MonthlyTotalsCard';
import IncomeVsExpenseChart from '../components/charts/IncomeVsExpenseChart';
import { useMonthlyReminder } from '../hooks/useMonthlyReminder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useGetMonthlyTotals } from '../hooks/useTransactions';

export default function SummaryPage() {
  const { selectedMonth, selectedYear } = useSelectedMonth();
  const { acknowledgeMonth } = useMonthlyReminder();
  const { data: totals } = useGetMonthlyTotals(selectedYear, selectedMonth);

  // Acknowledge this month when user views summary
  useEffect(() => {
    acknowledgeMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, acknowledgeMonth]);

  const balance = totals ? Number(totals.balance) : 0;
  const isPositive = balance >= 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Month Picker */}
      <MonthPicker />

      {/* Page Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Monthly Summary</h2>
        <p className="text-muted-foreground">
          Overview for {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Balance Highlight */}
      <Card className={`border-2 ${isPositive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Monthly Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-bold ${isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isPositive ? 'You saved money this month!' : 'You spent more than you earned this month'}
          </p>
        </CardContent>
      </Card>

      {/* Totals Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {totals ? Number(totals.totalReceived).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {totals ? Number(totals.totalSent).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <IncomeVsExpenseChart month={selectedMonth} year={selectedYear} />
      </Card>

      {/* Monthly Totals Detail */}
      <MonthlyTotalsCard month={selectedMonth} year={selectedYear} />
    </div>
  );
}
