import { useMemo } from 'react';
import { Goal, Investment } from '@/types/finance';

interface GoalProgress {
  currentAmount: number;
  targetAmount: number;
  progress: number;
  remainingAmount: number;
  estimatedCompletionDate: Date | null;
}

export function useGoalProgress(goal: Goal, investments: Investment[]): GoalProgress {
  return useMemo(() => {
    const goalInvestments = investments.filter(inv => inv.goalId === goal.id);
    const currentAmount = goalInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const targetAmount = goal.targetAmount;
    const progress = (currentAmount / targetAmount) * 100;
    const remainingAmount = targetAmount - currentAmount;

    // Calcula a data estimada de conclusão baseada no progresso atual
    let estimatedCompletionDate: Date | null = null;
    if (goal.targetDate && progress > 0) {
      const today = new Date();
      const daysElapsed = Math.floor((today.getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalDaysNeeded = Math.ceil(daysElapsed / (progress / 100));
      const remainingDays = totalDaysNeeded - daysElapsed;
      
      estimatedCompletionDate = new Date(today.getTime() + remainingDays * 24 * 60 * 60 * 1000);
    }

    return {
      currentAmount,
      targetAmount,
      progress,
      remainingAmount,
      estimatedCompletionDate
    };
  }, [goal, investments]);
} 