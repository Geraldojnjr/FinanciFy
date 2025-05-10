import React from 'react';
import { CreditCard as CreditCardType, CreditCardsListProps } from '@/types/finance';
import { Button } from "@/components/ui/button";
import { Edit, CreditCard as CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { useFinance } from "@/contexts/FinanceContext";

export default function CreditCardsList({
  onSelectCard,
  onAddCard,
}: CreditCardsListProps) {
  const { creditCards, getCreditCardTransactions } = useFinance();

  if (!creditCards) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando cartões...</p>
      </div>
    );
  }

  if (creditCards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum cartão cadastrado</p>
        <Button onClick={onAddCard} className="mt-4">
          Adicionar Cartão
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {creditCards.map((card) => {
        const transactions = getCreditCardTransactions(card.id);
        const usedAmount = transactions
          .filter(t => !t.paid)
          .reduce((sum, t) => sum + t.amount, 0);
        const usedPercentage = (usedAmount / card.limit) * 100;

        return (
          <div
            key={card.id}
            className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50"
            onClick={() => onSelectCard(card.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: card.color || "#6750A4" }}
                >
                  <CreditCardIcon size={16} className="text-white" />
                </div>
                <span className="font-medium">{card.name}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-muted-foreground">Utilizado:</span>
              <span className={usedPercentage > 80 ? "text-destructive" : ""}>
                {formatCurrency(usedAmount)} de {formatCurrency(card.limit)}
              </span>
            </div>

            <div className="w-full bg-secondary h-1.5 rounded-full mt-2">
              <div
                className={cn(
                  "h-full rounded-full",
                  usedPercentage > 80
                    ? "bg-destructive"
                    : usedPercentage > 60
                    ? "bg-amber-500"
                    : "bg-primary"
                )}
                style={{ width: `${Math.min(100, usedPercentage)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Fecha dia {card.closingDay}</span>
              <span>Vence dia {card.dueDay}</span>
            </div>
          </div>
        );
      })}
      <Button onClick={onAddCard} className="w-full">
        Adicionar Cartão
      </Button>
    </div>
  );
}
