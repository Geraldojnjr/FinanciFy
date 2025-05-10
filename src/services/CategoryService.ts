import { getSupabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export type Category = Database['public']['Tables']['categories']['Row'];

export const fetchCategories = async (): Promise<Category[]> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Erro ao carregar categorias');
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

    const response = await supabase.get(`/categories?user_id=${user.id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao carregar categorias');
    }
    
    const data = await response.json();
    return data.categories || [];
  }
};

export const createCategory = async (category: Database['public']['Tables']['categories']['Insert']): Promise<Category> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating category:', error);
      throw new Error('Erro ao criar categoria');
    }
    
    return data;
  } else {
    const response = await supabase.post('/categories', category);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao criar categoria');
    }
    
    const data = await response.json();
    return data;
  }
};

export const updateCategory = async (id: string, category: Database['public']['Tables']['categories']['Update']): Promise<Category> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating category:', error);
      throw new Error('Erro ao atualizar categoria');
    }
    
    return data;
  } else {
    const response = await supabase.put(`/categories/${id}`, category);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao atualizar categoria');
    }
    
    const data = await response.json();
    return data;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  const supabase = getSupabase();
  
  if ('from' in supabase) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting category:', error);
      throw new Error('Erro ao excluir categoria');
    }
  } else {
    const response = await supabase.delete(`/categories/${id}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao excluir categoria');
    }
  }
}; 