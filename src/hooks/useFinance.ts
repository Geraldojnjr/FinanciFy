import React, { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }

  return context;
} 