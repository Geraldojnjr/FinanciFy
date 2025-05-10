
import { Category, Transaction, CreditCard, Goal, Investment, TransactionType, PaymentMethod, BankAccount } from "@/types/finance";

export const mockCategories: Category[] = [
  // Categorias de entrada
  { id: "cat1", name: "Salário", icon: "banknote", color: "#4ade80", type: "income" },
  { id: "cat2", name: "Freelance", icon: "laptop", color: "#34d399", type: "income" },
  { id: "cat3", name: "Investimentos", icon: "trending-up", color: "#a78bfa", type: "income" },
  { id: "cat4", name: "Presentes", icon: "gift", color: "#f472b6", type: "income" },
  
  // Categorias de saída
  { id: "cat5", name: "Alimentação", icon: "utensils", color: "#f87171", type: "expense", budget: 800, currentAmount: 450 },
  { id: "cat6", name: "Transporte", icon: "car", color: "#fb923c", type: "expense", budget: 500, currentAmount: 320 },
  { id: "cat7", name: "Moradia", icon: "home", color: "#60a5fa", type: "expense", budget: 2000, currentAmount: 1800 },
  { id: "cat8", name: "Lazer", icon: "film", color: "#c084fc", type: "expense", budget: 300, currentAmount: 250 },
  { id: "cat9", name: "Saúde", icon: "heart-pulse", color: "#94a3b8", type: "expense", budget: 400, currentAmount: 180 },
  { id: "cat10", name: "Educação", icon: "book", color: "#22c55e", type: "expense", budget: 600, currentAmount: 600 },
  
  // Categorias de investimento
  { id: "cat11", name: "Renda Fixa", icon: "landmark", color: "#a78bfa", type: "investment" },
  { id: "cat12", name: "Ações", icon: "bar-chart", color: "#818cf8", type: "investment" },
  { id: "cat13", name: "Cripto", icon: "bitcoin", color: "#f59e0b", type: "investment" },
];

export const mockCreditCards: CreditCard[] = [
  { id: "card1", name: "Nubank", limit: 8000, closingDay: 3, dueDay: 10, color: "#9333ea" },
  { id: "card2", name: "Itaú", limit: 5000, closingDay: 20, dueDay: 27, color: "#f97316" },
  { id: "card3", name: "Banco do Brasil", limit: 6500, closingDay: 15, dueDay: 22, color: "#facc15" },
];

const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();

const createDate = (day: number, monthOffset: number = 0) => {
  const date = new Date();
  date.setMonth(thisMonth + monthOffset);
  date.setDate(day);
  return date;
};

export const mockTransactions: Transaction[] = [
  // Rendas
  {
    id: "t1",
    amount: 5000,
    date: createDate(5),
    description: "Salário",
    category_id: "cat1",
    type: "income",
    payment_method: "transfer",
    user_id: "1"
  },
  {
    id: "t2",
    amount: 1200,
    date: createDate(15),
    description: "Freelance site XYZ",
    category_id: "cat2",
    type: "income",
    payment_method: "pix",
    user_id: "1"
  },
  {
    id: "t3",
    amount: 250,
    date: createDate(22),
    description: "Dividendos",
    category_id: "cat3",
    type: "income",
    payment_method: "transfer",
    user_id: "1"
  },
  
  // Despesas
  {
    id: "t4",
    amount: 120,
    date: createDate(8),
    description: "Supermercado",
    category_id: "cat5",
    type: "expense",
    payment_method: "debit",
    expense_type: "variable",
    user_id: "1"
  },
  {
    id: "t5",
    amount: 1800,
    date: createDate(10),
    description: "Aluguel",
    category_id: "cat7",
    type: "expense",
    payment_method: "pix",
    expense_type: "fixed",
    user_id: "1"
  },
  {
    id: "t6",
    amount: 150,
    date: createDate(12),
    description: "Academia",
    category_id: "cat9",
    type: "expense",
    payment_method: "credit",
    expense_type: "fixed",
    credit_card_id: "card1",
    user_id: "1"
  },
  {
    id: "t7",
    amount: 600,
    date: createDate(15),
    description: "Curso Online",
    category_id: "cat10",
    type: "expense",
    payment_method: "credit",
    expense_type: "variable",
    credit_card_id: "card1",
    installments: 6,
    current_installment: 1,
    user_id: "1"
  },
  {
    id: "t8",
    amount: 80,
    date: createDate(18),
    description: "Combustível",
    category_id: "cat6",
    type: "expense",
    payment_method: "credit",
    expense_type: "variable",
    credit_card_id: "card2",
    user_id: "1"
  },
  {
    id: "t9",
    amount: 200,
    date: createDate(20),
    description: "Cinema e jantar",
    category_id: "cat8",
    type: "expense",
    payment_method: "credit",
    expense_type: "variable",
    credit_card_id: "card1",
    user_id: "1"
  },

  // Investimentos
  {
    id: "t10",
    amount: 1000,
    date: createDate(10),
    description: "CDB Banco Inter",
    category_id: "cat11",
    type: "investment",
    payment_method: "transfer",
    user_id: "1"
  },
  {
    id: "t11",
    amount: 500,
    date: createDate(15),
    description: "ETF Global",
    category_id: "cat12",
    type: "investment",
    payment_method: "transfer",
    user_id: "1"
  },
  {
    id: "t12",
    amount: 300,
    date: createDate(20),
    description: "Bitcoin",
    category_id: "cat13",
    type: "investment",
    payment_method: "transfer",
    user_id: "1"
  }
];

