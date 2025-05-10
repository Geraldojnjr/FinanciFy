
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category } from '@/types/finance';
import { formatCurrency } from '@/utils/format';

interface ExpenseByCategoryPieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ExpenseByCategoryPieChart({ transactions, categories }: ExpenseByCategoryPieChartProps) {
  // Only use paid transactions
  const paidTransactions = transactions.filter(t => t.paid === true || t.paid === 1);
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Filter expense transactions
  const expenses = paidTransactions.filter(
    (t) => t.type === 'expense' && t.category_id
  );

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const categoryId = transaction.category_id;
    if (categoryId) {
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += Math.abs(Number(transaction.amount));
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert to array for chart
  const chartData = Object.entries(expensesByCategory)
    .map(([categoryId, value]) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category?.name || 'Sem categoria',
        value,
        color: category?.color || '#94a3b8',
      };
    })
    .sort((a, b) => b.value - a.value);

  // Handle no data scenario
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Nenhuma despesa encontrada para o período selecionado
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={activeIndex === index ? '#fff' : 'transparent'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
