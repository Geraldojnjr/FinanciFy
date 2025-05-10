import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BalanceCardProps } from '@/types/finance';
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export function BalanceCard({ totalIncome, totalExpense, balance }: BalanceCardProps) {
  return (
    <DashboardCard 
      title="Saldo do Mês" 
      icon={<Wallet className="w-5 h-5" />}
      gradient
    >
      <div className="mt-4">
        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <ArrowUp className="w-4 h-4 text-finance-income" />
              <span>Entradas</span>
            </div>
            <div className="text-lg font-medium text-finance-income">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <ArrowDown className="w-4 h-4 text-finance-expense" />
              <span>Saídas</span>
            </div>
            <div className="text-lg font-medium text-finance-expense">
              {formatCurrency(totalExpense)}
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
