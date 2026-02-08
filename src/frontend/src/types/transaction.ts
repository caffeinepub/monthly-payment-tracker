// Local type definitions for transactions (localStorage-based)
// Backend does not support transaction functionality

export enum TransactionType {
  received = 'received',
  sent = 'sent',
}

export interface Transaction {
  transactionType: TransactionType;
  amount: bigint;
  date: bigint;
  note: string;
}

export interface MonthlyTotals {
  totalReceived: bigint;
  totalSent: bigint;
  balance: bigint;
}
