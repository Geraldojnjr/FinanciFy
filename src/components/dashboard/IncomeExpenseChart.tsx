import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { MonthlyData, IncomeExpenseChartProps } from '@/types/finance';

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10B981"
          name="Receitas"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#EF4444"
          name="Despesas"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 