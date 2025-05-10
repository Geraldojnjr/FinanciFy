import { getSupabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export type CreditCard = Database['public']['Tables']['credit_cards']['Row'];

export const fetchCreditCards = async (): Promise<CreditCard[]> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching credit cards:', error);
      throw new Error('Erro ao carregar cartões de crédito');
    }
    
    return data || [];
  } else {
    const response = await supabase.get('/credit-cards');
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao carregar cartões de crédito');
    }
    
    const data = await response.json();
    return data || [];
  }
};

export const createCreditCard = async (creditCard: Database['public']['Tables']['credit_cards']['Insert']): Promise<CreditCard> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('credit_cards')
      .insert(creditCard)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating credit card:', error);
      throw new Error('Erro ao criar cartão de crédito');
    }
    
    return data;
  } else {
    const response = await supabase.post('/credit-cards', creditCard);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao criar cartão de crédito');
    }
    
    const data = await response.json();
    return data;
  }
};

export const updateCreditCard = async (id: string, creditCard: Database['public']['Tables']['credit_cards']['Update']): Promise<CreditCard> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('credit_cards')
      .update(creditCard)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating credit card:', error);
      throw new Error('Erro ao atualizar cartão de crédito');
    }
    
    return data;
  } else {
    const response = await supabase.put(`/credit-cards/${id}`, creditCard);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao atualizar cartão de crédito');
    }
    
    const data = await response.json();
    return data;
  }
};

export const deleteCreditCard = async (id: string): Promise<void> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { error } = await supabase
      .from('credit_cards')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting credit card:', error);
      throw new Error('Erro ao excluir cartão de crédito');
    }
  } else {
    const response = await supabase.delete(`/credit-cards/${id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao excluir cartão de crédito');
    }
  }
};
