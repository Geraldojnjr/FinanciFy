
import { ActivityIcon } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CategoryBadge } from "@/components/ui/category-badge";

export function RecentTransactionsCard() {
  const { transactions = [], getCategoryById } = useFinance();

  // Get the most recent transactions
  const recentTransactions = Array.isArray(transactions) 
    ? [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600 dark:text-green-400";
      case "expense":
        return "text-red-600 dark:text-red-400";
      case "credit":
        return "text-purple-600 dark:text-purple-400";
      case "investment":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "";
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return 'Data não definida';
    return formatRelative(new Date(date), new Date(), {
      locale: ptBR
    });
  };

  return (
    <DashboardCard 
      title="Transações Recentes" 
      icon={<ActivityIcon className="w-5 h-5" />}
      footer={
        <div className="text-center">
          <Button variant="link" size="sm" asChild>
            <Link to="/transactions">Ver todas as transações</Link>
          </Button>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => {
            const category = getCategoryById(transaction.category_id ?? "");
            
            return (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <CategoryBadge category={category} size="sm" />
                  <div>
                    <h4 className="font-medium text-sm">{transaction.description}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <span className={`font-medium text-sm ${getTypeStyles(transaction.type)} w-24 text-right`}>
                  {transaction.type === "expense" || transaction.type === "credit" ? "- " : "+ "}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Nenhuma transação recente
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
