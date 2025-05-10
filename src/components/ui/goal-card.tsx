import React from 'react';
import { InfoCard } from "@/components/ui/info-card";
import { InvestmentGoalProgress } from "@/components/investments/InvestmentGoalProgress";
import { Investment, Goal } from "@/types/finance";

interface GoalCardProps {
  investment: Investment;
  goal: Goal;
}

export function GoalCard({ investment, goal }: GoalCardProps) {
  return (
    <InfoCard title={`Progresso da Meta: ${goal.name}`}>
      <InvestmentGoalProgress investment={investment} goal={goal} />
    </InfoCard>
  );
} 