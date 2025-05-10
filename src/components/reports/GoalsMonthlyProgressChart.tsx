
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Goal } from '@/types/finance';
import { formatCurrency } from '@/utils/format';

interface GoalsMonthlyProgressChartProps {
  goals: Goal[];
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export function GoalsMonthlyProgressChart({ goals }: GoalsMonthlyProgressChartProps) {
  const chartData = useMemo(() => {
    if (!goals.length) return [];
    
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    // Generate data points for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      
      const dataPoint: ChartDataPoint = {
        date: date.toLocaleDateString('pt-BR', { month: 'short' }),
      };
      
      // For demonstration, generate progression for each goal
      goals.slice(0, 5).forEach((goal) => {
        // Generate simulated progress for demonstration
        const increment = (goal.current_amount / 6) * (6 - i);
        dataPoint[`goal-${goal.id}`] = increment;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  }, [goals]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = payload[0]?.payload.date;
      
      return (
        <div className="bg-background border border-muted rounded-md p-3 shadow-md">
          <p className="font-medium mb-2">{date}</p>
          {payload.map((entry: any, index: number) => {
            const goalId = entry.dataKey.replace('goal-', '');
            const goal = goals.find(g => g.id === goalId);
            
            if (!goal) return null;
            
            return (
              <div key={index} className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: goal.color || '#60a5fa' }}
                />
                <span className="text-sm">
                  {goal.name}: {formatCurrency(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return null;
  };
  
  const CustomizedLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center text-xs mt-2">
        {payload.map((entry: any, index: number) => {
          const goalId = entry.dataKey.replace('goal-', '');
          const goal = goals.find(g => g.id === goalId);
          
          if (!goal) return null;
          
          return (
            <div key={index} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: goal.color || entry.color }}
              />
              <span className="text-muted-foreground">{goal.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (goals.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Nenhuma meta encontrada para visualizar o progresso.
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 50,
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
          <Legend content={<CustomizedLegend />} />
          
          {goals.slice(0, 5).map(goal => (
            <Line
              key={goal.id}
              type="monotone"
              dataKey={`goal-${goal.id}`}
              stroke={goal.color || "#60a5fa"}
              strokeWidth={2}
              dot={{ fill: goal.color || "#60a5fa", r: 2 }}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
