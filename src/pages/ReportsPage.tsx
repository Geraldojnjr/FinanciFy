import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addMonths, format, startOfMonth, endOfMonth, startOfYear, getYear, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Download, Calendar, BarChart2, PieChart, LineChart, Radar, CreditCard, Target, TrendingUp } from "lucide-react";

import Layout from "@/components/Layout/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataCard } from "@/components/ui/data-card";
import { formatCurrency, formatDate } from "@/utils/format";
import { 
  ExpenseByCategoryPieChart, 
  MonthlyBarChart,
  MonthlyBalanceLineChart,
  CategoryComparisonRadarChart,
  GoalsMonthlyProgressChart,
  InvestmentPortfolioChart,
  CreditCardStatementsChart
} from "@/components/reports";

const PERIOD_OPTIONS = [
  { id: "current-month", label: "Este mês" },
  { id: "last-month", label: "Mês passado" },
  { id: "last-3-months", label: "Últimos 3 meses" },
  { id: "last-6-months", label: "Últimos 6 meses" },
  { id: "current-year", label: "Este ano" },
  { id: "custom", label: "Personalizado" }
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [activeTab, setActiveTab] = useState("visual");

  const { 
    transactions, 
    categories, 
    summary
  } = useFinance();

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    
    const today = new Date();
    let from: Date, to: Date;
    
    switch(value) {
      case "current-month":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "last-month":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(subMonths(today, 1));
        break;
      case "last-3-months":
        from = startOfMonth(subMonths(today, 2));
        to = endOfMonth(today);
        break;
      case "last-6-months":
        from = startOfMonth(subMonths(today, 5));
        to = endOfMonth(today);
        break;
      case "current-year":
        from = new Date(getYear(today), 0, 1);
        to = new Date(getYear(today), 11, 31);
        break;
      default:
        return;
    }
    
    setDateRange({ from, to });
  };
  
  const isInDateRange = (date: Date): boolean => {
    if (!dateRange || !dateRange.from) return false;
    
    const checkDate = new Date(date);
    const startDate = new Date(dateRange.from);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
    endDate.setHours(23, 59, 59, 999);
    
    return checkDate >= startDate && checkDate <= endDate;
  };
  
  // Filter to only include paid transactions
  const allPaidTransactions = transactions.filter(t => t.paid === true);
  
  // Then apply additional filters
  const filteredTransactions = allPaidTransactions.filter(t => {
    const dateMatch = isInDateRange(new Date(t.date));
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(t.category_id);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(t.type);
    
    return dateMatch && categoryMatch && typeMatch;
  });
  
  // Encontrar a categoria de transferência
  const transferCategory = categories.find(
    c => c.name.toLowerCase() === 'transferência' && c.type === 'expense'
  );

  const incomesTotal = filteredTransactions
    .filter(t => 
      t.type === 'income' && 
      t.category_id !== '1009377'
    )
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expensesTotal = filteredTransactions
    .filter(t =>
      t.type === 'expense' &&
      t.category_id !== '1009377'
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const balanceTotal = incomesTotal - expensesTotal;
  
  const getPreviousPeriodData = () => {
    if (selectedPeriod === "custom" || !dateRange?.from || !dateRange?.to) {
      return { incomes: 0, expenses: 0, balance: 0 };
    }
    
    const currentStart = dateRange.from;
    const currentEnd = dateRange.to || dateRange.from;
    const daysDiff = (currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
    
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - daysDiff - 1);
    
    const previousEnd = new Date(currentStart);
    previousEnd.setDate(previousStart.getDate() - 1);
    
    const previousTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= previousStart && date <= previousEnd;
    });
    
    const prevIncomes = previousTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const prevExpenses = previousTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      incomes: prevIncomes,
      expenses: prevExpenses,
      balance: prevIncomes - prevExpenses
    };
  };
  
  const previousPeriod = getPreviousPeriodData();
  
  const getChangePercentage = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  
  const incomesChange = getChangePercentage(incomesTotal, previousPeriod.incomes);
  const expensesChange = getChangePercentage(expensesTotal, previousPeriod.expenses);
  const balanceChange = getChangePercentage(balanceTotal, previousPeriod.balance);
  
  const exportCSV = () => {
    const headers = [
      'Data',
      'Descrição',
      'Categoria',
      'Tipo',
      'Valor'
    ];
    
    const rows = filteredTransactions.map(t => [
      formatDate(t.date),
      t.description,
      categories.find(c => c.id === t.category_id)?.name || 'Sem categoria',
      t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : t.type,
      formatCurrency(t.amount)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_financeiro_${formatDate(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportPDF = () => {
    alert('Funcionalidade de exportação PDF será implementada em breve!');
  };
  
  const formatDateRange = () => {
    if (!dateRange || !dateRange.from) {
      return 'Selecione um período';
    }
    
    const fromDate = formatDate(dateRange.from);
    const toDate = dateRange.to ? formatDate(dateRange.to) : fromDate;
    
    return `${fromDate} - ${toDate}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize relatórios detalhados sobre suas finanças.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>
              <FileText className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Período</p>
                <div className="flex gap-2">
                  <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIOD_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="px-3">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          if (range) setSelectedPeriod("custom");
                        }}
                        numberOfMonths={2}
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateRange()}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Categorias</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Tipo</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataCard 
            title="Total de Receitas" 
            value={formatCurrency(incomesTotal)}
            previousValue={formatCurrency(previousPeriod.incomes)}
            percentageChange={incomesChange}
            trend={incomesChange > 0 ? "up" : incomesChange < 0 ? "down" : "neutral"}
            icon={<BarChart2 className="h-5 w-5" />}
            iconColor="bg-finance-income"
          />
          
          <DataCard 
            title="Total de Despesas" 
            value={formatCurrency(expensesTotal)}
            previousValue={formatCurrency(previousPeriod.expenses)}
            percentageChange={expensesChange}
            trend={expensesChange < 0 ? "up" : expensesChange > 0 ? "down" : "neutral"}
            icon={<BarChart2 className="h-5 w-5" />}
            iconColor="bg-finance-expense"
          />
          
          <DataCard 
            title="Saldo" 
            value={formatCurrency(balanceTotal)}
            previousValue={formatCurrency(previousPeriod.balance)}
            percentageChange={balanceChange}
            trend={balanceChange > 0 ? "up" : balanceChange < 0 ? "down" : "neutral"}
            icon={<BarChart2 className="h-5 w-5" />}
            iconColor="bg-primary"
          />
        </div>
        
        <Tabs defaultValue="visual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visual">Relatório Visual</TabsTrigger>
            <TabsTrigger value="detailed">Relatório Detalhado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Despesas por Categoria</h3>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <ExpenseByCategoryPieChart 
                  transactions={filteredTransactions} 
                  categories={categories} 
                />
              </Card>
              
              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Entradas e Saídas por Mês</h3>
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <MonthlyBarChart transactions={filteredTransactions} />
              </Card>
              
              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Saldo Mensal Acumulado</h3>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </div>
                <MonthlyBalanceLineChart transactions={filteredTransactions} />
              </Card>
              
              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Comparativo de Categorias</h3>
                  <Radar className="h-5 w-5 text-muted-foreground" />
                </div>
                <CategoryComparisonRadarChart 
                  transactions={filteredTransactions}
                  categories={categories}
                />
              </Card>
              
              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Progresso das Metas</h3>
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <GoalsMonthlyProgressChart goals={summary?.goals || []} />
              </Card>

              <Card className="p-4 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Portfólio de Investimentos</h3>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <InvestmentPortfolioChart />
              </Card>
              
              <Card className="p-4 min-h-[400px] md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Gastos com Cartão de Crédito</h3>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <CreditCardStatementsChart />
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4 pt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Relatório Detalhado</h3>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="py-3 px-4 text-left">Data</th>
                        <th className="py-3 px-4 text-left">Descrição</th>
                        <th className="py-3 px-4 text-left">Categoria</th>
                        <th className="py-3 px-4 text-left">Tipo</th>
                        <th className="py-3 px-4 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            Nenhuma transação encontrada para o período selecionado
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((transaction) => {
                          const category = categories.find(c => c.id === transaction.category_id);
                          
                          return (
                            <tr key={transaction.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                {format(new Date(transaction.date), 'dd/MM/yyyy')}
                              </td>
                              <td className="py-3 px-4">
                                {transaction.description}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 rounded-full" style={{
                                    backgroundColor: category?.color || '#94a3b8'
                                  }} />
                                  <span>{category?.name || 'Sem categoria'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {transaction.type === 'income' ? 'Receita' : 
                                 transaction.type === 'expense' ? 'Despesa' : 
                                 transaction.type}
                              </td>
                              <td className={`py-3 px-4 text-right ${
                                transaction.type === 'income' 
                                  ? 'text-finance-income' 
                                  : 'text-finance-expense'
                              } font-medium`}>
                                {formatCurrency(transaction.amount)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
