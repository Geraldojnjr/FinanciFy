import { InvestmentFormValues } from "@/components/investments/InvestmentForm";

export type TransactionType = "income" | "expense" | "investment";
export type PaymentMethod = "cash" | "credit" | "debit" | "pix" | "transfer";
export type ExpenseType = "fixed" | "variable";
export type CategoryType = "income" | "expense" | "investment";
export type InvestmentType = 
  | "cdb" 
  | "lci" 
  | "lca" 
  | "tesouro" 
  | "funds" 
  | "stocks" 
  | "crypto" 
  | "others";
export type AccountType = 
  | "checking" 
  | "savings" 
  | "wallet" 
  | "investment" 
  | "other";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  budget?: number;
  currentAmount?: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category_id: string;
  payment_method: PaymentMethod;
  expense_type?: ExpenseType;
  account_id?: string;
  credit_card_id?: string;
  installments?: number;
  current_installment?: number;
  active?: boolean;
  paid: boolean;
  parent_transaction_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  available_limit: number;
  due_day: number;
  created_at?: string;
  updated_at?: string;
  color?: string;
  closing_day?: number;
  limit_amount?: number;
}

export interface CreditCardStatement {
  id: string;
  creditCardId: string;
  month: number;
  year: number;
  closingDate: Date;
  dueDate: Date;
  totalAmount: number;
  transactions: Transaction[];
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  color?: string;
  bank?: string;
  initialBalance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  category_id?: string;
  notes?: string;
  color?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  type: InvestmentType;
  initialDate: string;
  dueDate?: string;
  expectedReturn?: number;
  currentReturn?: number;
  categoryId: string;
  goalId?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalInvestments: number;
  categorySummary: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
  monthlySummary: MonthlyData[];
}

export interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Component Props Interfaces
export interface MonthlyData {
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
}

export interface IncomeExpenseChartProps {
  data: MonthlyData[];
}

export interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

export interface BalanceCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CreditCardSpendingChartProps {
  cardId: string;
  transactions: Transaction[];
}

export interface CreditCardsListProps {
  onSelectCard: (cardId: string) => void;
  onAddCard: () => void;
}

export interface CreditCardStatementsProps {
  cardId: string;
}

export interface CreditCardDetailProps {
  card: CreditCard;
  onEdit: () => void;
}

export interface InvestmentTimelineChartProps {
  investments: Investment[];
}

export interface TimelineDataPoint {
  date: Date;
  amount: number;
}

export interface InvestmentTypeDistributionChartProps {
  investments: Investment[];
}

export interface InvestmentDetailProps {
  investment: Investment;
  onEdit: (investment: Investment) => void;
  onBack: () => void;
}

export interface InvestmentFormProps {
  investment?: Investment;
  onSubmit: (data: InvestmentFormValues) => void;
  onCancel: () => void;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  type?: 'income' | 'expense';
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}
