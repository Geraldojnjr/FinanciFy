import { CreditCard } from "@/types/finance";

export interface ICreditCardService {
  getCreditCards(): Promise<CreditCard[]>;
  getCreditCard(id: string): Promise<CreditCard | null>;
  createCreditCard(card: Omit<CreditCard, 'id'>): Promise<CreditCard>;
  updateCreditCard(id: string, card: Partial<CreditCard>): Promise<CreditCard>;
  deleteCreditCard(id: string): Promise<void>;
} 