import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/format';
import { ptBR } from 'date-fns/locale';

interface MonthlyBarChartProps {
  transactions: Transaction[];
}

export function MonthlyBarChart({ transactions }: MonthlyBarChartProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${month}-${year}`;

    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        label: formatDate(date),
        income: 0,
        expense: 0
      };
    }

    if (transaction.type === 'income') {
      acc[key].income += Number(transaction.amount);
    } else if (transaction.type === 'expense') {
      acc[key].expense += Number(transaction.amount);
    }

    return acc;
  }, {});

  // Transform to array format for chart
  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .slice(-6);

  // Handle no data scenario
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Nenhuma transação encontrada para o período selecionado
      </div>
    );
  }
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(value) => formatCurrency(value).replace(/[^\d.,]/g, '')} />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Legend />
          <Bar dataKey="income" name="Receitas" fill="#4ade80" />
          <Bar dataKey="expense" name="Despesas" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
