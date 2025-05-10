
import { useState } from 'react';
import { Goal } from '@/types/finance';
import { GoalProgressCard } from './GoalProgressCard';
import { Target, Plus, Check, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GoalForm } from './GoalForm';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/FinanceContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface GoalsListProps {
  onSelectGoal?: (goal: Goal) => void;
}

function EmptyState({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Target className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2">Nenhuma meta encontrada</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Crie suas metas financeiras para acompanhar seu progresso em direção aos seus objetivos.
      </p>
      <Button onClick={onCreateGoal} className="bg-blue-500 hover:bg-blue-600">
        <Plus className="h-4 w-4 mr-2" />
        Criar Nova Meta
      </Button>
    </div>
  );
}

export function GoalsList({ onSelectGoal }: GoalsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('active');
  const { addGoal, updateGoal, deleteGoal, goals } = useFinance();
  const isMobile = useIsMobile();
  
  const handleCreateGoal = () => {
    setEditingGoal(undefined);
    setShowForm(true);
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };
  
  const handleGoalClick = (goal: Goal) => {
    if (onSelectGoal) {
      onSelectGoal(goal);
    }
  };
  
  const handleSubmit = async (data: any) => {
    try {
      if (editingGoal) {
        await updateGoal({ ...data, id: editingGoal.id });
      } else {
        await addGoal(data);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };
  
  const handleDelete = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  
  const getFilteredGoals = (filter: 'active' | 'completed' | 'expired') => {
    if (!goals) return [];
    
    return goals.filter(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      const isCompleted = progress >= 100;
      
      const hasDeadline = !!goal.deadline;
      const isExpired = hasDeadline && new Date(goal.deadline!) < new Date();
      
      if (filter === 'completed') return isCompleted;
      if (filter === 'expired') return isExpired && !isCompleted;
      if (filter === 'active') return !isCompleted && !isExpired;
      
      return true;
    });
  };
  
  const activeGoals = getFilteredGoals('active');
  const completedGoals = getFilteredGoals('completed');
  const expiredGoals = getFilteredGoals('expired');
  
  const allGoals = goals || [];

  const TabButton = ({ 
    value, 
    icon, 
    label, 
    count, 
    isActive, 
    onClick 
  }: { 
    value: string; 
    icon: React.ReactNode; 
    label: string; 
    count: number; 
    isActive: boolean; 
    onClick: () => void; 
  }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-4 py-3 w-full text-left border-l-4 transition-colors",
          isActive 
            ? "border-l-primary bg-blue-50 dark:bg-blue-900/20 text-primary font-medium" 
            : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30"
        )}
      >
        <span className={cn(
          "flex items-center justify-center w-5 h-5 rounded-full",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {icon}
        </span>
        <span>{label}</span>
        <span className={cn(
          "ml-auto px-2 py-0.5 rounded-full text-xs",
          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {count}
        </span>
      </button>
    );
  };
  
  const renderContent = () => {
    let goals: Goal[] = [];
    let emptyMessage = "";
    
    switch (activeTab) {
      case 'active':
        goals = activeGoals;
        emptyMessage = "Nenhuma meta em andamento. Comece criando uma nova meta!";
        break;
      case 'completed':
        goals = completedGoals;
        emptyMessage = "Nenhuma meta concluída ainda.";
        break;
      case 'expired':
        goals = expiredGoals;
        emptyMessage = "Nenhuma meta vencida.";
        break;
      case 'all':
        goals = allGoals;
        emptyMessage = "Nenhuma meta encontrada.";
        break;
    }
    
    if (goals.length === 0) {
      return (
        <p className="text-center py-6 text-muted-foreground">
          {emptyMessage}
        </p>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {goals.map(goal => (
          <GoalProgressCard 
            key={goal.id} 
            goal={goal} 
            onEdit={handleEditGoal} 
            onDelete={handleDelete}
            onClick={() => handleGoalClick(goal)}
            className="cursor-pointer hover:border-primary transition-colors"
          />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      {allGoals.length > 0 ? (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 border-b md:border-r md:border-b-0">
            <h2 className="font-bold text-xl p-4 border-b">Metas Financeiras</h2>
            <div className="flex flex-col">
              <TabButton 
                value="active"
                icon={<Target size={14} />}
                label="Em andamento"
                count={activeGoals.length}
                isActive={activeTab === 'active'}
                onClick={() => setActiveTab('active')}
              />
              <TabButton 
                value="completed"
                icon={<Check size={14} />}
                label="Concluídas"
                count={completedGoals.length}
                isActive={activeTab === 'completed'}
                onClick={() => setActiveTab('completed')}
              />
              <TabButton 
                value="expired"
                icon={<AlertTriangle size={14} />}
                label="Vencidas"
                count={expiredGoals.length}
                isActive={activeTab === 'expired'}
                onClick={() => setActiveTab('expired')}
              />
              <TabButton 
                value="all"
                icon={<Clock size={14} />}
                label="Todas"
                count={allGoals.length}
                isActive={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {activeTab === 'active' && 'Metas em andamento'}
                {activeTab === 'completed' && 'Metas concluídas'}
                {activeTab === 'expired' && 'Metas vencidas'}
                {activeTab === 'all' && 'Todas as metas'}
              </h3>
            </div>
            {renderContent()}
          </div>
        </div>
      ) : (
        <EmptyState onCreateGoal={handleCreateGoal} />
      )}
      
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby="goal-form-description">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Editar Meta' : 'Criar Nova Meta'}
            </DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? "Atualize os detalhes da sua meta financeira."
                : "Defina uma nova meta financeira para acompanhar seus objetivos."}
            </DialogDescription>
          </DialogHeader>
          <div id="goal-form-description" className="sr-only">
            {editingGoal ? 'Formulário para editar uma meta existente' : 'Formulário para criar uma nova meta financeira'}
          </div>
          <GoalForm
            goal={editingGoal}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
