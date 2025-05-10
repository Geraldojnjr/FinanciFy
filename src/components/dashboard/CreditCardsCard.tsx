
import { CreditCard } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export function CreditCardsCard() {
  const { creditCards, getCreditCardTransactions } = useFinance();
  
  return (
    <DashboardCard 
      title="Cartões de Crédito" 
      icon={<CreditCard className="w-5 h-5" />}
      className="h-full"
    >
      <div className="space-y-4">
        {creditCards.length > 0 ? (
          creditCards.map((card) => {
            const transactions = getCreditCardTransactions(card.id);
            const usedAmount = transactions
              .filter(t => !t.paid)
              .reduce((sum, t) => sum + t.amount, 0);
            const usedPercentage = (usedAmount / card.limit) * 100;
            
            return (
              <div key={card.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: card.color || "var(--primary)" }}
                    />
                    <span className="font-medium">{card.name}</span>
                  </div>
                  <div className="text-sm">
                    <span>{formatCurrency(usedAmount)}</span>
                    <span className="text-muted-foreground"> / {formatCurrency(card.limit)}</span>
                  </div>
                </div>
                
                <ProgressBar
                  value={usedAmount}
                  max={card.limit}
                  color={card.color || "var(--primary)"}
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fecha dia {card.closing_day}</span>
                  <span>Vence dia {card.due_day}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Nenhum cartão cadastrado
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
