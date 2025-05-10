
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Goal } from '@/types/finance';
import { formatCurrency } from '@/utils/format';

interface GoalsProgressChartProps {
  goal: Goal;
  transactions?: any[]; // Simplified for now, would filter by associated category
}

interface ChartDataPoint {
  date: string;
  amount: number;
  target: number;
}

export function GoalsProgressChart({ goal, transactions = [] }: GoalsProgressChartProps) {
  // In a real implementation, we would use transactions related to this goal
  // to build a proper progression chart. For now, we'll simulate data
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    let currentAmount = 0;
    
    // Generate data points for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      
      // For demonstration, increment by some percentage each month
      const increment = (goal.current_amount / 6) * (6 - i);
      currentAmount = increment;
      
      data.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short' }),
        amount: currentAmount,
        target: goal.target_amount
      });
    }
    
    return data;
  }, [goal]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-muted rounded-md p-3 shadow-md">
          <p className="font-medium">{payload[0].payload.date}</p>
          <p className="text-[#60a5fa]">
            <span className="font-medium">Valor acumulado: </span>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--muted-foreground)' }}
            tickFormatter={(value) => value >= 1000 ? 
              `${Math.round(value/1000)}k` : value.toString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={goal.target_amount} 
            stroke="#10b981" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Meta', 
              position: 'insideTopRight',
              fill: '#10b981',
              fontSize: 12
            }} 
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={goal.color || "#60a5fa"}
            strokeWidth={2}
            dot={{ fill: goal.color || "#60a5fa", r: 4 }}
            activeDot={{ r: 6, fill: goal.color || "#60a5fa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
