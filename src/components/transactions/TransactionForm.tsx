import React, { useState, useEffect } from 'react';
import { Transaction } from '@/types/finance';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type TransactionType = 'income' | 'expense' | 'investment';

interface TransactionFormData {
  description: string;
  amount: number;
  date: Date;
  type: TransactionType;
  category_id: string;
  payment_method: 'cash' | 'credit' | 'debit' | 'pix' | 'transfer';
  expense_type?: 'fixed' | 'variable';
  account_id?: string;
  credit_card_id?: string;
  installments?: number;
  current_installment?: number;
  parent_transaction_id?: string;
  notes?: string;
  paid: boolean;
}

interface TransactionFormProps {
  transaction?: Partial<Transaction>;
  onClose: () => void;
  onSave: (transaction: Partial<Transaction>) => Promise<void>;
}

function TransactionForm({ transaction, onClose, onSave }: TransactionFormProps) {
  const { categories, accounts, creditCards, transactions } = useFinance();
  const [formData, setFormData] = useState<Partial<TransactionFormData>>({
    description: '',
    amount: 0,
    type: 'expense',
    category_id: '',
    date: new Date(),
    payment_method: 'cash',
    paid: false,
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type as any,
        category_id: transaction.category_id,
        date: transaction.date && !isNaN(new Date(transaction.date).getTime()) ? new Date(transaction.date) : new Date(),
        payment_method: transaction.payment_method as any,
        expense_type: transaction.expense_type as any,
        account_id: transaction.account_id,
        credit_card_id: transaction.credit_card_id,
        installments: transaction.installments,
        current_installment: transaction.current_installment,
        parent_transaction_id: transaction.parent_transaction_id,
        notes: transaction.notes,
        paid: transaction.paid ?? false,
      });
    } else {
      setFormData({
        description: '',
        amount: 0,
        type: 'expense',
        category_id: '',
        date: new Date(),
        payment_method: 'cash',
        paid: false,
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionData: Partial<Transaction> = {
        ...formData,
        date: formData.date?.toISOString(),
        paid: formData.paid ?? false
      };
      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error('Não foi possível salvar a transação');
    }
  };

  const handleFieldChange = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isExpense = formData.type === 'expense';
  const isCreditCard = formData.payment_method === 'credit';
  const isInstallment = isCreditCard;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <DatePicker
          date={formData.date && !isNaN(new Date(formData.date).getTime()) ? formData.date : undefined}
          onSelect={(date) => handleFieldChange('date', date)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => {
            handleFieldChange('type', value);
            handleFieldChange('category_id', '');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Receita</SelectItem>
            <SelectItem value="expense">Despesa</SelectItem>
            <SelectItem value="investment">Investimento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => handleFieldChange('category_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter(category => category.type === formData.type)
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Forma de Pagamento</Label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => handleFieldChange('payment_method', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a forma de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="debit">Cartão de Débito</SelectItem>
            <SelectItem value="credit">Cartão de Crédito</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="transfer">Transferência</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isExpense && (
        <div className="space-y-2">
          <Label htmlFor="expense_type">Tipo de Despesa</Label>
          <Select
            value={formData.expense_type}
            onValueChange={(value) => handleFieldChange('expense_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de despesa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixa</SelectItem>
              <SelectItem value="variable">Variável</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="account_id">Conta</Label>
        <Select
          value={formData.account_id}
          onValueChange={(value) => handleFieldChange('account_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a conta" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCreditCard && (
        <div className="space-y-2">
          <Label htmlFor="credit_card_id">Cartão de Crédito</Label>
          <Select
            value={formData.credit_card_id}
            onValueChange={(value) => handleFieldChange('credit_card_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cartão de crédito" />
            </SelectTrigger>
            <SelectContent>
              {creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isInstallment && (
        <div className="flex gap-2">
          <div className="space-y-2 flex-1">
            <Label htmlFor="installments">Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min={1}
              value={formData.installments || ''}
              onChange={(e) => handleFieldChange('installments', parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor="current_installment">Parcela Atual</Label>
            <Input
              id="current_installment"
              type="number"
              min={1}
              value={formData.current_installment || ''}
              onChange={(e) => handleFieldChange('current_installment', parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.paid ?? false}
            onCheckedChange={(checked) => handleFieldChange('paid', checked)}
            id="paid"
          />
          <Label htmlFor="paid">Pago</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
