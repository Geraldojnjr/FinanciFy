
import { Target } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { Goal } from "@/types/finance";
import { cn } from "@/lib/utils";

export function GoalsCard() {
  const { goals } = useFinance();

  // Verificar se os dados existem
  if (!goals) {
    return (
      <DashboardCard 
        title="Metas Financeiras" 
        icon={<Target className="w-5 h-5" />}
        className="h-full"
      >
        <div className="py-4 text-center text-muted-foreground">
          Carregando dados...
        </div>
      </DashboardCard>
    );
  }

  // Sort goals by progress percentage
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = (a.current_amount / a.target_amount) * 100;
    const progressB = (b.current_amount / b.target_amount) * 100;
    return progressB - progressA;
  });

  const calculateRemainingDays = (goal: Goal) => {
    if (!goal.deadline) return null;
    
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <DashboardCard 
      title="Metas Financeiras" 
      icon={<Target className="w-5 h-5" />}
      className="h-full"
    >
      <div className="space-y-4">
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const remainingDays = calculateRemainingDays(goal);
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        progress >= 100 ? "bg-finance-success" : "bg-[#60a5fa]"
                      )}
                    />
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm">
                    {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                  </span>
                </div>
                
                <ProgressBar
                  value={goal.current_amount}
                  max={goal.target_amount}
                  color={goal.color || "var(--primary)"}
                />
                
                {remainingDays !== null && (
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {remainingDays === 0 ? (
                      <span>Meta venceu hoje!</span>
                    ) : (
                      <span>Restam {remainingDays} dias</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Nenhuma meta cadastrada
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
