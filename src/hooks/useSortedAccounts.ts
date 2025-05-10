import { useMemo } from 'react';
import { Account } from '@/types/finance';

type SortField = 'name' | 'balance' | 'type';
type SortOrder = 'asc' | 'desc';

interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export function useSortedAccounts(accounts: Account[], options: SortOptions) {
  return useMemo(() => {
    return [...accounts].sort((a, b) => {
      let comparison = 0;

      switch (options.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'balance':
          comparison = a.balance - b.balance;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }

      return options.order === 'asc' ? comparison : -comparison;
    });
  }, [accounts, options]);
} 