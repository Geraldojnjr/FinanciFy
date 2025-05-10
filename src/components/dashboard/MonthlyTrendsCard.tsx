import { BarChart3 } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const months = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function MonthlyTrendsCard() {
  const { summary } = useFinance();

  // Verificar se os dados existem
  if (!summary || !summary.monthlySummary) {
    return (
      <DashboardCard 
        title="Tendências Mensais" 
        icon={<BarChart3 className="w-5 h-5" />}
        className="col-span-full h-full"
      >
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Carregando dados...
        </div>
      </DashboardCard>
    );
  }
  
  const chartData = summary.monthlySummary.map((monthData) => {
    return {
      name: months[monthData.month],
      income: monthData.income,
      expense: monthData.expense,
      balance: monthData.balance,
      month: monthData.month,
      year: monthData.year
    };
  });

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-finance-income">
            Entradas: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-finance-expense">
            Saídas: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-sm font-medium">
            Saldo: {formatCurrency(payload[2].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardCard 
      title="Tendências Mensais" 
      icon={<BarChart3 className="w-5 h-5" />}
      className="col-span-full h-full"
    >
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Entradas" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Saídas" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="balance" name="Saldo" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Nenhum dado para exibir
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
