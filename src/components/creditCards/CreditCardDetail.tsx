import React from 'react';
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { CreditCard, Transaction, CreditCardDetailProps } from "@/types/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Edit, CreditCard as CreditCardIcon, Plus, Calendar, CreditCard as CardIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CreditCardStatements from "./CreditCardStatements";
import CreditCardSpendingChart from "./CreditCardSpendingChart";
import { StandardModal } from "@/components/ui/standard-modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TabButton } from "@/components/ui/tab-button";
import { addMonths } from 'date-fns';

export default function CreditCardDetail({ card, onEdit }: CreditCardDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { getCreditCardTransactions, addTransaction, user_id } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const transactions = getCreditCardTransactions(card.id);
  // Definir o limite do cartão de forma segura
  const cardLimit = card.limit ?? card.limit_amount ?? 0;
  const usedAmount = transactions
    .filter(t => !t.paid)
    .reduce((sum, t) => sum + t.amount, 0);
  const usedPercentage = cardLimit > 0 ? (usedAmount / cardLimit) * 100 : 0;

  // Calcula o valor da próxima fatura
  const nextStatementAmount = calculateNextStatementAmount(card, transactions);

  // Filtra transações do cartão e calcula o histórico de gastos
  const cardTransactions = transactions
    .filter(t => t.credit_card_id === card.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const calculateSpendingHistory = () => {
    const monthlySpending = new Map<string, number>();
    
    cardTransactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleString('pt-BR', { month: 'short' });
        
        const currentSpending = monthlySpending.get(monthKey) || 0;
        monthlySpending.set(monthKey, currentSpending + transaction.amount);
      });
    
    return Array.from(monthlySpending.entries()).map(([month, spending]) => ({
      month,
      spending
    }));
  };

  const spendingHistory = calculateSpendingHistory();

  // Pega as 5 transações mais recentes
  const recentTransactions = cardTransactions.slice(0, 5);

  const tabOptions = [
    { id: "overview", label: "Visão Geral", icon: <CreditCardIcon className="h-4 w-4" /> },
    { id: "statements", label: "Faturas", icon: <Calendar className="h-4 w-4" /> },
    { id: "transactions", label: "Transações", icon: <CardIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center"
              style={{ backgroundColor: card.color || "#6750A4" }}
            >
              <CreditCardIcon size={24} className="text-white" />
            </div>
            <div>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>
                Fecha dia {card.closing_day} | Vence dia {card.due_day}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2" size={16} />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Limite Total</p>
              <p className="text-2xl font-bold">{formatCurrency(cardLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Limite Utilizado
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(usedAmount)}{" "}
                <span className="text-sm text-muted-foreground">
                  ({usedPercentage.toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1 text-sm">
              <span>Disponível: {formatCurrency(cardLimit - usedAmount)}</span>
              <span>
                {formatCurrency(usedAmount)} de {formatCurrency(cardLimit)}
              </span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className={`h-full rounded-full ${
                  usedPercentage > 90
                    ? "bg-destructive"
                    : usedPercentage > 70
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(100, usedPercentage)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2" size={16} />
              Nova Transação
            </Button>
            <StandardModal
              open={isFormOpen}
              onOpenChange={(open) => setIsFormOpen(open)}
              title="Nova Transação"
              description="Preencha os dados da transação"
            >
              <TransactionForm
                onClose={() => setIsFormOpen(false)}
                onSave={async (transaction) => {
                  await addTransaction({
                    ...transaction,
                    user_id,
                  });
                  // Lógica para criar parcelas futuras
                  if (
                    transaction.installments &&
                    transaction.installments > 1 &&
                    transaction.current_installment &&
                    transaction.current_installment < transaction.installments &&
                    transaction.date
                  ) {
                    const baseDate = new Date(transaction.date);
                    for (
                      let i = transaction.current_installment + 1;
                      i <= transaction.installments;
                      i++
                    ) {
                      const nextDate = addMonths(baseDate, i - transaction.current_installment);
                      await addTransaction({
                        ...transaction,
                        current_installment: i,
                        date: nextDate.toISOString(),
                        id: undefined,
                        user_id,
                      });
                    }
                  }
                  setIsFormOpen(false);
                }}
                transaction={{
                  credit_card_id: card.id,
                  payment_method: "credit",
                  type: "expense"
                } as Partial<Transaction>}
              />
            </StandardModal>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-1 w-full">
        {tabOptions.map(tab => (
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

      {activeTab === "overview" && (
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full flex justify-center items-center">
                  <div className="w-[220px] h-[220px] sm:w-[320px] sm:h-[320px]">
                    <CreditCardSpendingChart cardId={card.id} transactions={transactions} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Próxima Fatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Fecha em</p>
                    <p className="font-medium">
                      {format(
                        getNextClosingDate(card.closing_day),
                        "dd 'de' MMMM",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Vence em</p>
                    <p className="font-medium">
                      {format(
                        getNextDueDate(card.due_day, card.closing_day),
                        "dd 'de' MMMM",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <p className="text-muted-foreground">Valor atual</p>
                    <p className="font-bold">{formatCurrency(nextStatementAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {activeTab === "statements" && (
        <div className="pt-4">
          <CreditCardStatements cardId={card.id} />
        </div>
      )}
      {activeTab === "transactions" && (
        <div className="pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                {dateRange && (
                  <Button
                    variant="ghost"
                    onClick={() => setDateRange(undefined)}
                    className="h-8 px-2 lg:px-3"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2" size={16} />
                Nova Transação
              </Button>
            </div>

            {/* Transações não pagas */}
            <Card>
              <CardHeader>
                <CardTitle>Transações não pagas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cardTransactions.filter(t => !t.paid).length > 0 ? (
                  cardTransactions
                    .filter(t => !t.paid)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            {transaction.installments && transaction.current_installment && (
                              <span className="ml-2">
                                ({transaction.current_installment}/{transaction.installments})
                              </span>
                            )}
                          </p>
                        </div>
                        <p className={`font-medium ${transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma transação não paga encontrada
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transações pagas */}
            <Card>
              <CardHeader>
                <CardTitle>Transações pagas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cardTransactions.filter(t => t.paid).length > 0 ? (
                  cardTransactions
                    .filter(t => t.paid)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            {transaction.installments && transaction.current_installment && (
                              <span className="ml-2">
                                ({transaction.current_installment}/{transaction.installments})
                              </span>
                            )}
                          </p>
                        </div>
                        <p className={`font-medium ${transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma transação paga encontrada
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function renderTransactionsList(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    );
  }

  // Ordenando por data mais recente
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex justify-between items-center p-3 border rounded-md"
        >
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transaction.date), "dd/MM/yyyy")}
              {transaction.installments && transaction.current_installment && (
                <span className="ml-2">
                  ({transaction.current_installment}/{transaction.installments})
                </span>
              )}
            </p>
          </div>
          <p className="font-medium">{formatCurrency(transaction.amount)}</p>
        </div>
      ))}
    </div>
  );
}

// Funções auxiliares para calcular datas de fechamento e vencimento
function getNextClosingDate(closing_day: number): Date {
  const today = new Date();
  const validClosingDay = Math.min(Math.max(1, closing_day || 1), 31);
  let nextClosingDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    validClosingDay
  );
  if (today.getDate() > validClosingDay) {
    nextClosingDate.setMonth(nextClosingDate.getMonth() + 1);
  }
  return nextClosingDate;
}

function getNextDueDate(due_day: number, closing_day: number): Date {
  const today = new Date();
  const validDueDay = Math.min(Math.max(1, due_day || 1), 31);
  const validClosingDay = Math.min(Math.max(1, closing_day || 1), 31);
  let nextDueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    validDueDay
  );
  if (validDueDay <= validClosingDay) {
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }
  return nextDueDate;
}

// Função para calcular o valor da próxima fatura
function calculateNextStatementAmount(card: CreditCard, transactions: Transaction[]): number {
  const today = new Date();
  const closingDay = Math.min(Math.max(1, card.closing_day || 1), 31);
  const dueDay = Math.min(Math.max(1, card.due_day || 1), 31);
  let referenceMonth = today.getMonth();
  let referenceYear = today.getFullYear();
  if (today.getDate() > closingDay) {
    referenceMonth = today.getMonth() + 1;
    if (referenceMonth > 11) {
      referenceMonth = 0;
      referenceYear++;
    }
  }
  let closingDate = new Date(referenceYear, referenceMonth, closingDay);
  let prevClosingDate = new Date(referenceYear, referenceMonth - 1, closingDay);
  const statementTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= prevClosingDate && transactionDate <= closingDate;
  });
  const totalAmount = statementTransactions.reduce((sum, t) => {
    const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
    return sum + amount;
  }, 0);
  return totalAmount;
}
