import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Transaction } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/format';
import { ptBR } from 'date-fns/locale';

interface MonthlyBalanceLineChartProps {
  transactions: Transaction[];
}

export function MonthlyBalanceLineChart({ transactions }: MonthlyBalanceLineChartProps) {
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
        balance: 0
      };
    }

    if (transaction.type === 'income') {
      acc[key].balance += Number(transaction.amount);
    } else if (transaction.type === 'expense') {
      acc[key].balance -= Number(transaction.amount);
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
  
  // Calculate accumulated balance
  let accumulatedBalance = 0;
  chartData.forEach(item => {
    accumulatedBalance += item.balance;
    item.accumulatedBalance = accumulatedBalance;
  });
  
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
        <LineChart
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
          <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="balance"
            name="Balanço Mensal"
            stroke="#60a5fa"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="accumulatedBalance"
            name="Balanço Acumulado"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
