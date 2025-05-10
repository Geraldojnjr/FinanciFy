import { getSupabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export type Account = Database['public']['Tables']['accounts']['Row'];

export const fetchAccounts = async (): Promise<Account[]> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Erro ao carregar contas');
    }
    
    return data || [];
  } else {
    // Obter o ID do usuário da sessão
    const session = localStorage.getItem('sb-session');
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    const { user } = JSON.parse(session);
    if (!user?.id) {
      throw new Error('ID do usuário não encontrado');
    }

    const response = await supabase.get(`/accounts?user_id=${user.id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao carregar contas');
    }
    
    const data = await response.json();
    return data.data || [];
  }
};

export const createAccount = async (account: Database['public']['Tables']['accounts']['Insert']): Promise<Account> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating account:', error);
      throw new Error('Erro ao criar conta');
    }
    
    return data;
  } else {
    const response = await supabase.post('/accounts', account);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao criar conta');
    }
    
    const data = await response.json();
    return data;
  }
};

export const updateAccount = async (id: string, account: Database['public']['Tables']['accounts']['Update']): Promise<Account> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating account:', error);
      throw new Error('Erro ao atualizar conta');
    }
    
    return data;
  } else {
    const response = await supabase.put(`/accounts/${id}`, account);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao atualizar conta');
    }
    
    const data = await response.json();
    return data;
  }
};

export const deleteAccount = async (id: string): Promise<void> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting account:', error);
      throw new Error('Erro ao excluir conta');
    }
  } else {
    const response = await supabase.delete(`/accounts/${id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao excluir conta');
    }
  }
};

export const transferBetweenAccounts = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description?: string
): Promise<void> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    // Primeiro, buscar os saldos atuais
    const { data: fromAccount, error: fromError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', fromAccountId)
      .single();
      
    if (fromError) {
      console.error('Error fetching source account:', fromError);
      throw new Error('Erro ao buscar conta de origem');
    }
    
    const { data: toAccount, error: toError } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', toAccountId)
      .single();
      
    if (toError) {
      console.error('Error fetching target account:', toError);
      throw new Error('Erro ao buscar conta de destino');
    }
    
    // Atualizar os saldos
    const { error: updateFromError } = await supabase
      .from('accounts')
      .update({ balance: fromAccount.balance - amount })
      .eq('id', fromAccountId);
      
    if (updateFromError) {
      console.error('Error updating source account:', updateFromError);
      throw new Error('Erro ao atualizar conta de origem');
    }
    
    const { error: updateToError } = await supabase
      .from('accounts')
      .update({ balance: toAccount.balance + amount })
      .eq('id', toAccountId);
      
    if (updateToError) {
      console.error('Error updating target account:', updateToError);
      throw new Error('Erro ao atualizar conta de destino');
    }
  } else {
    const response = await supabase.post('/accounts/transfer', {
      fromAccountId,
      toAccountId,
      amount,
      description
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao transferir entre contas');
    }
  }
}; 