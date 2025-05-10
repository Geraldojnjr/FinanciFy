import { useMemo } from 'react';
import { Investment } from '@/types/finance';

interface InvestmentStats {
  totalInvested: number;
  totalReturn: number;
  averageReturn: number;
  bestPerforming: Investment | null;
  worstPerforming: Investment | null;
}

export function useInvestmentStats(investments: Investment[]): InvestmentStats {
  return useMemo(() => {
    if (!investments.length) {
      return {
        totalInvested: 0,
        totalReturn: 0,
        averageReturn: 0,
        bestPerforming: null,
        worstPerforming: null
      };
    }

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturn = investments.reduce((sum, inv) => {
      const returnAmount = (inv.amount * (inv.currentReturn || 0)) / 100;
      return sum + returnAmount;
    }, 0);

    const averageReturn = investments.reduce((sum, inv) => sum + (inv.currentReturn || 0), 0) / investments.length;

    const sortedByReturn = [...investments].sort((a, b) => 
      (b.currentReturn || 0) - (a.currentReturn || 0)
    );

    return {
      totalInvested,
      totalReturn,
      averageReturn,
      bestPerforming: sortedByReturn[0],
      worstPerforming: sortedByReturn[sortedByReturn.length - 1]
    };
  }, [investments]);
} 