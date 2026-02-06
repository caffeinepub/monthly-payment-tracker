import { useGetTransactionsForMonth } from '../../hooks/useTransactions';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { TransactionType } from '../../backend';

interface TransactionListProps {
  month: number;
  year: number;
}

export default function TransactionList({ month, year }: TransactionListProps) {
  const { data: transactions, isLoading, error } = useGetTransactionsForMonth(year, month);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-destructive">Failed to load transactions</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/assets/generated/empty-transactions.dim_1200x800.png"
              alt="No transactions"
              className="w-48 h-32 object-contain mb-4 opacity-60"
            />
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground text-sm">
              Add your first transaction to start tracking your finances
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </h3>
      {transactions.map((transaction, index) => {
        const isIncome = transaction.transactionType === TransactionType.received;
        const amount = Number(transaction.amount) / 100; // Convert from cents
        const date = new Date(Number(transaction.date) / 1_000_000); // Convert from nanoseconds

        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isIncome 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {isIncome ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {isIncome ? 'Income' : 'Expense'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      isIncome 
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      {isIncome ? '+' : '-'}{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  {transaction.note && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p className="break-words">{transaction.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
