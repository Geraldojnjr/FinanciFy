import React, { useState, useEffect } from 'react';
import { Transaction, FilterOptions } from '@/types/finance';
import { useFinance } from '@/contexts/FinanceContext';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { StandardModal } from '@/components/ui/standard-modal';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { TransactionCard } from './TransactionCard';
import { TransactionsHeader } from './TransactionsHeader';
import { TransactionsFilter } from './TransactionsFilter';
import { TransactionsSummary } from './TransactionsSummary';
import TransactionForm from './TransactionForm';
import { v4 as uuidv4 } from 'uuid';

interface TransactionsListProps {
  transactions?: Transaction[];
  onTransactionDeleted?: () => void;
}

function TransactionsList({ 
  transactions = [], 
  onTransactionDeleted 
}: TransactionsListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { 
    deleteTransaction, 
    updateTransaction, 
    addTransaction,
    setTransactions, 
    categories,
    user_id 
  } = useFinance();
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    startDate: undefined,
    endDate: undefined,
    categoryId: undefined,
    type: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    searchTerm: undefined
  });

  useEffect(() => {
    setLocalTransactions(transactions);
    setIsLoading(false);
  }, [transactions]);

  // Use our custom hook for filtering
  const filteredTransactions = useFilteredTransactions(localTransactions, filterOptions);
  
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        // Buscar a transação pelo id
        const transactionToDelete = localTransactions.find(t => t.id === id);
        if (!transactionToDelete) throw new Error('Transação não encontrada');
        // Atualizar o campo active para 0
        await updateTransaction({ ...transactionToDelete, active: 0 } as any);
        toast({
          title: 'Sucesso',
          description: 'Transação excluída com sucesso',
        });
        if (onTransactionDeleted) {
          onTransactionDeleted();
        }
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir a transação',
          variant: 'destructive',
        });
      }
    }
  };

  const handleTogglePaid = async (transaction: Transaction) => {
    try {
      const updatedTransaction = { ...transaction, paid: !transaction.paid };
      const newLocalTransactions = localTransactions.map(t =>
        t.id === transaction.id ? updatedTransaction : t
      );
      setLocalTransactions(newLocalTransactions);

      const result = await updateTransaction(updatedTransaction);

      if (!result) {
        throw new Error('Resposta inválida da API');
      }

      toast({
        title: 'Sucesso',
        description: `Transação marcada como ${result.paid ? 'paga' : 'pendente'}`,
      });
    } catch (error) {
      // Revert optimistic update
      const revertedTransactions = localTransactions.map(t =>
        t.id === transaction.id ? transaction : t
      );
      setLocalTransactions(revertedTransactions);

      console.error('Erro ao atualizar status de pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status de pagamento',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters);
  };

  // Função utilitária recursiva para converter undefined em null
  function deepRemoveUndefined(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(deepRemoveUndefined);
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : deepRemoveUndefined(v)])
      );
    }
    return obj;
  }

  const handleSaveTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      if (editingTransaction) {
        const updatedTransaction = {
          ...editingTransaction,
          ...transactionData,
        };
        await updateTransaction(updatedTransaction);
        toast({
          title: 'Sucesso',
          description: 'Transação atualizada com sucesso',
        });
      } else {
        const newTransaction = {
          user_id,
          description: transactionData.description || '',
          amount: transactionData.amount || 0,
          date: transactionData.date || new Date().toISOString(),
          type: transactionData.type || 'expense',
          category_id: transactionData.category_id || '',
          payment_method: transactionData.payment_method || 'cash',
          paid: true,
          account_id: transactionData.account_id ?? null,
          credit_card_id: transactionData.credit_card_id ?? null,
          installments: transactionData.installments ?? null,
          current_installment: transactionData.current_installment ?? null,
          parent_transaction_id: transactionData.parent_transaction_id ?? null,
          notes: transactionData.notes ?? null,
          expense_type: transactionData.expense_type ?? null,
        };
        await addTransaction(deepRemoveUndefined(newTransaction) as any);
        toast({
          title: 'Sucesso',
          description: 'Transação criada com sucesso',
        });
      }
      
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a transação',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Carregando...</div>;
  }

  const renderTransactionForm = () => (
    <StandardModal
      title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      description={editingTransaction ? 'Edite os detalhes da transação' : 'Adicione os detalhes da nova transação'}
      open={isFormOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingTransaction(null);
        }
        setIsFormOpen(isOpen);
      }}
    >
      <TransactionForm
        transaction={editingTransaction || undefined}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />
    </StandardModal>
  );

  // Mobile and desktop layouts
  return (
    <div className="space-y-4">
      {isMobile ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Transações</h2>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-1"
              onClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
              }}
            >
              <span className="sr-only">Nova Transação</span>
              + Nova
            </button>
          </div>
          
          <TransactionsSummary transactions={filteredTransactions} />
          
          <TransactionsFilter
            categories={categories}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </>
      ) : (
        <>
          <TransactionsHeader 
            onAddTransaction={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
          />
          
          <TransactionsSummary transactions={filteredTransactions} />
          
          <TransactionsFilter
            categories={categories}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </>
      )}

      {renderTransactionForm()}

      <div className={`space-y-3 ${sortedTransactions.length === 0 ? 'py-8 text-center' : ''}`}>
        {sortedTransactions.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma transação encontrada</p>
        ) : (
          sortedTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onTogglePaid={handleTogglePaid}
              isMobile={isMobile}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionsList;
