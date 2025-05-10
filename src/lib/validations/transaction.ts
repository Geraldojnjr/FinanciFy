import { z } from 'zod';

export const transactionFormSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória'),
  amount: z.number().min(0.01, 'O valor deve ser maior que zero'),
  date: z.string().min(1, 'A data é obrigatória'),
  type: z.enum(['income', 'expense', 'transfer']),
  category_id: z.string().min(1, 'A categoria é obrigatória'),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'pix', 'transfer']),
  expense_type: z.enum(['fixed', 'variable']).optional(),
  account_id: z.string().optional(),
  credit_card_id: z.string().optional(),
  installments: z.number().min(1).default(1),
  current_installment: z.number().min(1).default(1),
  paid: z.boolean().default(false)
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>; 