import { ICreditCardService } from "../interfaces/ICreditCardService";
import { CreditCard } from "@/types/finance";
import { MariaDBClient } from "@/lib/types";
import { databaseConfig } from "@/config/database";

export class MariaDBCreditCardService implements ICreditCardService {
  private client: MariaDBClient;
  private userId: string | null = null;
  private accessToken: string | null = null;

  constructor(client: MariaDBClient) {
    this.client = client;
  }

  private async loadSession() {
    try {
      const session = localStorage.getItem('sb-session');
      if (!session) {
        return { userId: null, accessToken: null };
      }

      const { user, access_token } = JSON.parse(session);
      this.userId = user?.id || null;
      this.accessToken = access_token || null;
      return { userId: this.userId, accessToken: this.accessToken };
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      return { userId: null, accessToken: null };
    }
  }

  private async ensureSession() {
    const { userId, accessToken } = await this.loadSession();
    if (!userId || !accessToken) {
      throw new Error('Usuário não autenticado');
    }
    return { userId, accessToken };
  }

  async getCreditCards(): Promise<CreditCard[]> {
    try {
      const { userId } = await this.ensureSession();
      const response = await this.client.get(`/credit-cards?user_id=${userId}`);
      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data.map(card => ({
        id: card.id,
        name: card.name,
        limit: Number(card.limit_amount),
        closingDay: Number(card.closing_day),
        dueDay: Number(card.due_day),
        color: card.color
      }));
    } catch (error) {
      console.error('MariaDBCreditCardService - Error fetching credit cards:', error);
      throw error;
    }
  }

  async getCreditCard(id: string): Promise<CreditCard | null> {
    try {
      const { userId } = await this.ensureSession();
      const response = await this.client.get(`/credit-cards/${id}?user_id=${userId}`);
      const data = await response.json();
      
      if (!data.data) {
        return null;
      }

      return {
        id: data.data.id,
        name: data.data.name,
        limit: Number(data.data.limit_amount),
        closingDay: Number(data.data.closing_day),
        dueDay: Number(data.data.due_day),
        color: data.data.color
      };
    } catch (error) {
      console.error('MariaDBCreditCardService - Error fetching credit card:', error);
      return null;
    }
  }

  async createCreditCard(card: Omit<CreditCard, 'id'>): Promise<CreditCard> {
    try {
      const { userId } = await this.ensureSession();
      const response = await this.client.post(`/credit-cards`, {
        name: card.name,
        limit_amount: card.limit,
        closing_day: card.closingDay,
        due_day: card.dueDay,
        color: card.color,
        user_id: userId
      });
      const data = await response.json();
      const cardData = data.data || data.card;
      
      if (!cardData) {
        throw new Error('Resposta inválida do servidor: dados do cartão não encontrados');
      }

      return {
        id: cardData.id,
        name: cardData.name,
        limit: Number(cardData.limit_amount),
        closingDay: Number(cardData.closing_day),
        dueDay: Number(cardData.due_day),
        color: cardData.color
      };
    } catch (error) {
      console.error('MariaDBCreditCardService - Error creating credit card:', error);
      throw error;
    }
  }

  async updateCreditCard(id: string, card: Partial<CreditCard>): Promise<CreditCard> {
    try {
      const { userId } = await this.ensureSession();
      const response = await this.client.put(`/credit-cards/${id}`, {
        name: card.name,
        limit_amount: card.limit,
        closing_day: card.closingDay,
        due_day: card.dueDay,
        color: card.color,
        user_id: userId
      });
      const data = await response.json();
      return {
        id: data.card.id,
        name: data.card.name,
        limit: Number(data.card.limit_amount),
        closingDay: Number(data.card.closing_day),
        dueDay: Number(data.card.due_day),
        color: data.card.color
      };
    } catch (error) {
      console.error('MariaDBCreditCardService - Error updating credit card:', error);
      throw error;
    }
  }

  async deleteCreditCard(id: string): Promise<void> {
    // console.log('MariaDBCreditCardService - Deleting credit card:', id);
    try {
      const { userId } = await this.ensureSession();
      await this.client.delete(`/credit-cards/${id}?user_id=${userId}`);
    } catch (error) {
      console.error('MariaDBCreditCardService - Error deleting credit card:', error);
      throw error;
    }
  }
} 