
import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { GoalsList } from "@/components/goals/GoalsList";
import { GoalDetail } from "@/components/goals/GoalDetail";
import { GoalForm } from "@/components/goals/GoalForm";
import { Goal } from "@/types/finance";
import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Plus, Target, ArrowUp } from "lucide-react";
import { StandardModal } from "@/components/ui/standard-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { GoalsService } from "@/services/GoalsService";

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { updateGoal, addGoal } = useFinance();
  const isMobile = useIsMobile();
  const goalsService = new GoalsService();
  
  const handleEditGoal = async (goal: Goal) => {
    try {
      // Busca os dados atualizados da meta no banco de dados
      const updatedGoal = await goalsService.getGoal(goal.id);
      setSelectedGoal(updatedGoal);
      setShowForm(true);
    } catch (error) {
      console.error('Erro ao buscar dados da meta:', error);
    }
  };
  
  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setShowForm(true);
  };
  
  const handleSubmit = async (data: any) => {
    try {
      if (selectedGoal) {
        await updateGoal({ ...data, id: selectedGoal.id });
      } else {
        await addGoal(data);
      }
      setShowForm(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedGoal(null);
  };
  
  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
          </div>
          
          <Button onClick={handleCreateGoal} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
            <Plus size={16} />
            Nova Meta
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Estabeleça e acompanhe suas metas financeiras.
        </p>
        
        {selectedGoal ? (
          <div>
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleBackToList}
              >
                <ArrowUp className="h-4 w-4 rotate-90" />
                Voltar para lista
              </Button>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm dark:bg-card/80">
              <GoalDetail 
                goal={selectedGoal} 
                onEdit={handleEditGoal}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm dark:bg-card/80">
            <GoalsList onSelectGoal={handleSelectGoal} />
          </div>
        )}
        
        <StandardModal
          open={showForm}
          onOpenChange={setShowForm}
          title={selectedGoal ? 'Editar Meta' : 'Nova Meta'}
          description="Preencha os dados da meta"
        >
          <GoalForm
            goal={selectedGoal ? {
              id: selectedGoal.id,
              name: selectedGoal.name,
              target_amount: selectedGoal.target_amount,
              current_amount: selectedGoal.current_amount,
              deadline: selectedGoal.deadline,
              notes: selectedGoal.notes,
              category_id: selectedGoal.category_id,
              color: selectedGoal.color,
              active: selectedGoal.active,
              created_at: selectedGoal.created_at,
              updated_at: selectedGoal.updated_at,
              user_id: selectedGoal.user_id
            } : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </StandardModal>
      </div>
    </Layout>
  );
}
