
import { Goal } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { GoalsProgressChart } from './GoalsProgressChart';
import { formatCurrency } from '@/utils/format';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Calendar, Target, AlertTriangle, Clock, Check, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFinance } from '@/contexts/FinanceContext';

interface GoalDetailProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

export function GoalDetail({ goal, onEdit }: GoalDetailProps) {
  const { transactions, getCategoryById } = useFinance();
  const category = goal.category_id ? getCategoryById(goal.category_id) : undefined;
  
  const progress = (goal.current_amount / goal.target_amount) * 100;
  const formattedProgress = Math.min(Math.round(progress), 100);
  
  const isCompleted = progress >= 100;
  
  const calculateRemainingDays = () => {
    if (!goal.deadline) return null;
    
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const remainingDays = calculateRemainingDays();
  const isExpired = remainingDays !== null && remainingDays <= 0;
  const isSlowProgress = remainingDays !== null && remainingDays > 0 && progress < 50 && remainingDays < 30;
  
  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-finance-success px-2 py-1 bg-finance-success/10 rounded-full">
          <Check size={14} />
          <span>Meta atingida</span>
        </div>
      );
    }
    
    if (isExpired) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-finance-expense px-2 py-1 bg-finance-expense/10 rounded-full">
          <AlertTriangle size={14} />
          <span>Meta vencida</span>
        </div>
      );
    }
    
    if (isSlowProgress) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-amber-500 px-2 py-1 bg-amber-500/10 rounded-full">
          <Clock size={14} />
          <span>Progresso lento</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-xs font-medium text-[#60a5fa] px-2 py-1 bg-[#60a5fa]/10 rounded-full">
        <Target size={14} />
        <span>Em andamento</span>
      </div>
    );
  };
  
  // For demonstration purposes, we'll use all transactions
  // In a real implementation, we would filter transactions related to this goal
  const filteredTransactions = transactions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: goal.color || '#60a5fa' }} 
            />
            {goal.name}
          </h2>
          {category && (
            <p className="text-muted-foreground">
              Categoria: {category.name}
            </p>
          )}
        </div>
        <Button onClick={() => onEdit(goal)} className="gap-2">
          <Pencil size={16} />
          Editar Meta
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn("p-4", 
          isCompleted ? "border-finance-success" : 
          isExpired ? "border-finance-expense" : 
          ""
        )}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium">Progresso</h3>
            {getStatusBadge()}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">{formattedProgress}% concluído</span>
              <span className="font-medium">
                {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
              </span>
            </div>
            
            <ProgressBar 
              value={goal.current_amount} 
              max={goal.target_amount} 
              color={
                isCompleted ? "var(--finance-success)" : 
                isExpired ? "var(--finance-expense)" : 
                goal.color || "var(--primary)"
              } 
            />
            
            {goal.deadline && (
              <div className="flex items-center gap-2 mt-4 text-sm">
                <Calendar size={16} />
                <span>
                  {isExpired 
                    ? "Meta venceu em " 
                    : "Prazo: "
                  }
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {remainingDays !== null && remainingDays > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Restam {remainingDays} dias</span>
                {goal.target_amount - goal.current_amount > 0 && (
                  <span className="text-muted-foreground block mt-1">
                    Valor restante: {formatCurrency(goal.target_amount - goal.current_amount)}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-4 md:col-span-2">
          <h3 className="font-medium mb-4">Evolução da Meta</h3>
          <GoalsProgressChart goal={goal} transactions={filteredTransactions} />
        </Card>
      </div>
      
      {goal.notes && (
        <Card className="p-4">
          <h3 className="font-medium mb-2">Observações</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {goal.notes}
          </p>
        </Card>
      )}
    </div>
  );
}
