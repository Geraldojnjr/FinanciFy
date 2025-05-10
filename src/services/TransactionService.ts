import { format } from 'date-fns';
import { getSupabaseClient } from '@/lib/databaseConfig';
import type { Transaction, Category, BankAccount, AccountType, TransactionType, PaymentMethod, ExpenseType } from '@/types/finance';
import { MariaDBClient } from '@/lib/types';
import { getSupabase } from '@/lib/supabase';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const supabase = getSupabase();
  const mysqlDatetime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  if ('from' in supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: session.user.id,
        description: transaction.description,
        amount: transaction.amount,
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        category_id: transaction.categoryId || transaction.category_id || null,
        account_id: transaction.accountId || transaction.account_id || null,
        credit_card_id: transaction.creditCardId || transaction.credit_card_id || null,
        type: transaction.type,
        payment_method: transaction.payment_method,
        expense_type: transaction.expense_type,
        installments: transaction.installments || null,
        current_installment: transaction.current_installment || null,
        parent_transaction_id: transaction.parent_transaction_id || null,
        notes: transaction.notes || null,
        created_at: mysqlDatetime,
        updated_at: mysqlDatetime
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Erro ao criar transação');
    }
    
    const result: Transaction = {
      id: data.id,
      user_id: data.user_id,
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      category_id: data.category_id,
      type: data.type as TransactionType,
      payment_method: data.payment_method as PaymentMethod,
      expense_type: data.expense_type as ExpenseType,
      account_id: data.account_id,
      credit_card_id: data.credit_card_id,
      installments: data.installments,
      current_installment: data.current_installment,
      parent_transaction_id: data.parent_transaction_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return result;
  } else {
    const response = await supabase.post('/transactions', {
      description: transaction.description,
      amount: transaction.amount,
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      category_id: transaction.categoryId || transaction.category_id || null,
      account_id: transaction.accountId || transaction.account_id || null,
      credit_card_id: transaction.creditCardId || transaction.credit_card_id || null,
      type: transaction.type,
      payment_method: transaction.payment_method,
      expense_type: transaction.expense_type,
      installments: transaction.installments || null,
      current_installment: transaction.current_installment || null,
      parent_transaction_id: transaction.parent_transaction_id || null,
      notes: transaction.notes || null,
      created_at: mysqlDatetime,
      updated_at: mysqlDatetime
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao criar transação');
    }
    
    const data = await response.json();
    const result: Transaction = {
      id: data.id,
      user_id: data.user_id,
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      category_id: data.category_id,
      type: data.type as TransactionType,
      payment_method: data.payment_method as PaymentMethod,
      expense_type: data.expense_type as ExpenseType,
      account_id: data.account_id,
      credit_card_id: data.credit_card_id,
      installments: data.installments,
      current_installment: data.current_installment,
      parent_transaction_id: data.parent_transaction_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return result;
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : undefined,
        category_id: transaction.categoryId || transaction.category_id,
        account_id: transaction.accountId || transaction.account_id,
        credit_card_id: transaction.creditCardId || transaction.credit_card_id,
        type: transaction.type,
        payment_method: transaction.payment_method,
        expense_type: transaction.expense_type,
        installments: transaction.installments,
        current_installment: transaction.current_installment,
        parent_transaction_id: transaction.parent_transaction_id,
        notes: transaction.notes
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Erro ao atualizar transação');
    }
    
    const result: Transaction = {
      id: data.id,
      user_id: data.user_id,
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      category_id: data.category_id,
      type: data.type as TransactionType,
      payment_method: data.payment_method as PaymentMethod,
      expense_type: data.expense_type as ExpenseType,
      account_id: data.account_id,
      credit_card_id: data.credit_card_id,
      installments: data.installments,
      current_installment: data.current_installment,
      parent_transaction_id: data.parent_transaction_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return result;
  } else {
    const response = await supabase.put(`/transactions/${id}`, {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : undefined,
      category_id: transaction.categoryId || transaction.category_id,
      account_id: transaction.accountId || transaction.account_id,
      credit_card_id: transaction.creditCardId || transaction.credit_card_id,
      type: transaction.type,
      payment_method: transaction.payment_method,
      expense_type: transaction.expense_type,
      installments: transaction.installments,
      current_installment: transaction.current_installment,
      parent_transaction_id: transaction.parent_transaction_id,
      notes: transaction.notes
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao atualizar transação');
    }
    
    const data = await response.json();
    const result: Transaction = {
      id: data.id,
      user_id: data.user_id,
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      category_id: data.category_id,
      type: data.type as TransactionType,
      payment_method: data.payment_method as PaymentMethod,
      expense_type: data.expense_type as ExpenseType,
      account_id: data.account_id,
      credit_card_id: data.credit_card_id,
      installments: data.installments,
      current_installment: data.current_installment,
      parent_transaction_id: data.parent_transaction_id,
      notes: data.notes,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return result;
  }
};

export class TransactionService {
  private client: MariaDBClient;
  private supabase = getSupabaseClient();
  private userId: string | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor(client: MariaDBClient) {
    this.client = client;
    this.loadUserId();
    this.startSessionCheck();
  }

  private startSessionCheck() {
    this.sessionCheckInterval = setInterval(() => {
      this.loadUserId();
    }, 60000); // Verifica a cada minuto
  }

  private stopSessionCheck() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  private async loadUserId() {
    try {
      const session = localStorage.getItem('sb-session');
      if (session) {
        const { user } = JSON.parse(session);
        this.userId = user?.id || null;
      } else {
        this.userId = null;
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
      this.userId = null;
    }
  }

  private async handleRequest<T>(request: () => Promise<Response>): Promise<T> {
    try {
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      const response = await request();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.parseResponse<T>(data);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  private parseResponse<T>(data: any): T {
    try {
      if (!data) {
        throw new Error('Empty response');
      }

      // Se a resposta já é do tipo esperado, retorna diretamente
      if (data as T) {
        return data as T;
      }

      // Se a resposta tem uma propriedade data, usa ela
      if (data.data) {
        return data.data as T;
      }

      // Se a resposta tem uma propriedade transactions, usa ela
      if (data.transactions) {
        return data.transactions as T;
      }

      // Se a resposta é uma array, retorna ela
      if (Array.isArray(data)) {
        return data as T;
      }

      // Se chegou aqui, tenta converter a resposta para o tipo esperado
      return data as T;
    } catch (error) {
      console.error('Error parsing response:', error);
      console.error('Response data:', data);
      throw new Error('Failed to parse response');
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private checkUserId() {
    if (!this.userId) {
      throw new Error('User ID not set. Please log in again.');
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) return [];

      const response = await this.client.get(`/transactions/${session.user.id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar transações');
      }

      // console.log("Transações carregadas do servidor:", data.transactions);

      const formattedTransactions = data.transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        amount: Number(t.amount),
        category_id: t.category_id || t.categoryId,
        account_id: t.account_id || t.accountId,
        credit_card_id: t.credit_card_id || t.creditCardId,
        paid: t.paid === 1 || t.paid === true
      }));

      // console.log("Transações formatadas:", formattedTransactions);
      return formattedTransactions;
    } catch (error) {
      console.error('Transactions fetch failed:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) return [];

      const response = await this.client.get(`/categories?user_id=${session.user.id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar categorias');
      }

      return data.categories.map((c: any) => ({
        ...c,
        type: c.type.toLowerCase()
      }));
    } catch (error) {
      console.error('Categories fetch failed:', error);
      return [];
    }
  }

  private async generateUUID(): Promise<string> {
    const { v4: uuidv4 } = await import('uuid');
    return uuidv4();
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const mysqlDatetime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const createData = {
      ...transaction,
      user_id: this.userId,
      category_id: transaction.categoryId || transaction.category_id || null,
      account_id: transaction.accountId || transaction.account_id || null,
      credit_card_id: transaction.creditCardId || transaction.credit_card_id || null,
      type: transaction.type,
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      payment_method: transaction.payment_method,
      expense_type: transaction.expense_type,
      installments: transaction.installments || null,
      current_installment: transaction.current_installment || null,
      parent_transaction_id: transaction.parent_transaction_id || null,
      notes: transaction.notes || null,
      created_at: mysqlDatetime,
      updated_at: mysqlDatetime
    };

    return this.handleRequest<Transaction>(() => 
      this.client.post('/transactions', createData)
    );
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      // Formatar a data para o formato YYYY-MM-DD
      const formattedDate = transaction.date ? 
        new Date(transaction.date).toISOString().split('T')[0] : 
        undefined;

      const updateData = {
        ...transaction,
        user_id: session.user.id,
        date: formattedDate,
        type: transaction.type,
        payment_method: transaction.payment_method,
        expense_type: transaction.expense_type
      };

      const response = await this.client.put(`/transactions/${id}`, updateData);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao atualizar transação');
      }

      if (!data.transaction) {
        throw new Error('Resposta inválida da API');
      }

      return {
        ...data.transaction,
        date: new Date(data.transaction.date),
        amount: Number(data.transaction.amount),
        category_id: data.transaction.category_id || data.transaction.categoryId,
        account_id: data.transaction.account_id || data.transaction.accountId,
        credit_card_id: data.transaction.credit_card_id || data.transaction.creditCardId,
        type: data.transaction.type as TransactionType,
        payment_method: data.transaction.payment_method as PaymentMethod,
        expense_type: data.transaction.expense_type as ExpenseType
      };
    } catch (error) {
      console.error('Transaction update failed:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.handleRequest<void>(() => 
      this.client.delete(`/transactions/${id}`)
    );
  }

  async getFilteredTransactions(
    startDate?: string,
    endDate?: string,
    categoryIds?: string[],
    types?: string[]
  ): Promise<Transaction[]> {
    try {
      this.loadUserId();
      if (!this.userId) {
        throw new Error('No userId provided, user might be logged out');
      }

      let url = `/transactions/filter?user_id=${this.userId}`;
      
      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      
      if (endDate) {
        url += `&endDate=${endDate}`;
      }
      
      if (categoryIds?.length) {
        url += `&categoryIds=${categoryIds.join(',')}`;
      }
      
      if (types?.length) {
        url += `&types=${types.join(',')}`;
      }
      
      const response = await this.client.get(url);
      return this.parseResponse<Transaction[]>(response);
    } catch (error) {
      console.error('Filtered transaction fetch failed:', error);
      throw error;
    }
  }

  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      this.loadUserId();
      if (!this.userId) {
        throw new Error('No userId provided, user might be logged out');
      }

      const response = await this.client.get(`/categories/${categoryId}?user_id=${this.userId}`);
      return this.parseResponse<Category | null>(response);
    } catch (error) {
      console.error(`Category fetch failed for id ${categoryId}:`, error);
      throw error;
    }
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      this.checkUserId();
      const response = await this.client.post('/categories', {
        ...category,
        user_id: this.userId
      });
      const data = await response.json();
      return this.parseResponse<Category>(data);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      this.checkUserId();
      const response = await this.client.put(`/categories/${id}`, {
        ...category,
        user_id: this.userId
      });
      const data = await response.json();
      return this.parseResponse<Category>(data);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      this.checkUserId();
      await this.client.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async getAccounts(): Promise<BankAccount[]> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) {
        console.error('No session found');
        return [];
      }

      const response = await this.client.get(`/accounts?user_id=${session.user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Accounts response:', data); // Para debug

      if (!data) {
        console.error('Empty response from server');
        return [];
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data) {
        console.error('No data property in response');
        return [];
      }

      if (!Array.isArray(data.data)) {
        console.error('Data is not an array:', data.data);
        return [];
      }

      return data.data.map((account: any) => ({
        id: account.id,
        name: account.name,
        balance: Number(account.balance || 0),
        initialBalance: Number(account.initial_balance || 0),
        type: account.type as AccountType,
        bank: account.bank || undefined,
        color: account.color || '#6750A4',
        isActive: account.is_active !== false
      }));
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  async createAccount(account: Omit<BankAccount, 'id'>): Promise<BankAccount> {
    this.loadUserId();
    if (!this.userId) {
      throw new Error('No userId provided, user might be logged out');
    }

    // Mapear os campos do frontend para o formato do banco de dados
    const now = new Date();
    const mysqlDatetime = format(now, 'yyyy-MM-dd HH:mm:ss');

    const createData = {
      id: await this.generateUUID(),
      user_id: this.userId,
      name: account.name?.trim(),
      balance: account.balance,
      initial_balance: account.initialBalance,
      type: account.type,
      bank: account.bank?.trim() || null,
      color: account.color || '#6750A4',
      is_active: account.isActive !== false,
      created_at: mysqlDatetime,
      updated_at: mysqlDatetime
    };

    try {
      const response = await this.client.post('/accounts', createData);
      const result = await this.parseResponse<any>(response);
      
      // Mapear os campos do banco de dados de volta para o formato do frontend
      return {
        id: result.id,
        name: result.name,
        balance: Number(result.balance),
        initialBalance: Number(result.initial_balance),
        type: result.type as AccountType,
        bank: result.bank || undefined,
        color: result.color,
        isActive: result.is_active
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async updateAccount(account: BankAccount): Promise<BankAccount> {
    this.loadUserId();
    if (!this.userId) {
      throw new Error('No userId provided, user might be logged out');
    }

    if (!account.id) {
      throw new Error('Account ID is required for update');
    }

    // Mapear os campos do frontend para o formato do banco de dados
    const mysqlDatetime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const updateData = {
      name: account.name?.trim(),
      balance: account.balance,
      initial_balance: account.initialBalance,
      type: account.type,
      bank: account.bank?.trim() || null,
      color: account.color || '#6750A4',
      is_active: account.isActive !== false,
      updated_at: mysqlDatetime
    };

    try {
      const response = await this.client.put(`/accounts/${account.id}`, updateData);
      const result = await this.parseResponse<any>(response);
      
      // Mapear os campos do banco de dados de volta para o formato do frontend
      return {
        id: result.id,
        name: result.name,
        balance: result.balance,
        initialBalance: result.initial_balance,
        type: result.type as AccountType,
        bank: result.bank || undefined,
        color: result.color,
        isActive: result.is_active
      };
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    this.loadUserId();
    if (!this.userId) {
      throw new Error('No userId provided, user might be logged out');
    }

    try {
      const response = await this.client.delete(`/accounts/${accountId}`);
      await this.parseResponse(response);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      this.checkUserId();
      const response = await this.client.get(`/transactions/${id}`);
      const data = await response.json();
      return this.parseResponse<Transaction | null>(data);
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }
}
