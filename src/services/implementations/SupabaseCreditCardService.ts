import { ICreditCardService } from "../interfaces/ICreditCardService";
import { CreditCard } from "@/types/finance";
import { supabase } from "@/lib/supabase";

export class SupabaseCreditCardService implements ICreditCardService {
  async getCreditCards(): Promise<CreditCard[]> {
    // console.log('SupabaseCreditCardService - Fetching credit cards');
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('name');

      if (error) {
        console.error('SupabaseCreditCardService - Error fetching credit cards:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('SupabaseCreditCardService - Error in getCreditCards:', error);
      throw error;
    }
  }

  async getCreditCard(id: string): Promise<CreditCard | null> {
    // console.log('SupabaseCreditCardService - Fetching credit card:', id);
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('SupabaseCreditCardService - Error fetching credit card:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('SupabaseCreditCardService - Error in getCreditCard:', error);
      return null;
    }
  }

  async createCreditCard(card: Omit<CreditCard, 'id'>): Promise<CreditCard> {
    // console.log('SupabaseCreditCardService - Creating credit card:', card);
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .insert([card])
        .select()
        .single();

      if (error) {
        console.error('SupabaseCreditCardService - Error creating credit card:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('SupabaseCreditCardService - Error in createCreditCard:', error);
      throw error;
    }
  }

  async updateCreditCard(id: string, card: Partial<CreditCard>): Promise<CreditCard> {
    // console.log('SupabaseCreditCardService - Updating credit card:', { id, card });
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .update(card)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('SupabaseCreditCardService - Error updating credit card:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('SupabaseCreditCardService - Error in updateCreditCard:', error);
      throw error;
    }
  }

  async deleteCreditCard(id: string): Promise<void> {
    // console.log('SupabaseCreditCardService - Deleting credit card:', id);
    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('SupabaseCreditCardService - Error deleting credit card:', error);
        throw error;
      }
    } catch (error) {
      console.error('SupabaseCreditCardService - Error in deleteCreditCard:', error);
      throw error;
    }
  }
} 