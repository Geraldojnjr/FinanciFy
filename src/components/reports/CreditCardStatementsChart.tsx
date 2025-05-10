import { useFinance } from "@/contexts/FinanceContext";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/format";

export function CreditCardStatementsChart() {
  const { creditCards, transactions } = useFinance();
  
  // Filter to only paid transactions
  const paidTransactions = transactions.filter(t => t.paid === true || t.paid === 1);
  
  // Filter credit card transactions
  const creditCardTransactions = paidTransactions.filter(t => 
    t.creditCardId || t.credit_card_id
  );
  
  // Group transactions by month/year and card
  const statementData = creditCardTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${month}-${year}`;
    const cardId = transaction.creditCardId || transaction.credit_card_id;
    
    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        label: formatDate(date),
        total: 0,
        cards: {}
      };
    }
    
    if (cardId) {
      if (!acc[key].cards[cardId]) {
        acc[key].cards[cardId] = 0;
      }
      
      acc[key].cards[cardId] += Number(Math.abs(transaction.amount));
      acc[key].total += Number(Math.abs(transaction.amount));
    }
    
    return acc;
  }, {});
  
  // Transform to array format for chart
  const chartData = Object.values(statementData)
    .sort((a: any, b: any) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .slice(-6); // Get last 6 months
  
  // Create data for recharts
  const formattedChartData = chartData.map((item: any) => {
    const dataPoint: any = {
      name: item.label
    };
    
    creditCards.forEach(card => {
      dataPoint[card.name] = item.cards[card.id] || 0;
    });
    
    return dataPoint;
  });
  
  // Generate random colors for each card
  const cardColors = creditCards.map(card => card.color || '#' + Math.floor(Math.random()*16777215).toString(16));
  
  if (formattedChartData.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <p>Não há dados de faturas disponíveis para exibição.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Faturas de Cartão de Crédito</h3>
        <p className="text-sm text-muted-foreground">Evolução de gastos nos últimos meses</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value).replace(/[^\d.,]/g, '')} />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Legend />
            {creditCards.map((card, index) => (
              <Bar 
                key={card.id} 
                dataKey={card.name} 
                fill={card.color || cardColors[index]} 
                name={card.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
