import React from 'react';
import { PieChart } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { PieChart as Chart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryExpense } from '@/types/finance';

export function ExpensesByCategoryCard() {
  const { summary, getCategoryById } = useFinance();

  // Verificar se os dados necessários existem
  if (!summary || !summary.categorySummary) {
    return (
      <DashboardCard 
        title="Despesas por Categoria" 
        icon={<PieChart className="w-5 h-5" />}
        className="h-full"
      >
        <div className="h-60 flex items-center justify-center text-muted-foreground">
          Carregando dados...
        </div>
      </DashboardCard>
    );
  }

  // Transform data for the pie chart
  const expenseData: CategoryExpense[] = summary.categorySummary.map((item) => {
    const category = getCategoryById(item.categoryId);
    return {
      name: category?.name || "Outros",
      value: item.amount,
      color: category?.color || "#94a3b8"
    };
  });

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{`${data.percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardCard 
      title="Despesas por Categoria" 
      icon={<PieChart className="w-5 h-5" />}
      className="h-full"
    >
      <div className="h-60">
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <Chart>
              <Pie
                data={expenseData.map(item => ({
                  ...item,
                  percentage: (item.value / summary.totalExpense) * 100
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
                labelLine={false}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </Chart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Nenhum dado para exibir
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {expenseData.slice(0, 5).map((category, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm truncate max-w-[150px]">{category.name}</span>
            </div>
            <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
          </div>
        ))}
        {expenseData.length > 5 && (
          <div className="text-xs text-center text-muted-foreground pt-2">
            +{expenseData.length - 5} outras categorias
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
