
import { useEffect, useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Category, Transaction } from "@/types/finance";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency } from "@/utils/format";
import { CategoryBadge } from "@/components/ui/category-badge";

export function UpcomingBillsCard() {
  const [upcomingBills, setUpcomingBills] = useState<Transaction[]>([]);
  const { transactions, categories } = useFinance();

  useEffect(() => {
    // Get current date
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Filter for upcoming bills (fixed expenses and credit card payments)
    const bills = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        transaction.type === "expense" &&
        (transaction.expense_type === "fixed" || transaction.payment_method === "credit") &&
        date > now && 
        date <= endOfMonth
      );
    });
    
    // Sort by date
    const sortedBills = bills.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Show max 5 bills
    setUpcomingBills(sortedBills.slice(0, 5));
  }, [transactions]);

  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(category => category.id === categoryId);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground/50 mb-2" />
      <p className="text-muted-foreground">Nenhuma conta próxima do vencimento</p>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-semibold">Próximas Contas</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {upcomingBills.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="divide-y">
            {upcomingBills.map((bill) => {
              const category = getCategoryById(bill.category_id || bill.categoryId || '');
              
              return (
                <div key={bill.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium">
                      {formatDate(bill.date)}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{bill.description}</h3>
                      {category && <CategoryBadge category={category} size="sm" />}
                    </div>
                  </div>
                  
                  <span className="font-semibold text-finance-expense">
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/10 p-4 flex justify-center border-t">
        <Button variant="ghost" size="sm" asChild>
          <a href="/transactions" className="flex items-center gap-1">
            Ver todas <ArrowRight size={14} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
