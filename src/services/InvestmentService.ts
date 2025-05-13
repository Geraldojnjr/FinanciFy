import { MariaDBClient } from "@/lib/types";
import type { Investment } from "@/types/finance";
import { getSupabaseClient, loadDatabaseConfig } from "@/lib/databaseConfig";

export class InvestmentService {
  private client: MariaDBClient;
  private userId: string | null = null;
  private accessToken: string | null = null;
  private baseUrl: string;

  constructor(client?: MariaDBClient) {
    this.client = client || getSupabaseClient() as unknown as MariaDBClient;
    this.loadUserId();
    this.baseUrl = window.location.origin + '/api';
  }

  private loadUserId() {
    try {
      const session = localStorage.getItem('sb-session');
      if (session) {
        const { user, access_token } = JSON.parse(session);
        this.userId = user?.id || null;
        this.accessToken = access_token || null;
      }
    } catch (error) {
      console.error('Error loading user ID:', error);
      this.userId = null;
      this.accessToken = null;
    }
  }

  private async ensureSession() {
    this.loadUserId();
    if (!this.userId || !this.accessToken) {
      throw new Error('No session found, user might be logged out');
    }
  }

  async getInvestments(): Promise<Investment[]> {
    try {
      this.loadUserId();
      if (!this.userId) {
        throw new Error('No userId provided, user might be logged out');
      }

      const response = await this.client.get(`/investments?user_id=${this.userId}`);
      
      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      
      if (!data || !data.data || !Array.isArray(data.data)) {
        console.error('Dados de investimentos inválidos:', data);
        return [];
      }

      return data.data.map((investment: any) => {
        // Garantir que as datas estejam no formato correto
        let initialDate: Date | null = null;
        let dueDate: Date | null = null;

        if (investment.initial_date) {
          try {
            // Se a data já estiver em formato Date, usar diretamente
            if (investment.initial_date instanceof Date) {
              initialDate = investment.initial_date;
            } else if (typeof investment.initial_date === 'string') {
              // Se for uma string, tentar converter para Date
              // Remover a parte do tempo se existir
              const dateStr = investment.initial_date.split('T')[0];
              initialDate = new Date(dateStr);
              
              if (isNaN(initialDate.getTime())) {
                console.error('Formato de data inicial inválido:', investment.initial_date);
                initialDate = null;
              }
            } else {
              console.error('Formato de data inicial não suportado:', typeof investment.initial_date);
              initialDate = null;
            }
          } catch (error) {
            console.error('Erro ao converter data inicial:', error);
            initialDate = null;
          }
        }

        if (investment.due_date) {
          try {
            // Se a data já estiver em formato Date, usar diretamente
            if (investment.due_date instanceof Date) {
              dueDate = investment.due_date;
            } else if (typeof investment.due_date === 'string') {
              // Se for uma string, tentar converter para Date
              // Remover a parte do tempo se existir
              const dateStr = investment.due_date.split('T')[0];
              dueDate = new Date(dateStr);
              
              if (isNaN(dueDate.getTime())) {
                console.error('Formato de data de vencimento inválido:', investment.due_date);
                dueDate = null;
              }
            } else {
              console.error('Formato de data de vencimento não suportado:', typeof investment.due_date);
              dueDate = null;
            }
          } catch (error) {
            console.error('Erro ao converter data de vencimento:', error);
            dueDate = null;
          }
        }

        return {
          id: investment.id,
          name: investment.name,
          type: investment.type,
          amount: Number(investment.amount),
          initialDate: initialDate || new Date(),
          dueDate: dueDate || undefined,
          expectedReturn: investment.expected_return !== undefined ? Number(investment.expected_return) : undefined,
          currentReturn: investment.current_return !== undefined ? Number(investment.current_return) : undefined,
          categoryId: investment.category_id,
          goalId: investment.goal_id,
          notes: investment.notes,
          active: investment.active !== false
        };
      });
    } catch (error) {
      console.error('Error getting investments:', error);
      return [];
    }
  }

