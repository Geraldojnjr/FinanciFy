import { Investment, InvestmentType } from "@/types/finance";
import { formatDate } from '@/utils/format';

export const investmentTypes: { value: InvestmentType; label: string }[] = [
  { value: "cdb", label: "CDB" },
  { value: "lci", label: "LCI" },
  { value: "lca", label: "LCA" },
  { value: "tesouro", label: "Tesouro Direto" },
  { value: "funds", label: "Fundos de Investimento" },
  { value: "stocks", label: "Ações" },
  { value: "crypto", label: "Criptomoedas" },
  { value: "others", label: "Outros" },
];

export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    cdb: 'CDB',
    lci: 'LCI',
    lca: 'LCA',
    tesouro: 'Tesouro',
    funds: 'Fundos',
    stocks: 'Ações',
    crypto: 'Criptomoedas',
    others: 'Outros'
  };
  return labels[type] || type;
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    cdb: '#4CAF50',
    lci: '#8BC34A',
    lca: '#CDDC39',
    tesouro: '#FFC107',
    funds: '#FF9800',
    stocks: '#F44336',
    crypto: '#9C27B0',
    others: '#607D8B'
  };
  return colors[type] || '#607D8B';
}

export function generateTimelineData(investments: Investment[], investmentId?: string, investment?: Investment): { date: string; value: number }[] {
  // If no investments, return empty data
  if (!investments.length) return [];
  
  // Filter investments if investmentId or investment is provided
  const filteredInvestments = investment 
    ? [investment]
    : investmentId 
    ? investments.filter(inv => inv.id === investmentId)
    : investments;
  
  // If no matching investments, return empty data
  if (!filteredInvestments.length) return [];
  
  // Get the earliest investment date
  const earliestDate = new Date(
    Math.min(...filteredInvestments.map(inv => new Date(inv.initialDate).getTime()))
  );
  
  // Get current date
  const today = new Date();
  
  // Generate monthly data points from earliest date to today
  const data: { date: string; value: number }[] = [];
  const currentDate = new Date(earliestDate);
  
  while (currentDate <= today) {
    // Calculate portfolio value at this point in time
    const pointInTime = new Date(currentDate);
    let totalValue = 0;
    
    // Calculate value of each active investment at this point
    filteredInvestments.forEach(inv => {
      const startDate = new Date(inv.initialDate);
      
      // Only include investments that existed at this point in time
      if (startDate <= pointInTime) {
        // Simple calculation - in a real app you would calculate
        // actual returns based on investment details
        const monthsSinceStart = 
          (pointInTime.getFullYear() - startDate.getFullYear()) * 12 + 
          (pointInTime.getMonth() - startDate.getMonth());
        
        const expectedMonthlyReturn = inv.expectedReturn 
          ? inv.expectedReturn / 12 / 100
          : 0.005; // Default to 6% annual (0.5% monthly) if not specified
        
        // Compound interest calculation
        const value = inv.amount * Math.pow(1 + expectedMonthlyReturn, monthsSinceStart);
        totalValue += value;
      }
    });
    
    // Add data point
    data.push({
      date: currentDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      value: totalValue
    });
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return data;
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A";
  
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Se a string já estiver no formato ISO (YYYY-MM-DD)
      if (date.includes('T')) {
        dateObj = new Date(date);
      } else {
        // Tentar converter a string para Date
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    if (isNaN(dateObj.getTime())) {
      console.error('Data inválida:', date);
      return 'Data inválida';
    }
    
    // Formatar a data usando Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
    
    return formattedDate;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
} 