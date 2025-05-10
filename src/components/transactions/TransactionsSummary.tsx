
import React, { useMemo } from 'react';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/utils/format';

interface TransactionsSummaryProps {
  transactions: Transaction[];
}

export function TransactionsSummary({ transactions }: TransactionsSummaryProps) {
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  summary.balance = summary.income - summary.expense;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-1">Receitas</p>
        <p className="text-lg font-semibold text-green-600">{formatCurrency(summary.income)}</p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-1">Despesas</p>
        <p className="text-lg font-semibold text-red-600">{formatCurrency(summary.expense)}</p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-1">Saldo</p>
        <p className={`text-lg font-semibold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(summary.balance)}
        </p>
      </div>
    </div>
  );
}
