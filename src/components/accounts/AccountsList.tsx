import React, { useState, useEffect } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { BankAccount } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Edit, Wallet, Landmark, PiggyBank, BarChart4 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortedAccounts } from '@/hooks/useSortedAccounts';

interface AccountsListProps {
  accounts: BankAccount[];
  selectedAccountId?: string;
  onSelectAccount: (account: BankAccount) => void;
  onEditAccount: (account: BankAccount) => void;
}

export default function AccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onEditAccount,
}: AccountsListProps) {
  const { transactions } = useFinance();
  const [localAccounts, setLocalAccounts] = useState<BankAccount[]>([]);
  const [sortOptions, setSortOptions] = useState({
    field: 'balance' as const,
    order: 'desc' as const
  });

  useEffect(() => {
    setLocalAccounts(accounts || []);
  }, [accounts]);

  // Filtra transações pagas para cada conta
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

  // Ordena as contas usando o hook
  const sortedAccounts = useSortedAccounts(accountBalances, sortOptions);

  // Calcula o saldo total de todas as contas
  const totalBalance = accountBalances.reduce((sum, account) => sum + Number(account.balance), 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Landmark size={16} />;
      case "savings":
        return <PiggyBank size={16} />;
      case "investment":
        return <BarChart4 size={16} />;
      case "wallet":
        return <Wallet size={16} />;
      default:
        return <Wallet size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 border rounded-lg bg-muted/30">
        <p className="text-sm font-medium mb-1">Saldo Total</p>
        <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
      </div>

      <div className="space-y-3 mt-4">
        {sortedAccounts && sortedAccounts.length > 0 ? (
          sortedAccounts.map((account) => {
            const isSelected = account.id === selectedAccountId;
            const balance = account.balance;

            return (
              <div
                key={account.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => onSelectAccount(account)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: account.color || "#6750A4" }}
                    >
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.bank && (
                        <p className="text-xs text-muted-foreground">{account.bank}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAccount(account);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="text-xl font-bold">{formatCurrency(balance)}</p>
                  {balance !== account.initialBalance && (
                    <p className={`text-xs ${balance > account.initialBalance ? 'text-finance-income' : 'text-finance-expense'}`}>
                      {balance > account.initialBalance ? '+' : ''}
                      {formatCurrency(balance - account.initialBalance)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground">
            Nenhuma conta encontrada
          </div>
        )}
      </div>
    </div>
  );
}
