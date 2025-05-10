import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Investment } from "@/types/finance";
import { formatDate, formatCurrency, formatPercentage } from "@/utils/format";
import { investmentTypes } from "@/utils/investment";
import { ArrowUpRight, ArrowDownRight, Calendar, DollarSign, Percent } from "lucide-react";

interface InvestmentCardProps {
  investment: Investment;
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
}

export function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const investmentType = investmentTypes.find(type => type.value === investment.type);
  const returnDifference = (investment.currentReturn || 0) - (investment.expectedReturn || 0);
  const isReturnPositive = returnDifference >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{investment.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {investmentType?.label || investment.type}
              </span>
            </CardDescription>
          </div>
          <Badge variant={investment.active ? "default" : "secondary"}>
            {investment.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Valor Investido
            </span>
            <span className="font-medium">{formatCurrency(investment.amount)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data Inicial
            </span>
            <span>{formatDate(investment.initialDate)}</span>
          </div>

          {investment.dueDate && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Vencimento
              </span>
              <span>{formatDate(investment.dueDate)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Retorno Esperado
            </span>
            <span className="font-medium text-green-600">
              {formatPercentage(investment.expectedReturn || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Retorno Atual
            </span>
            <div className="flex items-center gap-1">
              <span className={`font-medium ${isReturnPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(investment.currentReturn || 0)}
              </span>
              {returnDifference !== 0 && (
                <span className={`text-xs ${isReturnPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isReturnPositive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(investment)}>
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(investment.id)}>
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
} 