export const mockGoals: Goal[] = [
  {
    id: "goal1",
    name: "Reserva de Emergência",
    targetAmount: 30000,
    currentAmount: 15000,
    deadline: new Date(thisYear, thisMonth + 6, 1),
    categoryId: "cat11",
    color: "#4ade80"
  },
  {
    id: "goal2",
    name: "Viagem para Europa",
    targetAmount: 15000,
    currentAmount: 5000,
    deadline: new Date(thisYear + 1, 5, 1),
    color: "#a78bfa"
  },
  {
    id: "goal3",
    name: "Comprar Carro",
    targetAmount: 50000,
    currentAmount: 10000,
    deadline: new Date(thisYear + 2, 0, 1),
    color: "#60a5fa"
  }
];

export const mockInvestments: Investment[] = [
  {
    id: "inv1",
    name: "CDB Banco Inter",
    type: "cdb",
    amount: 12000,
    initialDate: new Date(thisYear - 1, 6, 10),
    dueDate: new Date(thisYear + 1, 6, 10),
    expectedReturn: 0.12,
    currentReturn: 0.09,
    categoryId: "cat11",
    goalId: "goal1"
  },
  {
    id: "inv2",
    name: "Tesouro IPCA+",
    type: "tesouro",
    amount: 10000,
    initialDate: new Date(thisYear - 1, 3, 15),
    dueDate: new Date(thisYear + 3, 3, 15),
    expectedReturn: 0.055,
    currentReturn: 0.057,
    categoryId: "cat11"
  },
  {
    id: "inv3",
    name: "ETF Global",
    type: "stocks",
    amount: 8000,
    initialDate: new Date(thisYear - 1, 10, 5),
    expectedReturn: 0.15,
    currentReturn: 0.11,
    categoryId: "cat12"
  },
  {
    id: "inv4",
    name: "Bitcoin",
    type: "crypto",
    amount: 5000,
    initialDate: new Date(thisYear, 0, 20),
    expectedReturn: 0.5,
    currentReturn: 0.35,
    categoryId: "cat13"
  }
];

export const mockAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Conta Corrente',
    balance: 5000,
    type: 'checking',
    bank: 'Banco do Brasil',
    initialBalance: 5000,
    color: "#4CAF50",
    isActive: true
  },
  {
    id: '2',
    name: 'Poupança',
    balance: 10000,
    type: 'savings',
    bank: 'Nubank',
    initialBalance: 8000,
    color: "#2196F3",
    isActive: true
  }
];

// Função para calcular o resumo financeiro com base nas transações
export const calculateFinancialSummary = () => {
  const totalIncome = mockTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = mockTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalInvestments = mockTransactions
    .filter(t => t.type === "investment")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
    totalInvestments,
    categorySummary: getCategorySummary(),
    monthlySummary: getMonthlySummary()
  };
};

const getCategorySummary = () => {
  const categoriesMap = new Map<string, number>();
  
  mockTransactions
    .filter(t => t.type === "expense")
    .forEach(transaction => {
      const currentAmount = categoriesMap.get(transaction.categoryId) || 0;
      categoriesMap.set(transaction.categoryId, currentAmount + transaction.amount);
    });
  
  const totalExpenses = [...categoriesMap.values()].reduce((sum, value) => sum + value, 0);
  
  return Array.from(categoriesMap.entries()).map(([categoryId, amount]) => ({
    categoryId,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  }));
};

const getMonthlySummary = () => {
  // Simplificado para mostrar apenas o mês atual para este exemplo
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  startDate.setDate(1);
  
  const monthlySummary = [];
  
  for (let i = 0; i < 6; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + i);
    
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const income = mockTransactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === "income" && 
               tDate.getMonth() === month && 
               tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = mockTransactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === "expense" && 
               tDate.getMonth() === month && 
               tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlySummary.push({
      month,
      year,
      income,
      expense,
      balance: income - expense
    });
  }
  
  return monthlySummary;
};
