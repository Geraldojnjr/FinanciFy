
import { useMemo } from 'react';
import { Transaction, FilterOptions } from '@/types/finance';

export function useFilteredTransactions(
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] {
  return useMemo(() => {
    return transactions.filter(transaction => {
      // Date filter
      const transactionDate = new Date(transaction.date);
      const dateMatch = 
        (!filters.startDate || transactionDate >= filters.startDate) && 
        (!filters.endDate || transactionDate <= filters.endDate);
      
      // Category filter
      const categoryMatch = !filters.categoryId || 
        transaction.category_id === filters.categoryId;
      
      // Type filter
      const typeMatch = !filters.type || transaction.type === filters.type;
      
      // Search term filter
      const searchMatch = !filters.searchTerm || 
        transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Amount filter
      const amountMatch = 
        (!filters.minAmount || transaction.amount >= filters.minAmount) && 
        (!filters.maxAmount || transaction.amount <= filters.maxAmount);
      
      return dateMatch && categoryMatch && typeMatch && searchMatch && amountMatch;
    });
  }, [transactions, filters]);
}
