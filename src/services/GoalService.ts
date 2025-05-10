import { getSupabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export type Goal = Database['public']['Tables']['goals']['Row'];

export const fetchGoals = async (): Promise<Goal[]> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('target_date');
      
    if (error) {
      console.error('Error fetching goals:', error);
      throw new Error('Erro ao carregar metas');
    }
    
    return data || [];
  } else {
    const response = await supabase.get('/goals');
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao carregar metas');
    }
    
    const data = await response.json();
    return data || [];
  }
};

export const createGoal = async (goal: Database['public']['Tables']['goals']['Insert']): Promise<Goal> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating goal:', error);
      throw new Error('Erro ao criar meta');
    }
    
    return data;
  } else {
    const response = await supabase.post('/goals', goal);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao criar meta');
    }
    
    const data = await response.json();
    return data;
  }
};

export const updateGoal = async (id: string, goal: Database['public']['Tables']['goals']['Update']): Promise<Goal> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating goal:', error);
      throw new Error('Erro ao atualizar meta');
    }
    
    return data;
  } else {
    const response = await supabase.put(`/goals/${id}`, goal);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao atualizar meta');
    }
    
    const data = await response.json();
    return data;
  }
};

export const deleteGoal = async (id: string): Promise<void> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting goal:', error);
      throw new Error('Erro ao excluir meta');
    }
  } else {
    const response = await supabase.delete(`/goals/${id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao excluir meta');
    }
  }
}; 