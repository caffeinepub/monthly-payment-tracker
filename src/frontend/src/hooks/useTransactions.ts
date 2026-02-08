import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import type { Transaction, MonthlyTotals, TransactionType } from '../types/transaction';

// LocalStorage key prefix
const STORAGE_KEY_PREFIX = 'payment_tracker_transactions_';

// Helper to get storage key for user and month
function getStorageKey(userId: string, year: number, month: number): string {
  return `${STORAGE_KEY_PREFIX}${userId}_${year}_${month}`;
}

// Helper to serialize bigint for localStorage
function serializeTransaction(transaction: Transaction): any {
  return {
    transactionType: transaction.transactionType,
    amount: transaction.amount.toString(),
    date: transaction.date.toString(),
    note: transaction.note,
  };
}

// Helper to deserialize bigint from localStorage
function deserializeTransaction(data: any): Transaction {
  return {
    transactionType: data.transactionType,
    amount: BigInt(data.amount),
    date: BigInt(data.date),
    note: data.note,
  };
}

export function useAddTransaction() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (!identity) throw new Error('User not authenticated');
      
      const userId = identity.getPrincipal().toString();
      const date = new Date(Number(transaction.date) / 1_000_000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const storageKey = getStorageKey(userId, year, month);
      const existingData = localStorage.getItem(storageKey);
      const transactions: Transaction[] = existingData 
        ? JSON.parse(existingData).map(deserializeTransaction)
        : [];
      
      transactions.push(transaction);
      localStorage.setItem(storageKey, JSON.stringify(transactions.map(serializeTransaction)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyTotals'] });
    },
  });
}

export function useGetTransactionsForMonth(year: number, month: number) {
  const { identity } = useInternetIdentity();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', year, month],
    queryFn: async () => {
      if (!identity) return [];
      
      const userId = identity.getPrincipal().toString();
      const storageKey = getStorageKey(userId, year, month);
      const data = localStorage.getItem(storageKey);
      
      if (!data) return [];
      
      try {
        const transactions = JSON.parse(data).map(deserializeTransaction);
        // Sort by date descending
        return transactions.sort((a, b) => Number(b.date - a.date));
      } catch (error) {
        console.error('Error parsing transactions:', error);
        return [];
      }
    },
    enabled: !!identity,
  });
}

export function useGetMonthlyTotals(year: number, month: number) {
  const { identity } = useInternetIdentity();

  return useQuery<MonthlyTotals>({
    queryKey: ['monthlyTotals', year, month],
    queryFn: async () => {
      if (!identity) {
        return {
          totalReceived: BigInt(0),
          totalSent: BigInt(0),
          balance: BigInt(0),
        };
      }
      
      const userId = identity.getPrincipal().toString();
      const storageKey = getStorageKey(userId, year, month);
      const data = localStorage.getItem(storageKey);
      
      if (!data) {
        return {
          totalReceived: BigInt(0),
          totalSent: BigInt(0),
          balance: BigInt(0),
        };
      }
      
      try {
        const transactions: Transaction[] = JSON.parse(data).map(deserializeTransaction);
        
        let totalReceived = BigInt(0);
        let totalSent = BigInt(0);
        
        transactions.forEach(transaction => {
          if (transaction.transactionType === 'received') {
            totalReceived += transaction.amount;
          } else {
            totalSent += transaction.amount;
          }
        });
        
        return {
          totalReceived,
          totalSent,
          balance: totalReceived - totalSent,
        };
      } catch (error) {
        console.error('Error calculating totals:', error);
        return {
          totalReceived: BigInt(0),
          totalSent: BigInt(0),
          balance: BigInt(0),
        };
      }
    },
    enabled: !!identity,
  });
}
