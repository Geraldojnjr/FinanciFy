import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useFinance } from '@/contexts/FinanceContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/utils/format';
import { TransactionType, PaymentMethod, Transaction, ExpenseType } from '@/types/finance';

interface AccountTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AccountTransferModal = ({ isOpen, onClose, onSuccess }: AccountTransferModalProps) => {
  const { accounts, addTransaction, categories, transactions } = useFinance();
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Transferência entre contas');
  const [isLoading, setIsLoading] = useState(false);
  const [transferCategoryId, setTransferCategoryId] = useState('');

  // Calcula o saldo atual de cada conta (apenas transações pagas)
  const accountBalances = accounts.map(account => {
    const accountTransactions = transactions.filter(t => 
      (t.account_id === account.id || t.accountId === account.id) && t.paid
    );
    
    const paidBalance = accountTransactions.reduce((sum, t) => {
      if (t.type === 'income') {
        return sum + t.amount;
      } else if (t.type === 'expense') {
        return sum - t.amount;
      }
      return sum;
    }, account.initialBalance);
    
    return {
      ...account,
      balance: paidBalance
    };
  });

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('Transferência entre contas');
      // Filter active accounts
      const activeAccounts = accountBalances.filter(account => account.isActive !== false);
      if (activeAccounts.length > 0) {
        setSourceAccountId(activeAccounts[0].id);
        if (activeAccounts.length > 1) {
          setDestinationAccountId(activeAccounts[1].id);
        }
      }
      // Find or set transfer category
      const transferCategory = categories.find(
        c => c.name.toLowerCase() === 'transferência' && c.type === 'expense'
      );
      if (transferCategory) {
        setTransferCategoryId(transferCategory.id);
      } else {
        // Use the first expense category as fallback
        const fallbackCategory = categories.find(c => c.type === 'expense');
        if (fallbackCategory) {
          setTransferCategoryId(fallbackCategory.id);
        }
      }
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite apenas números, vírgula e ponto
    const value = e.target.value.replace(/[^\d.,]/g, '');
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sourceAccountId === destinationAccountId) {
      toast.error('As contas de origem e destino não podem ser as mesmas');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Obter o ID do usuário da sessão
      const session = localStorage.getItem('sb-session');
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const { user } = JSON.parse(session);
      if (!user?.id) {
        throw new Error('ID do usuário não encontrado');
      }
      
      // No submit, converter para número corretamente
      const transferAmount = parseFloat(amount.replace(',', '.'));
      const now = new Date();
      
      // Buscar a categoria de transferência fixa
      const transferCategoryId = '1009377';
      
      // Transaction from source account (expense)
      const sourceTransaction: Transaction = {
        id: uuidv4(),
        user_id: user.id,
        description: `${description} (Saída)`,
        amount: transferAmount,
        date: now,
        category_id: transferCategoryId,
        type: 'expense' as TransactionType,
        account_id: sourceAccountId,
        payment_method: 'transfer' as PaymentMethod,
        expense_type: 'variable' as ExpenseType,
        credit_card_id: null,
        installments: null,
        current_installment: null,
        parent_transaction_id: null,
        notes: `Transferência para ${accounts.find(a => a.id === destinationAccountId)?.name || 'outra conta'}`,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        paid: true,
        active: true
      };
      
      // Transaction to destination account (income)
      const destinationTransaction: Transaction = {
        id: uuidv4(),
        user_id: user.id,
        description: `${description} (Entrada)`,
        amount: transferAmount,
        date: now,
        category_id: transferCategoryId,
        type: 'income' as TransactionType,
        account_id: destinationAccountId,
        payment_method: 'transfer' as PaymentMethod,
        expense_type: null,
        credit_card_id: null,
        installments: null,
        current_installment: null,
        parent_transaction_id: null,
        notes: `Transferência de ${accounts.find(a => a.id === sourceAccountId)?.name || 'outra conta'}`,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        paid: true,
        active: true
      };
      
      // Create both transactions
      await Promise.all([
        addTransaction(sourceTransaction),
        addTransaction(destinationTransaction)
      ]);
      
      toast.success('Transferência realizada com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast.error('Erro ao realizar transferência. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferência entre Contas</DialogTitle>
          <DialogDescription>
            Transfira valores entre suas contas bancárias.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceAccount">Conta de Origem</Label>
              <Select
                value={sourceAccountId}
                onValueChange={setSourceAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta de origem" />
                </SelectTrigger>
                <SelectContent>
                  {accountBalances.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationAccount">Conta de Destino</Label>
              <Select
                value={destinationAccountId}
                onValueChange={setDestinationAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta de destino" />
                </SelectTrigger>
                <SelectContent>
                  {accountBalances
                    .filter(account => account.id !== sourceAccountId)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Transferência para conta corrente"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Transferindo...' : 'Transferir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountTransferModal;
