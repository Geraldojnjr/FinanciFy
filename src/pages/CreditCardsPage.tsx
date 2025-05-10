import { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { useFinance } from "@/contexts/FinanceContext";
import { CreditCard } from "@/types/finance";
import CreditCardsList from "@/components/creditCards/CreditCardsList";
import CreditCardDetail from "@/components/creditCards/CreditCardDetail";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreditCardForm from "@/components/creditCards/CreditCardForm";

export default function CreditCardsPage() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { creditCards } = useFinance();
  
  const activeCard = activeCardId 
    ? creditCards?.find(card => card.id === activeCardId)
    : null;

  const handleSelectCard = (cardId: string) => {
    setActiveCardId(cardId);
  };

  const handleEditCard = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões de crédito e suas faturas.
          </p>
        </div>

        {activeCard ? (
          <CreditCardDetail 
            card={activeCard} 
            onEdit={handleEditCard} 
          />
        ) : (
          <CreditCardsList 
            onSelectCard={handleSelectCard} 
            onAddCard={() => setIsFormOpen(true)}
          />
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <CreditCardForm 
              card={activeCard || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
