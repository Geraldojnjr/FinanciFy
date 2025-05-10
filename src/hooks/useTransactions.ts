import { useState, useCallback, useEffect } from 'react';
import { TransactionType, PaymentMethod, Transaction } from '@/types/finance';
import { useFinance } from '@/contexts/FinanceContext';
import { DateRange } from 'react-day-picker';

export const useTransactions = () => {
  const { transactions: allTransactions, categories, isLoading, error, getCategoryById } = useFinance();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize with all transactions
    setFilteredTransactions(allTransactions);
  }, [allTransactions]);

  const filterTransactions = useCallback(async (
    startDate?: Date,
    endDate?: Date,
    categoryIds?: string[],
    types?: TransactionType[],
    paymentMethods?: PaymentMethod[]
  ): Promise<Transaction[]> => {
    const filtered = allTransactions.filter((transaction) => {
      // Date filter
      const transactionDate = new Date(transaction.date);
      const dateMatch = 
        (!startDate || transactionDate >= startDate) && 
        (!endDate || transactionDate <= endDate);
      
      // Category filter
      const categoryMatch = !categoryIds?.length || categoryIds.includes(transaction.category_id);
      
      // Type filter
      const typeMatch = !types?.length || 
        types.includes(transaction.type);
      
      // Payment method filter
      const methodMatch = !paymentMethods?.length || 
        paymentMethods.includes(transaction.payment_method);
      
      return dateMatch && categoryMatch && typeMatch && methodMatch;
    });
    
    setFilteredTransactions(filtered);
    return filtered;
  }, [allTransactions]);

  const getTransactionById = useCallback((id: string): Transaction | undefined => {
    return allTransactions.find(transaction => transaction.id === id);
  }, [allTransactions]);

  return {
    transactions: filteredTransactions,
    allTransactions,
    categories,
    isLoading,
    error,
    filterTransactions,
    getTransactionById,
    getCategoryById
  };
};
