import { BarChart3, CreditCard, LineChart, PiggyBank, Wallet } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpensesByCategoryCard } from "@/components/dashboard/ExpensesByCategoryCard";
import { MonthlyTrendsCard } from "@/components/dashboard/MonthlyTrendsCard";
import { GoalsCard } from "@/components/dashboard/GoalsCard";
import { RecentTransactionsCard } from "@/components/dashboard/RecentTransactionsCard";
import { UpcomingBillsCard } from "@/components/dashboard/UpcomingBillsCard";
import { CreditCardsCard } from "@/components/dashboard/CreditCardsCard";
import { DataCard } from "@/components/ui/data-card";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { Loader2 } from "lucide-react";

const Index = () => {
  const { summary, isLoading } = useFinance();
  
  // Default values if summary is undefined
  const totalBalance = summary?.totalBalance ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpenses = summary?.totalExpense ?? 0;
  const totalInvestments = summary?.totalInvestments ?? 0;
  
  // Format monthly data for charts
  const monthlyData: MonthlyData[] = summary?.monthlySummary?.map(item => ({
    month: `${item.month}/${item.year}`,
    income: item.income,
    expenses: item.expense
  })) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas finanças
          </p>
        </div>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <BalanceCard 
            totalIncome={totalIncome}
            totalExpense={totalExpenses}
            balance={totalBalance}
          />
          
          <div className="grid grid-cols-1 gap-6">
            <DataCard
              title="Receitas"
              value={formatCurrency(totalIncome)}
              icon={<Wallet size={20} />}
              iconColor="bg-finance-income/20 text-finance-income"
              trend="neutral"
            />
            
            <DataCard
              title="Despesas"
              value={formatCurrency(totalExpenses)}
              icon={<BarChart3 size={20} />}
              iconColor="bg-finance-expense/20 text-finance-expense"
              trend="neutral"
            />
            
            <DataCard
              title="Investimentos"
              value={formatCurrency(totalInvestments)}
              icon={<LineChart size={20} />}
              iconColor="bg-finance-investment/20 text-finance-investment"
              trend="up"
              percentageChange={5.2}
            />
          </div>
        </div>
        
        {/* Charts and Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExpensesByCategoryCard />
          <GoalsCard />
          <RecentTransactionsCard />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingBillsCard />
          <CreditCardsCard />
        </div>
        
        <MonthlyTrendsCard />

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Receitas e Despesas</h2>
          <IncomeExpenseChart data={monthlyData} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
