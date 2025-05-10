import { useFinance } from "@/contexts/FinanceContext";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { useInvestmentStats } from "@/hooks/useInvestmentStats";

export function InvestmentsSummary() {
  const { investments } = useFinance();
  const stats = useInvestmentStats(investments);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-muted-foreground text-sm">Total Investido</h3>
        <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalInvested)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {investments.length} investimento{investments.length !== 1 ? 's' : ''}
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-muted-foreground text-sm">Rendimento Total</h3>
        <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalReturn)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Média de retorno: {stats.averageReturn.toFixed(2)}%
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-muted-foreground text-sm">Melhor Investimento</h3>
        <p className="text-2xl font-bold mt-1">
          {stats.bestPerforming ? stats.bestPerforming.name : 'N/A'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.bestPerforming ? `${stats.bestPerforming.currentReturn}% de retorno` : 'Sem investimentos'}
        </p>
      </Card>
    </div>
  );
}
