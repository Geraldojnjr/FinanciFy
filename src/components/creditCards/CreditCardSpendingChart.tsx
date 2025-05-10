import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { CreditCardSpendingChartProps } from '@/types/finance';
import { useFinance } from "@/contexts/FinanceContext";
import { PieChart, Pie, Cell } from "recharts";

export default function CreditCardSpendingChart({
  cardId,
}: CreditCardSpendingChartProps) {
  const { transactions, getCategoryById } = useFinance();

  // Filtra transações deste cartão e apenas despesas
  const cardTransactions = transactions.filter((t) => 
    t.credit_card_id === cardId && 
    t.type === 'expense'
  );

  // Agrupa transações por categoria
  const spendingByCategory = cardTransactions.reduce((acc, transaction) => {
    const { category_id, amount } = transaction;
    const categoryIdToUse = category_id;
    
    if (!categoryIdToUse) return acc;
    
    if (!acc[categoryIdToUse]) {
      acc[categoryIdToUse] = { amount: 0, count: 0 };
    }
    
    acc[categoryIdToUse].amount += Math.abs(amount);
    acc[categoryIdToUse].count += 1;
    
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  // Formata os dados para o gráfico
  const chartData = Object.entries(spendingByCategory).map(([categoryId, data]) => {
    const category = getCategoryById(categoryId);
    return {
      name: category ? category.name : "Sem categoria",
      value: data.amount,
      color: category ? category.color : "#999",
    };
  });

  // Ordena por valor (maior para menor)
  chartData.sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-center">
        <p className="text-muted-foreground">Sem dados de gastos para exibir.</p>
      </div>
    );
  }

  // Detecta se está em mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md p-2 shadow-lg text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="font-medium">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] sm:h-[320px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={isMobile ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
            label={({ name }) => (
              <text
                style={{
                  fontSize: isMobile ? 10 : 12,
                  fill: "#333",
                  textAnchor: "middle"
                }}
              >
                {name}
              </text>
            )}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {!isMobile && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      {isMobile && (
        <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
          {chartData.map((entry, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <span style={{ backgroundColor: entry.color, width: 10, height: 10, display: 'inline-block', borderRadius: 2 }} />
              <span style={{ color: entry.color }}>{entry.name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
