
import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { useFinance } from "@/contexts/FinanceContext";
import { Investment } from "@/types/finance";
import { InvestmentsList } from "@/components/investments/InvestmentsList";
import { InvestmentDetail } from "@/components/investments/InvestmentDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvestmentForm } from "@/components/investments/InvestmentForm";
import { InvestmentsSummary } from "@/components/investments/InvestmentsSummary";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function InvestmentsPage() {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { updateInvestment, addInvestment } = useFinance();
  
  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsCreating(false);
    setShowForm(true);
  };

  const handleCreateInvestment = () => {
    setSelectedInvestment(null);
    setIsCreating(true);
    setShowForm(true);
  };
  
  const handleSubmit = async (data: any) => {
    try {
      if (isCreating) {
        await addInvestment(data);
        toast.success("Investimento adicionado com sucesso!");
      } else if (selectedInvestment) {
        await updateInvestment({ ...data, id: selectedInvestment.id });
        toast.success("Investimento atualizado com sucesso!");
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error with investment:', error);
      toast.error(`Erro ao ${isCreating ? 'adicionar' : 'atualizar'} investimento`);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setIsCreating(false);
    setSelectedInvestment(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe seu portfólio de investimentos.
            </p>
          </div>
          
          {/* <Button onClick={handleCreateInvestment} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Investimento
          </Button> */}
        </div>
        
        <InvestmentsSummary />
        
        {selectedInvestment ? (
          <InvestmentDetail 
            investment={selectedInvestment} 
            onEdit={handleEditInvestment}
            onBack={() => setSelectedInvestment(null)}
          />
        ) : (
          <InvestmentsList onSelectInvestment={setSelectedInvestment} />
        )}
        
        <Dialog open={showForm} onOpenChange={handleCloseForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isCreating ? "Adicionar Investimento" : "Editar Investimento"}</DialogTitle>
            </DialogHeader>
            <InvestmentForm
              investment={!isCreating ? selectedInvestment || undefined : undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
