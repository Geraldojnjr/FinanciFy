
import { Goal } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatCurrency } from '@/utils/format';
import { Timer, Check, AlertTriangle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface GoalProgressCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onClick?: () => void;
  className?: string;
}

export function GoalProgressCard({ goal, onEdit, onDelete, onClick, className }: GoalProgressCardProps) {
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
  
  return (
    <Card 
      className={cn("p-4 relative border overflow-hidden", className)}
      onClick={onClick}
    >
      {/* Status indicator */}
      {isCompleted && (
        <div className="absolute top-0 right-0 bg-finance-success text-white px-2 py-1 text-xs font-medium">
          Concluída
        </div>
      )}
      {isExpired && !isCompleted && (
        <div className="absolute top-0 right-0 bg-finance-expense text-white px-2 py-1 text-xs font-medium">
          Vencida
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: goal.color || '#60a5fa' }} 
          />
          {goal.name}
        </h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(goal);
            }}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(goal.id);
              }}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">{formattedProgress}% concluído</span>
          <span className="font-medium text-sm">
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
      </div>
      
      {goal.deadline && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Timer className="h-3 w-3" />
          <span>
            {isExpired 
              ? "Venceu em " 
              : "Vence em "
            }
            {new Date(goal.deadline).toLocaleDateString()}
          </span>
        </div>
      )}
      
      {remainingDays !== null && remainingDays > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Restam {remainingDays} dias</span>
        </div>
      )}
      
      {goal.notes && (
        <div className="mt-2 text-xs text-muted-foreground truncate">
          {goal.notes}
        </div>
      )}
    </Card>
  );
}
