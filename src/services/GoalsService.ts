import type { Goal } from "@/types/finance";
import { getSupabaseClient } from "@/lib/databaseConfig";

interface MariaDBClient {
  get: (url: string) => Promise<Response>;
  post: (url: string, data?: any) => Promise<Response>;
  put: (url: string, data?: any) => Promise<Response>;
  delete: (url: string) => Promise<Response>;
  patch: (url: string, data?: any) => Promise<Response>;
}

export class GoalsService {
  private client: MariaDBClient;
  private userId: string | null = null;
  private accessToken: string | null = null;

  constructor(client?: MariaDBClient) {
    this.client = client || getSupabaseClient() as unknown as MariaDBClient;
    this.loadUserId();
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

  async getGoals(): Promise<Goal[]> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.get(`/goals?user_id=${this.userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response from server');
      }

      return data.data.map((goal: any) => ({
        id: goal.id,
        name: goal.name,
        target_amount: Number(goal.target_amount),
        current_amount: Number(goal.current_amount),
        deadline: goal.deadline,
        category_id: goal.category_id,
        notes: goal.notes,
        color: goal.color || '#60a5fa',
        active: goal.active,
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        user_id: goal.user_id
      }));
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  async createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.post('/goals', {
        name: goal.name,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        category_id: goal.category_id,
        deadline: goal.deadline,
        notes: goal.notes,
        color: goal.color,
        active: goal.active,
        user_id: this.userId
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response from server');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        target_amount: Number(data.data.target_amount),
        current_amount: Number(data.data.current_amount),
        deadline: data.data.deadline,
        category_id: data.data.category_id,
        notes: data.data.notes,
        color: data.data.color || '#60a5fa',
        active: data.data.active,
        created_at: data.data.created_at,
        updated_at: data.data.updated_at,
        user_id: data.data.user_id
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  async updateGoal(goal: Goal): Promise<Goal> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.put(`/goals/${goal.id}`, {
        name: goal.name,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount,
        category_id: goal.category_id,
        deadline: goal.deadline,
        notes: goal.notes,
        color: goal.color,
        active: goal.active,
        user_id: this.userId
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response from server');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        target_amount: Number(data.data.target_amount),
        current_amount: Number(data.data.current_amount),
        deadline: data.data.deadline,
        category_id: data.data.category_id,
        notes: data.data.notes,
        color: data.data.color || '#60a5fa',
        active: data.data.active,
        created_at: data.data.created_at,
        updated_at: data.data.updated_at,
        user_id: data.data.user_id
      };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  async deleteGoal(id: string): Promise<void> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.delete(`/goals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  async getGoal(id: string): Promise<Goal> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.get(`/goals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to get goal');
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response from server');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        target_amount: Number(data.data.target_amount),
        current_amount: Number(data.data.current_amount),
        deadline: data.data.deadline,
        category_id: data.data.category_id,
        notes: data.data.notes,
        color: data.data.color || '#60a5fa',
        active: data.data.active,
        created_at: data.data.created_at,
        updated_at: data.data.updated_at,
        user_id: data.data.user_id
      };
    } catch (error) {
      console.error('Error getting goal:', error);
      throw error;
    }
  }

  async updateGoalProgress(id: string, amount: number): Promise<Goal> {
    try {
      await this.ensureSession();
      if (!this.userId || !this.accessToken) {
        throw new Error('No session found, user might be logged out');
      }

      const response = await this.client.patch(`/goals/${id}/progress`, { amount });
      if (!response.ok) {
        throw new Error('Failed to update goal progress');
      }

      const data = await response.json();
      if (!data || !data.data) {
        throw new Error('Invalid response from server');
      }

      return {
        id: data.data.id,
        name: data.data.name,
        target_amount: Number(data.data.target_amount),
        current_amount: Number(data.data.current_amount),
        deadline: data.data.deadline,
        category_id: data.data.category_id,
        notes: data.data.notes,
        color: data.data.color || '#60a5fa',
        active: data.data.active,
        created_at: data.data.created_at,
        updated_at: data.data.updated_at,
        user_id: data.data.user_id
      };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }
}
