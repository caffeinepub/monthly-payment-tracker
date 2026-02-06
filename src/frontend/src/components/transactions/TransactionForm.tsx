import { useState } from 'react';
import { useAddTransaction } from '../../hooks/useTransactions';
import { TransactionType } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<'received' | 'sent'>('received');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const addTransaction = useAddTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    if (note.length > 200) {
      toast.error('Note must be 200 characters or less');
      return;
    }

    try {
      const transactionDate = new Date(date).getTime() * 1_000_000; // Convert to nanoseconds

      await addTransaction.mutateAsync({
        transactionType: type === 'received' ? TransactionType.received : TransactionType.sent,
        amount: BigInt(Math.round(amountNum * 100)), // Store as cents
        date: BigInt(transactionDate),
        note: note.trim(),
      });

      toast.success(`${type === 'received' ? 'Income' : 'Expense'} added successfully`);
      onSuccess();
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
      console.error('Transaction add error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add Transaction</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Transaction Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Tabs value={type} onValueChange={(v) => setType(v as 'received' | 'sent')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="h-12 text-lg"
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note about this transaction..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{note.length}/200</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={addTransaction.isPending}
          className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          {addTransaction.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Adding...
            </>
          ) : (
            'Add Transaction'
          )}
        </Button>
      </div>
    </form>
  );
}
