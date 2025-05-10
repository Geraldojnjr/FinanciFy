import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Investment, InvestmentTypeDistributionChartProps } from '@/types/finance';
import { formatCurrency } from '@/utils/format';
import { getTypeLabel, getTypeColor } from '@/utils/investment';

export function InvestmentTypeDistributionChart({ investments }: InvestmentTypeDistributionChartProps) {
  // Group investments by type
  const investmentsByType = investments.reduce((acc: Record<string, number>, investment) => {
    acc[investment.type] = (acc[investment.type] || 0) + investment.amount;
    return acc;
  }, {});
  
  // Convert to array for chart
  const chartData = Object.entries(investmentsByType).map(([type, amount]) => ({
    name: getTypeLabel(type),
    value: amount,
    color: getTypeColor(type)
  }));
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-muted rounded-md p-2 shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
