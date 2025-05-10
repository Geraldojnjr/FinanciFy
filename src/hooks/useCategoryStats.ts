import { useMemo } from 'react';
import { Category, Transaction } from '@/types/finance';

interface CategoryStats {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  percentageOfTotal: number;
  lastTransaction: Transaction | null;
}

export function useCategoryStats(
  category: Category,
  transactions: Transaction[],
  totalAmount: number
): CategoryStats {
  return useMemo(() => {
    const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
    
    if (!categoryTransactions.length) {
      return {
        totalAmount: 0,
        transactionCount: 0,
        averageAmount: 0,
        percentageOfTotal: 0,
        lastTransaction: null
      };
    }

    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = categoryTransactions.length;
    const averageAmount = totalAmount / transactionCount;
    const percentageOfTotal = (totalAmount / totalAmount) * 100;
    const lastTransaction = [...categoryTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    return {
      totalAmount,
      transactionCount,
      averageAmount,
      percentageOfTotal,
      lastTransaction
    };
  }, [category, transactions, totalAmount]);
} 