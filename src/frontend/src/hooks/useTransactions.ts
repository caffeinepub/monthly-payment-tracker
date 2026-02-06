import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Transaction } from '../backend';

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyTotals'] });
    },
  });
}

export function useGetTransactionsForMonth(year: number, month: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', year, month],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTransactionsForMonth(BigInt(year), BigInt(month));
      } catch (error: any) {
        if (error.message?.includes('no transactions yet')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMonthlyTotals(year: number, month: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['monthlyTotals', year, month],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMonthlyTotals(BigInt(year), BigInt(month));
    },
    enabled: !!actor && !actorFetching,
  });
}