  async createInvestment(investment: Omit<Investment, 'id'>): Promise<Investment> {
    await this.ensureSession();
    if (!this.userId) throw new Error('Usuário não autenticado');

    const formattedData = {
      user_id: this.userId,
      name: investment.name,
      type: investment.type,
      amount: Number(investment.amount),
      initial_date: investment.initialDate,
      due_date: investment.dueDate || null,
      expected_return: investment.expectedReturn ? Number(investment.expectedReturn) : null,
      current_return: investment.currentReturn ? Number(investment.currentReturn) : null,
      category_id: investment.categoryId || null,
      goal_id: investment.goalId || null,
      notes: investment.notes || '',
      active: investment.active !== false
    };

    const response = await this.client.post('/investments', formattedData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta:', errorData);
      throw new Error(errorData.error || 'Erro ao criar investimento');
    }

    const data = await response.json();
    return {
      id: data.data.id,
      name: data.data.name,
      type: data.data.type,
      amount: Number(data.data.amount),
      initialDate: data.data.initial_date,
      dueDate: data.data.due_date || undefined,
      expectedReturn: data.data.expected_return ? Number(data.data.expected_return) : undefined,
      currentReturn: data.data.current_return ? Number(data.data.current_return) : undefined,
      categoryId: data.data.category_id || null,
      goalId: data.data.goal_id || null,
      notes: data.data.notes,
      active: data.data.active !== false
    };
  }

  async updateInvestment(id: string, investment: Partial<Investment>): Promise<Investment> {
    await this.ensureSession();
    if (!this.userId) throw new Error('Usuário não autenticado');

    const formatDate = (date: string | Date | undefined | null): string | null => {
      if (!date) return null;
      if (typeof date === 'string') return date;
      if (date instanceof Date) return date.toISOString().split('T')[0];
      return null;
    };

    const formattedData = {
      user_id: this.userId,
      name: investment.name,
      type: investment.type,
      amount: Number(investment.amount),
      initial_date: formatDate(investment.initialDate),
      due_date: formatDate(investment.dueDate),
      expected_return: investment.expectedReturn ? Number(investment.expectedReturn) : null,
      current_return: investment.currentReturn ? Number(investment.currentReturn) : null,
      category_id: investment.categoryId,
      goal_id: investment.goalId,
      notes: investment.notes,
      active: investment.active
    };

    // Adiciona o header X-DB-Config
    const dbConfig = loadDatabaseConfig();
    const mariadbConfig = {
      host: dbConfig.mariadbHost,
      port: dbConfig.mariadbPort,
      user: dbConfig.mariadbUser,
      password: dbConfig.mariadbPassword,
      database: dbConfig.mariadbDatabase
    };

    const response = await fetch(`${this.baseUrl}/investments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-DB-Config': JSON.stringify(mariadbConfig)
      },
      body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na atualização do investimento:', errorData);
      throw new Error(errorData.error || 'Erro ao atualizar investimento');
    }

    const data = await response.json();

    if (!data.ok || !data.data) {
      throw new Error('Dados inválidos retornados pelo servidor');
    }

    return {
      id: data.data.id,
      name: data.data.name,
      type: data.data.type,
      amount: Number(data.data.amount),
      initialDate: data.data.initial_date,
      dueDate: data.data.due_date || undefined,
      expectedReturn: data.data.expected_return ? Number(data.data.expected_return) : undefined,
      currentReturn: data.data.current_return ? Number(data.data.current_return) : undefined,
      categoryId: data.data.category_id || null,
      goalId: data.data.goal_id || null,
      notes: data.data.notes,
      active: data.data.active !== false
    };
  }

  async deleteInvestment(investmentId: string): Promise<void> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.delete(`/investments/${investmentId}`);
      if (!response.ok) {
        throw new Error('Failed to delete investment');
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      throw error;
    }
  }

  // Função utilitária para converter para YYYY-MM-DD
  private toDateString(date: Date | string | undefined) {
    if (!date) return null;
    if (typeof date === 'string') {
      // Se for uma string ISO, converter para YYYY-MM-DD
      if (date.includes('T')) {
        return date.split('T')[0];
      }
      return date;
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return null;
  }
}
