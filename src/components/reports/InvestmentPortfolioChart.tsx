
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/FinanceContext";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/format";
import { InvestmentType } from "@/types/finance";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#A259FF", // Purple
  "#FF6B6B", // Red
  "#4BC0C0", // Teal
  "#F7A35C", // Light Orange
];

const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  "cdb": "CDB",
  "lci": "LCI",
  "lca": "LCA",
  "tesouro": "Tesouro Direto",
  "funds": "Fundos",
  "stocks": "Ações",
  "crypto": "Criptomoedas",
  "others": "Outros",
};

interface InvestmentData {
  name: string;
  value: number;
  type: InvestmentType;
}

export function InvestmentPortfolioChart() {
  const { investments } = useFinance();
  
  // Group investments by type
  const groupedInvestments = investments.reduce((acc, inv) => {
    const type = inv.type as InvestmentType;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += inv.amount;
    return acc;
  }, {} as Record<InvestmentType, number>);
  
  // Format data for PieChart
  const chartData: InvestmentData[] = Object.entries(groupedInvestments).map(([type, value]) => ({
    name: INVESTMENT_TYPE_LABELS[type as InvestmentType] || type,
    value,
    type: type as InvestmentType,
  }));

  // Calculate total investment amount
  const totalInvestment = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">
            {(data.value / totalInvestment * 100).toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };
  
  // If no data, show a message
  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfólio de Investimentos</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Sem investimentos para exibir</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfólio de Investimentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Total: {formatCurrency(totalInvestment)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
