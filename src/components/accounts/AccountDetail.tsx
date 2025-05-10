import { useState } from "react";
import { BankAccount } from "@/types/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Edit, Plus, Wallet, Landmark, PiggyBank, BarChart4 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from "@/contexts/FinanceContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import TransactionForm from "@/components/transactions/TransactionForm";
import { TabButton } from "@/components/ui/tab-button";
import { Clock, History, List } from "lucide-react";

interface AccountDetailProps {
  account: BankAccount;
  onEdit: () => void;
}

export default function AccountDetail({ account, onEdit }: AccountDetailProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { transactions } = useFinance();
  const [activeTab, setActiveTab] = useState("transactions");
  const tabs = [
    { id: "transactions", label: "Lançamentos Futuros", icon: <Clock className="h-4 w-4" /> },
    { id: "history", label: "Histórico de Lançamentos Futuros", icon: <History className="h-4 w-4" /> },
    { id: "all", label: "Transações Recentes", icon: <List className="h-4 w-4" /> }
  ];

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Landmark size={24} />;
      case "savings":
        return <PiggyBank size={24} />;
      case "investment":
        return <BarChart4 size={24} />;
      case "wallet":
        return <Wallet size={24} />;
      default:
        return <Wallet size={24} />;
    }
  };
  
  const getAccountTypeName = (type: string) => {
    switch (type) {
      case "checking":
        return "Conta Corrente";
      case "savings":
        return "Poupança";
      case "investment":
        return "Investimento";
      case "wallet":
        return "Carteira";
      case "other":
        return "Outros";
      default:
        return "Conta";
    }
  };

  // Filtra transações da conta e calcula o histórico de saldo
  const accountTransactions = transactions
    .filter(t => t.account_id === account.id && !t.paid)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Soma dos lançamentos futuros (não pagos)
  const futureAmount = transactions
    .filter(t => t.account_id === account.id && !t.paid)
    .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

  // Saldo atual: saldo inicial + todas as transações pagas
  const currentBalance = transactions
    .filter(t => t.account_id === account.id && t.paid)
    .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, account.balance ?? 0);

  // Log para depuração
  // console.log('Transações da conta', account.name, accountTransactions);

  const calculateBalanceHistory = () => {
    const monthlyBalances = new Map<string, number>();
    let runningBalance = account.balance ?? 0;
    
    // Filtra apenas transações não pagas e ordena por data
    const unpaidTransactions = transactions
      .filter(t => t.account_id === account.id && !t.paid)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    unpaidTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
      
      if (transaction.type === 'expense') {
        runningBalance -= transaction.amount;
      } else {
        runningBalance += transaction.amount;
      }
      
      monthlyBalances.set(monthKey, runningBalance);
    });
    
    return Array.from(monthlyBalances.entries()).map(([month, balance]) => ({
      month,
      balance
    }));
  };

  const balanceHistory = calculateBalanceHistory();

  // Pega as 5 transações mais recentes
  const recentTransactions = accountTransactions.slice(0, 5);

  // Todas as transações pagas da conta
  const paidAccountTransactions = transactions
    .filter(t => t.account_id === account.id && t.paid)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 5 transações pagas mais recentes
  const mostRecentTransactions = paidAccountTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center"
              style={{ backgroundColor: account.color || "#6750A4" }}
            >
              {getAccountIcon(account.type)}
            </div>
            <div>
              <CardTitle>{account.name}</CardTitle>
              <CardDescription>
                {getAccountTypeName(account.type)}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2" size={16} />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lançamentos Futuros</p>
              <p className="text-3xl font-bold">{formatCurrency(futureAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
              <p className="text-xl font-medium">{formatCurrency(currentBalance)}</p>
              <p className="text-sm text-muted-foreground">
                Saldo em conta
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="mr-2" size={16} />
                  Nova Transação
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-6 pb-6 pt-4 max-h-[90vh] overflow-y-auto" data-force-inert>
                <DrawerHeader>
                  <DrawerTitle>Nova Transação</DrawerTitle>
                  <DrawerDescription>
                    Preencha os detalhes da nova transação abaixo
                  </DrawerDescription>
                </DrawerHeader>
                <TransactionForm
                  onClose={() => setIsFormOpen(false)}
                  onSave={async () => {}}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-1 w-full">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            value={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-normal break-words flex-1 min-w-0"
          />
        ))}
      </div>
      {activeTab === "transactions" && (
        <div className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos Futuros Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum lançamento futuro encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {activeTab === "history" && (
        <div className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Lançamentos Futuros</CardTitle>
            </CardHeader>
            <CardContent>
              {balanceHistory.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={balanceHistory}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `R$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value}`, 'Saldo']}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke={account.color || "#6750A4"}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum histórico de lançamentos futuros disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {activeTab === "all" && (
        <div className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mostRecentTransactions.length > 0 ? (
                mostRecentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma transação recente encontrada
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
