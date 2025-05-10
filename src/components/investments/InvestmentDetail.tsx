import React from 'react';
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Investment, InvestmentDetailProps } from '@/types/finance';
import { formatCurrency } from "@/utils/format";
import { Edit, Trash, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { investmentTypes, formatDate, getTypeLabel } from "@/utils/investment";
import { CategoryBadge } from "@/components/ui/category-badge";
import { PageCard } from "@/components/ui/page-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatsGrid } from "@/components/ui/stats-grid";
import { DetailsGrid } from "@/components/ui/details-grid";
import { GoalCard } from "@/components/ui/goal-card";
import { TimelineCard } from "@/components/ui/timeline-card";
import { DetailsCard } from "@/components/ui/details-card";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export function InvestmentDetail({ investment, onEdit, onBack }: InvestmentDetailProps) {
  const { deleteInvestment, getCategoryById, goals } = useFinance();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = async () => {
    try {
      await deleteInvestment(investment.id);
      onBack();
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };
  
  const category = investment.categoryId ? getCategoryById(investment.categoryId) : null;
  const goal = investment.goalId ? goals.find(g => g.id === investment.goalId) : null;
  
  const stats = [
    {
      title: "Valor Investido",
      value: formatCurrency(investment.amount),
      icon: DollarSign
    },
    {
      title: "Tipo de Investimento",
      value: getTypeLabel(investment.type),
      icon: PieChart
    },
    {
      title: "Rendimento Esperado",
      value: investment.expectedReturn ? `${investment.expectedReturn}%` : "N/A",
      description: investment.currentReturn ? `Atual: ${investment.currentReturn}%` : undefined,
      icon: TrendingUp
    }
  ];
  
  const dates = [
    {
      date: investment.initialDate,
      label: "Data da Aplicação"
    },
    {
      date: investment.dueDate,
      label: "Data de Vencimento"
    }
  ];
  
  const fields = [
    {
      label: "Categoria",
      value: category ? category.name : "Sem categoria"
    },
    {
      label: "Observações",
      value: investment.notes || "Nenhuma observação"
    }
  ];
  
  return (
    <>
      <PageCard>
        <PageHeader
          title={investment.name}
          onBack={onBack}
          actions={[
            {
              icon: Edit,
              label: "Editar",
              variant: "outline",
              size: "sm",
              onClick: () => onEdit(investment)
            },
            {
              icon: Trash,
              label: "Excluir",
              variant: "destructive",
              size: "sm",
              onClick: () => setConfirmDelete(true)
            }
          ]}
        >
          {category && (
            <CategoryBadge
              name={category.name}
              color={category.color}
              className="ml-2"
            />
          )}
        </PageHeader>
        
        <StatsGrid stats={stats} />
        
        <DetailsGrid>
          <DetailsCard
            title="Detalhes do Investimento"
            dates={dates}
            fields={fields}
          />
          
          {goal ? (
            <GoalCard investment={investment} goal={goal} />
          ) : (
            <TimelineCard investment={investment} />
          )}
        </DetailsGrid>
      </PageCard>
      
      <DeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDelete}
        description="Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita."
      />
    </>
  );
}
