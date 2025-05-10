import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { Transaction, Category, BankAccount, CreditCard, FinancialSummary, Goal, Investment } from '@/types/finance';
import { TransactionService } from '@/services/TransactionService';
import { GoalsService } from "@/services/GoalsService";
import { InvestmentService } from "@/services/InvestmentService";
import { CreditCardServiceFactory } from "@/services/factories/CreditCardServiceFactory";
import { getSupabaseClient, loadDatabaseConfig } from '@/lib/databaseConfig';
import { MariaDBClient } from '@/lib/types';
import { getSupabase as getSupabaseLib } from '@/lib/supabase';

interface FinanceContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  creditCards: CreditCard[];
  summary: FinancialSummary;
  goals: Goal[];
  investments: Investment[];
  user_id: string;
  addAccount: (account: Omit<BankAccount, 'id'>) => Promise<BankAccount>;
  updateAccount: (account: BankAccount) => Promise<BankAccount>;
  deleteAccount: (accountId: string) => Promise<void>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<Transaction>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addCreditCard: (card: Omit<CreditCard, 'id'>) => Promise<CreditCard>;
  updateCreditCard: (id: string, card: Partial<CreditCard>) => Promise<CreditCard>;
  deleteCreditCard: (cardId: string) => Promise<void>;
  getFilteredTransactions: (filter: { startDate?: Date; endDate?: Date; categoryId?: string; accountId?: string }) => Transaction[];
  getCategoryById: (categoryId: string) => Category | undefined;
  getCreditCardTransactions: (cardId: string) => Transaction[];
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  addInvestment: (investment: Investment) => Promise<void>;
  updateInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (investmentId: string) => Promise<void>;
  setTransactions: (transactions: Transaction[]) => void;
  loadTransactions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    totalInvestments: 0,
    categorySummary: [],
    monthlySummary: []
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string>('');

  const config = loadDatabaseConfig();
  const client = getSupabaseClient() as unknown as MariaDBClient;
  const [transactionService] = useState(() => new TransactionService(client));
  const [goalsService] = useState(() => new GoalsService(client));
  const [investmentService] = useState(() => new InvestmentService(client));
  const [creditCardService] = useState(() => CreditCardServiceFactory.create(client));

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const supabase = getSupabaseLib();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar ID do usuário:', error);
      }
    };
    loadUserId();
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const loadedCategories = await transactionService.getCategories();
      if (Array.isArray(loadedCategories)) {
        setCategories(loadedCategories);
      } else {
        console.error('Categories data is not an array:', loadedCategories);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Erro ao carregar categorias');
      setCategories([]);
    }
  }, [transactionService]);

  const loadAccounts = useCallback(async () => {
    try {
      const loadedAccounts = await transactionService.getAccounts();
      // console.log('Loaded accounts:', loadedAccounts); // Para debug
      
      if (Array.isArray(loadedAccounts)) {
        setAccounts(loadedAccounts);
      } else {
        console.error('Loaded accounts is not an array:', loadedAccounts);
        setAccounts([]);
        toast.error('Erro ao carregar contas: dados inválidos');
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setAccounts([]);
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar contas bancárias');
    }
  }, [transactionService]);

  const loadCreditCards = useCallback(async () => {
    // console.log('FinanceContext - Loading credit cards'); // Para debug
    try {
      const cards = await creditCardService.getCreditCards();
      // console.log('FinanceContext - Loaded credit cards:', cards); // Para debug
      setCreditCards(cards);
    } catch (error) {
      console.error('FinanceContext - Error loading credit cards:', error); // Para debug
      toast.error('Erro ao carregar cartões de crédito');
    }
  }, [creditCardService]);

  const loadGoals = useCallback(async () => {
    try {
      const loadedGoals = await goalsService.getGoals();
      const loadedInvestments = await investmentService.getInvestments();
      
      // Atualizar o current_amount de cada meta somando os investimentos vinculados
      const updatedGoals = loadedGoals.map(goal => {
        const totalInvestido = loadedInvestments
          .filter(inv => inv.goalId === goal.id)
          .reduce((sum, inv) => sum + inv.amount, 0);
        return {
          ...goal,
          current_amount: totalInvestido
        };
      });
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Erro ao carregar metas');
    }
  }, [goalsService, investmentService]);

  const loadInvestments = useCallback(async () => {
    try {
      const loadedInvestments = await investmentService.getInvestments();
      setInvestments(loadedInvestments);
    } catch (error) {
      console.error('Error loading investments:', error);
      toast.error('Erro ao carregar investimentos');
    }
  }, [investmentService]);

  // Account management
  const addAccount = useCallback(async (account: Omit<BankAccount, 'id'>): Promise<BankAccount> => {
    try {
      const newAccount = await transactionService.createAccount(account);
      await loadAccounts();
      toast.success('Conta bancária adicionada com sucesso!');
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      toast.error('Erro ao adicionar conta bancária');
      throw error;
    }
  }, [transactionService, loadAccounts]);

  const updateAccount = useCallback(async (account: BankAccount): Promise<BankAccount> => {
    try {
      const updatedAccount = await transactionService.updateAccount(account);
      await loadAccounts();
      toast.success('Conta bancária atualizada com sucesso!');
      return updatedAccount;
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Erro ao atualizar conta bancária');
      throw error;
    }
  }, [transactionService, loadAccounts]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await transactionService.deleteAccount(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      toast.success('Conta bancária removida com sucesso!');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Erro ao remover conta bancária');
    }
  }, [transactionService]);

  // Credit card management
  const addCreditCard = async (card: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
    // console.log('FinanceContext - Adding credit card:', card); // Para debug
    try {
      const newCard = await creditCardService.createCreditCard(card);
      // console.log('FinanceContext - Added credit card:', newCard); // Para debug
      setCreditCards(prev => [...prev, newCard]);
      toast.success('Cartão de crédito adicionado com sucesso');
      return newCard;
    } catch (error) {
      console.error('FinanceContext - Error adding credit card:', error); // Para debug
      toast.error('Erro ao adicionar cartão de crédito');
      throw error;
    }
  };

  const updateCreditCard = async (id: string, card: Partial<CreditCard>): Promise<CreditCard> => {
    // console.log('FinanceContext - Updating credit card:', { id, card }); // Para debug
    try {
      const updatedCard = await creditCardService.updateCreditCard(id, card);
      // console.log('FinanceContext - Updated credit card:', updatedCard); // Para debug
      setCreditCards(prev => prev.map(c => c.id === id ? updatedCard : c));
      toast.success('Cartão de crédito atualizado com sucesso');
      return updatedCard;
    } catch (error) {
      console.error('FinanceContext - Error updating credit card:', error); // Para debug
      toast.error('Erro ao atualizar cartão de crédito');
      throw error;
    }
  };

  const deleteCreditCard = async (id: string) => {
    // console.log('FinanceContext - Deleting credit card:', id); // Para debug
    try {
      await creditCardService.deleteCreditCard(id);
      // console.log('FinanceContext - Deleted credit card successfully'); // Para debug
      setCreditCards(prev => prev.filter(c => c.id !== id));
      toast.success('Cartão de crédito excluído com sucesso');
    } catch (error) {
      console.error('FinanceContext - Error deleting credit card:', error); // Para debug
      toast.error('Erro ao excluir cartão de crédito');
    }
  };

  // Error handling
  const handleError = useCallback((error: Error) => {
    console.error('FinanceContext error:', error);
    setError(error.message);
    toast.error(error.message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Transaction management
  const loadTransactions = useCallback(async () => {
    try {
      clearError();
      const transactions = await transactionService.getTransactions();
      setTransactions(transactions);
    } catch (error) {
      handleError(error as Error);
    }
  }, [clearError, handleError, transactionService]);

  const addTransaction = useCallback(async (transaction: Partial<Transaction>) => {
    try {
      // Garantir que todos os campos obrigatórios existem para Omit<Transaction, 'id'>
      const {
        user_id,
        description,
        amount,
        date,
        type,
        category_id,
        payment_method,
        paid,
        ...rest
      } = transaction;
      if (!user_id || !description || !amount || !date || !type || !category_id || !payment_method) {
        throw new Error('Campos obrigatórios ausentes para criar transação');
      }
      await transactionService.createTransaction({
        user_id,
        description,
        amount,
        date,
        type,
        category_id,
        payment_method,
        paid: paid ?? false,
        ...rest
      });
      await loadTransactions();
      toast.success('Transação adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Erro ao adicionar transação');
      throw error;
    }
  }, [transactionService, loadTransactions]);

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    try {
      clearError();
      const updatedTransaction = await transactionService.updateTransaction(transaction.id, transaction);
      await loadTransactions();
      toast.success('Transação atualizada com sucesso!');
      return updatedTransaction;
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [clearError, handleError, transactionService, loadTransactions]);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      clearError();
      await transactionService.deleteTransaction(transactionId);
      await loadTransactions();
      toast.success('Transação removida com sucesso!');
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [clearError, handleError, transactionService, loadTransactions]);

  // Category management
  const addCategory = async (category: Category) => {
    try {
      const newCategory = await transactionService.createCategory(category);
      setCategories([...categories, newCategory]);
      toast.success('Categoria adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar categoria');
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      const updatedCategory = await transactionService.updateCategory(category.id, category);
      setCategories(categories.map(c => c.id === category.id ? updatedCategory : c));
      toast.success('Categoria atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await transactionService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success('Categoria removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover categoria');
    }
  };

  // Goal management
  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const newGoal = await goalsService.createGoal(goal);
      setGoals([...goals, newGoal]);
      toast.success('Meta adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Erro ao adicionar meta');
    }
  };

  const updateGoal = async (goal: Goal) => {
    try {
      const updatedGoal = await goalsService.updateGoal(goal);
      setGoals(goals.map(g => g.id === goal.id ? updatedGoal : g));
      toast.success('Meta atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await goalsService.deleteGoal(goalId);
      setGoals(goals.filter(g => g.id !== goalId));
      toast.success('Meta removida com sucesso!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao remover meta');
    }
  };

  // Investment management
  const addInvestment = async (investment: Investment) => {
    try {
      const newInvestment = await investmentService.createInvestment(investment);
      setInvestments(prev => [...prev, newInvestment]);
      
      // Atualizar o current_amount da meta se o investimento estiver vinculado a uma
      if (newInvestment.goalId) {
        const goal = goals.find(g => g.id === newInvestment.goalId);
        if (goal) {
          const updatedGoal = {
            ...goal,
            current_amount: goal.current_amount + newInvestment.amount
          };
          await updateGoal(updatedGoal);
        }
      }
      
      toast.success('Investimento adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding investment:', error);
      toast.error('Erro ao adicionar investimento');
      throw error;
    }
  };

  const updateInvestment = async (investment: Investment) => {
    try {
      const oldInvestment = investments.find(i => i.id === investment.id);
      const updatedInvestment = await investmentService.updateInvestment(investment.id, investment);
      setInvestments(investments.map(i => i.id === investment.id ? updatedInvestment : i));
      
      // Atualizar o current_amount das metas se houver mudança no goalId ou no amount
      if (oldInvestment.goalId !== investment.goalId) {
        // Remover o valor da meta antiga
        if (oldInvestment.goalId) {
          const oldGoal = goals.find(g => g.id === oldInvestment.goalId);
          if (oldGoal) {
            const updatedOldGoal = {
              ...oldGoal,
              current_amount: oldGoal.current_amount - oldInvestment.amount
            };
            await updateGoal(updatedOldGoal);
          }
        }
        
        // Adicionar o valor à nova meta
        if (investment.goalId) {
          const newGoal = goals.find(g => g.id === investment.goalId);
          if (newGoal) {
            const updatedNewGoal = {
              ...newGoal,
              current_amount: newGoal.current_amount + investment.amount
            };
            await updateGoal(updatedNewGoal);
          }
        }
      } 
      // Se mudou o valor do investimento
      else if (oldInvestment.amount !== investment.amount && investment.goalId) {
        const goal = goals.find(g => g.id === investment.goalId);
        if (goal) {
          const updatedGoal = {
            ...goal,
            current_amount: goal.current_amount - oldInvestment.amount + investment.amount
          };
          await updateGoal(updatedGoal);
        }
      }
      
      toast.success('Investimento atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating investment:', error);
      toast.error('Erro ao atualizar investimento');
    }
  };

  const deleteInvestment = async (investmentId: string) => {
    try {
      const investment = investments.find(i => i.id === investmentId);
      if (!investment) {
        throw new Error('Investimento não encontrado');
      }

      await investmentService.deleteInvestment(investmentId);
      setInvestments(investments.filter(i => i.id !== investmentId));
      
      // Atualizar o current_amount da meta se o investimento estiver vinculado a uma
      if (investment.goalId) {
        const goal = goals.find(g => g.id === investment.goalId);
        if (goal) {
          const updatedGoal = {
            ...goal,
            current_amount: goal.current_amount - investment.amount
          };
          await updateGoal(updatedGoal);
        }
      }
      
      toast.success('Investimento removido com sucesso!');
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast.error('Erro ao remover investimento');
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      // Verifica se o usuário está autenticado
      const supabase = getSupabaseLib();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        await Promise.all([
          loadCategories(),
          loadAccounts(),
          loadCreditCards(),
          loadGoals(),
          loadInvestments(),
          loadTransactions()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadCategories, loadAccounts, loadCreditCards, loadGoals, loadInvestments, loadTransactions]);

  // Calculate financial summary
  const calculateSummary = useCallback(() => {
    if (!categories?.length || !transactions?.length) {
      setSummary({
        totalIncome: 0,
        totalExpense: 0,
        totalBalance: 0,
        totalInvestments: 0,
        categorySummary: [],
        monthlySummary: []
      });
      return;
    }
    
    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvestments = 0;

    // Calculate category amounts (apenas para despesas)
    const categoryAmounts = new Map<string, number>();
    transactions.forEach(transaction => {
      // Considerar apenas transações pagas
      if (!transaction.paid) return;

      const amount = Math.abs(transaction.amount);
      
      // Calcular totais de receitas e despesas
      if (transaction.type === 'expense') {
        totalExpense += amount;
        // Adicionar ao mapa de categorias apenas se for despesa
        const categoryId = transaction.category_id;
        categoryAmounts.set(
          categoryId, 
          (categoryAmounts.get(categoryId) || 0) + amount
        );
      } else if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      }
    });

    // Calculate total for percentages (apenas despesas)
    const totalExpenses = Array.from(categoryAmounts.values()).reduce((sum, amount) => sum + amount, 0);

    // Build category summary (apenas despesas)
    const categorySummary = Array.from(categoryAmounts.entries()).map(([categoryId, amount]) => ({
      categoryId,
      amount: Math.abs(amount),
      percentage: totalExpenses > 0 ? (Math.abs(amount) / totalExpenses) * 100 : 0
    }));

    // Calculate monthly summary
    const monthlyData = new Map<string, { income: number; expense: number; balance: number }>();
    
    transactions.forEach(transaction => {
      // Considerar apenas transações pagas
      if (!transaction.paid) return;
      
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expense: 0, balance: 0 });
      }
      
      const monthData = monthlyData.get(monthKey)!;
      
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthData.expense += Math.abs(transaction.amount);
      }
      
      monthData.balance = monthData.income - monthData.expense;
    });

    // Format monthly summary
    const monthlySummary = Array.from(monthlyData.entries())
      .map(([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          month,
          year,
          income: data.income,
          expense: data.expense,
          balance: data.balance
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

    // Set summary state
    setSummary({
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
      totalInvestments,
      categorySummary,
      monthlySummary
    });
  }, [transactions, categories]);

  // Update summary when data changes
  useEffect(() => {
    calculateSummary();
  }, [transactions, categories, calculateSummary]);

  // Utility functions
  const getFilteredTransactions = useCallback((filter: { 
    startDate?: Date; 
    endDate?: Date; 
    categoryId?: string; 
    accountId?: string 
  }): Transaction[] => {
    return transactions.filter(transaction => {
      const dateMatch = (!filter.startDate || new Date(transaction.date) >= filter.startDate) &&
                        (!filter.endDate || new Date(transaction.date) <= filter.endDate);
      const categoryMatch = !filter.categoryId || 
                          transaction.category_id === filter.categoryId;
      const accountMatch = !filter.accountId || 
                         transaction.account_id === filter.accountId;
      return dateMatch && categoryMatch && accountMatch;
    });
  }, [transactions]);

  const getCategoryById = useCallback((categoryId: string): Category | undefined => {
    if (!Array.isArray(categories)) {
      console.error('Categories is not an array:', categories);
      return undefined;
    }
    return categories.find(category => category.id === categoryId);
  }, [categories]);

  const getCreditCardTransactions = useCallback((cardId: string): Transaction[] => {
    return transactions.filter(t => t.credit_card_id === cardId);
  }, [transactions]);

  // Export context values
  const value: FinanceContextType = {
    accounts,
    transactions,
    categories,
    creditCards,
    summary,
    goals,
    investments,
    user_id,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getFilteredTransactions,
    getCategoryById,
    getCreditCardTransactions,
    addGoal,
    updateGoal,
    deleteGoal,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    setTransactions,
    loadTransactions,
    isLoading,
    error
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
