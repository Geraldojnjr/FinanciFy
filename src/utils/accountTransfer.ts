
import { BankAccount, Transaction, TransactionType } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates two transaction objects for transferring money between accounts
 * 
 * @param sourceAccountId The ID of the account to transfer from
 * @param destinationAccountId The ID of the account to transfer to
 * @param amount The amount to transfer
 * @param categoryId The category ID to use for the transactions
 * @param description Description for the transaction
 * @param accounts The list of accounts to get names from
 * @returns An array with two transaction objects: [sourceTransaction, destinationTransaction]
 */
export const createTransferTransactions = (
  sourceAccountId: string,
  destinationAccountId: string,
  amount: number,
  categoryId: string,
  description: string,
  accounts: BankAccount[]
): [Transaction, Transaction] => {
  const now = new Date();
  const sourceAccountName = accounts.find(a => a.id === sourceAccountId)?.name || 'outra conta';
  const destAccountName = accounts.find(a => a.id === destinationAccountId)?.name || 'outra conta';
  
  // Transaction from source account (expense)
  const sourceTransaction: Transaction = {
    id: uuidv4(),
    user_id: '',
    description: `${description} (Saída)`,
    amount: amount,
    date: now,
    category_id: categoryId,
    type: 'expense' as TransactionType,
    account_id: sourceAccountId,
    payment_method: 'transfer',
    expense_type: 'variable',
    credit_card_id: null,
    installments: null,
    current_installment: null,
    parent_transaction_id: null,
    notes: `Transferência para ${destAccountName}`,
    created_at: null,
    updated_at: null,
    paid: true
  };
  
  // Transaction to destination account (income)
  const destinationTransaction: Transaction = {
    id: uuidv4(),
    user_id: '',
    description: `${description} (Entrada)`,
    amount: amount,
    date: now,
    category_id: categoryId,
    type: 'income' as TransactionType,
    account_id: destinationAccountId,
    payment_method: 'transfer',
    expense_type: null,
    credit_card_id: null,
    installments: null,
    current_installment: null,
    parent_transaction_id: null,
    notes: `Transferência de ${sourceAccountName}`,
    created_at: null,
    updated_at: null,
    paid: true
  };
  
  return [sourceTransaction, destinationTransaction];
};
