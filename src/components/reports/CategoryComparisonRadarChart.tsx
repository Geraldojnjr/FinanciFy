
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category } from '@/types/finance';
import { formatCurrency } from '@/utils/format';

interface CategoryComparisonRadarChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function CategoryComparisonRadarChart({ transactions, categories }: CategoryComparisonRadarChartProps) {
  // Only use paid transactions
  const paidTransactions = transactions.filter(t => t.paid === true || t.paid === 1);
  
  // Filter expense transactions
  const expenses = paidTransactions.filter(t => t.type === 'expense' && t.category_id);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const categoryId = transaction.category_id;
    if (!categoryId) return acc;
    
    // Get expense date info
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Create month key
    const monthKey = `${year}-${month}`;
    
    // Initialize category and month if needed
    if (!acc[categoryId]) {
      acc[categoryId] = {};
    }
    
    if (!acc[categoryId][monthKey]) {
      acc[categoryId][monthKey] = 0;
    }
    
    // Add expense amount
    acc[categoryId][monthKey] += Math.abs(Number(transaction.amount));
    
    return acc;
  }, {} as Record<string, Record<string, number>>);
  
  // Get the top 5 categories by total amount
  const topCategories = Object.entries(expensesByCategory)
    .map(([categoryId, monthData]) => {
      const category = categories.find(c => c.id === categoryId);
      const totalAmount = Object.values(monthData).reduce((sum, amount) => sum + amount, 0);
      
      return {
        categoryId,
        name: category?.name || 'Sem categoria',
        color: category?.color || '#94a3b8',
        totalAmount
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
  
  // Get unique months from all transactions
  const uniqueMonths = [...new Set(
    paidTransactions.map(t => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth()}`;
    })
  )]
    .sort()
    .slice(-3); // Last 3 months
  
  // Format month labels
  const monthLabels = uniqueMonths.map(monthKey => {
    const [year, month] = monthKey.split('-').map(n => parseInt(n));
    return {
      key: monthKey,
      label: new Date(year, month).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    };
  });
  
  // Create data for radar chart
  const chartData = topCategories.map(category => {
    const monthData = uniqueMonths.reduce((acc, monthKey) => {
      acc[monthKey] = expensesByCategory[category.categoryId]?.[monthKey] || 0;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      name: category.name,
      color: category.color,
      ...Object.fromEntries(
        monthLabels.map(({ key, label }) => [label, monthData[key]])
      )
    };
  });
  
  // Handle no data scenario
  if (chartData.length === 0 || uniqueMonths.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Dados insuficientes para gerar o gráfico de comparação
      </div>
    );
  }
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis tickFormatter={(value) => formatCurrency(value).replace(/[^\d.,]/g, '')} />
          
          {monthLabels.map(({ label }, index) => (
            <Radar
              key={label}
              name={label}
              dataKey={label}
              stroke={`hsl(${(index * 120) % 360}, 70%, 50%)`}
              fill={`hsl(${(index * 120) % 360}, 70%, 50%)`}
              fillOpacity={0.5}
            />
          ))}
          
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
