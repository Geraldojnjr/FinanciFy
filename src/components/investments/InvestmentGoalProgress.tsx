import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { Goal, Investment } from "@/types/finance";
import { useGoalProgress } from "@/hooks/useGoalProgress";

interface InvestmentGoalProgressProps {
  investmentId?: string;
  investment?: Investment;
  goal?: Goal;
}

export function InvestmentGoalProgress({ investment, goal: providedGoal, investmentId }: InvestmentGoalProgressProps) {
  const { investments, goals } = useFinance();
  
  // Handle either direct investment object or investmentId
  const targetInvestment = investment || (investmentId ? investments.find((inv) => inv.id === investmentId) : null);
  const goal = providedGoal || (targetInvestment?.goalId ? goals.find((g) => g.id === targetInvestment.goalId) : null);
  
  // If no goal associated, show a message
  if (!goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progresso da Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este investimento não está associado a nenhuma meta.
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = useGoalProgress(goal, investments);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progresso da Meta: {goal.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span>Investido: {formatCurrency(progress.currentAmount)}</span>
            <span>Meta: {formatCurrency(progress.targetAmount)}</span>
          </div>
          
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>{progress.progress.toFixed(1)}% concluído</span>
            <span>Restante: {formatCurrency(progress.remainingAmount)}</span>
          </div>
          
          {progress.estimatedCompletionDate && (
            <p className="text-xs text-muted-foreground text-center">
              Previsão de conclusão: {progress.estimatedCompletionDate.toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
