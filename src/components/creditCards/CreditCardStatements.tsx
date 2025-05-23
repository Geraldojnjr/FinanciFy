import React from 'react';
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { format, addMonths, startOfMonth, endOfMonth, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { CreditCardStatementsProps } from '@/types/finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Função auxiliar para validar e formatar a data
const getValidDateString = (date: Date): string => {
  if (!isValid(date)) {
    return new Date().toISOString(); // Retorna a data atual se a data for inválida
  }
  return date.toISOString();
};

export default function CreditCardStatements({
  cardId,
}: CreditCardStatementsProps) {
  const { creditCards, transactions, updateTransaction, accounts } = useFinance();
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const card = creditCards.find((c) => c.id === cardId);

  if (!card) return null;

  // Filter transactions for this card
  const cardTransactions = transactions.filter((t) => 
    t.credit_card_id === cardId && t.active !== false
  );

  // Group transactions by month/year to create statements
  const statements = generateStatements(card.closing_day, card.due_day, cardTransactions);

  // Function to pay all transactions in a statement
  const handlePayStatement = async (statement: any) => {
    try {
      if (!selectedAccount) {
        toast.error("Por favor, selecione uma conta para pagar a fatura");
        return;
      }

      setIsPaying(getValidDateString(statement.period.start));
      
      // Filter only unpaid transactions in the statement
      const unpaidTransactions = statement.transactions.filter((t: any) => !t.paid);
      
      if (unpaidTransactions.length === 0) {
        toast.info("Todas as transações desta fatura já estão pagas.");
        return;
      }
      
      // Update each transaction as paid and link to the selected account
      const updatePromises = unpaidTransactions.map((transaction: any) => {
        return updateTransaction({
          ...transaction,
          paid: true,
          account_id: selectedAccount
        });
      });
      
      await Promise.all(updatePromises);
      
      toast.success(`Fatura de ${format(statement.period.start, "MMMM/yyyy", { locale: ptBR })} paga com sucesso!`);
      setSelectedAccount(""); // Reset selected account
    } catch (error) {
      console.error("Erro ao pagar fatura:", error);
      toast.error("Erro ao pagar fatura. Tente novamente.");
    } finally {
      setIsPaying(null);
    }
  };

  const toggleStatement = (statementId: string) => {
    setSelectedStatement(selectedStatement === statementId ? null : statementId);
  };

  return (
    <div className="space-y-4">
      {statements.length > 0 ? (
        statements
          .sort((a, b) => b.closingDate.getTime() - a.closingDate.getTime())
          .map((statement, index) => {
            const statementId = getValidDateString(statement.period.start);
            const isSelected = selectedStatement === statementId;
            
            return (
              <Card key={index} className={index === 0 ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div 
                    className="flex justify-between items-center mb-2 cursor-pointer"
                    onClick={() => toggleStatement(statementId)}
                  >
                    <div>
                      <h3 className="font-medium">
                        Fatura de {formatDate(statement.dueDate)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(statement.period.start)} a{" "}
                        {formatDate(statement.period.end)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xl">
                        {formatCurrency(statement.totalAmount)}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {statement.status}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">Transações desta fatura</h4>
                      <div className="space-y-2">
                        {statement.transactions && statement.transactions.length > 0 ? (
                          statement.transactions.map((transaction: any) => (
                            <div
                              key={transaction.id}
                              className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(transaction.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {transaction.paid ? 'Pago' : 'Pendente'}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground">
                            Nenhuma transação encontrada nesta fatura
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Transações:</span>{" "}
                      {statement.transactionCount}
                    </p>
                    
                    {(statement.status === "A pagar" || statement.status === "Fechada" || statement.status === "Vencida") && !statement.allTransactionsPaid && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isPaying === getValidDateString(statement.period.start)}
                          >
                            {isPaying === getValidDateString(statement.period.start) ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Pagando...
                              </>
                            ) : (
                              "Pagar Fatura"
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar pagamento da fatura</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você está prestes a marcar todas as transações da fatura de {format(statement.period.start, "MMMM/yyyy", { locale: ptBR })} como pagas. 
                              Isso afetará {statement.transactions.filter((t: any) => !t.paid).length} transações.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          
                          <div className="py-4">
                            <Label htmlFor="account">Selecione a conta para pagar a fatura:</Label>
                            <Select
                              value={selectedAccount}
                              onValueChange={setSelectedAccount}
                            >
                              <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Selecione uma conta" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts
                                  .filter(account => account.type === 'checking' || account.type === 'savings')
                                  .map(account => (
                                    <SelectItem key={account.id} value={account.id}>
                                      {account.name} - {formatCurrency(account.balance)}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedAccount("")}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handlePayStatement(statement)}
                              disabled={!selectedAccount}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Nenhuma fatura disponível para este cartão.
          </p>
        </Card>
      )}
    </div>
  );
}

function generateStatements(
  closingDay: number,
  dueDay: number,
  transactions: any[]
) {
  const statements = [];
  const today = new Date();
  const currentDay = today.getDate();

  // Garantir que os dias são válidos
  closingDay = Math.min(Math.max(1, closingDay || 1), 31);
  dueDay = Math.min(Math.max(1, dueDay || 1), 31);

  // Determine the reference month based on the due date
  let referenceMonth = today.getMonth();
  let referenceYear = today.getFullYear();

  // If already past the due date, the bill is for next month
  if (currentDay > dueDay) {
    referenceMonth = today.getMonth() + 1;
    if (referenceMonth > 11) {
      referenceMonth = 0;
      referenceYear++;
    }
  }

  // Generate 5 previous statements and 5 future ones
  for (let i = -5; i < 5; i++) {
    try {
      // Calculate bill month and year
      let month = referenceMonth + i;
      let year = referenceYear;
      
      // Adjust month and year if needed
      if (month < 0) {
        month += 12;
        year--;
      } else if (month > 11) {
        month -= 12;
        year++;
      }

      // Calculate due date
      let dueDate = new Date(year, month, dueDay);
      
      // Calculate closing date for current month
      let closingDate = new Date(year, month, closingDay);
      
      // Calculate closing date for previous month (start of period)
      let prevClosingDate = new Date(year, month - 1, closingDay);
      if (month === 0) {
        prevClosingDate = new Date(year - 1, 11, closingDay);
      }

      // Adjust closing date to be the day before current month's closing
      let adjustedClosingDate = new Date(closingDate);
      adjustedClosingDate.setDate(adjustedClosingDate.getDate() - 1);

      // Verificar se as datas são válidas
      if (!isValid(dueDate) || !isValid(closingDate) || !isValid(prevClosingDate) || !isValid(adjustedClosingDate)) {
        console.warn('Data inválida encontrada, pulando este período');
        continue;
      }

      // Filter transactions for this period
      const statementTransactions = transactions.filter((t) => {
        try {
          const transactionDate = new Date(t.date);
          if (!isValid(transactionDate)) {
            console.warn('Data de transação inválida:', t);
            return false;
          }
          
          // Check if transaction is within bill period
          // Bill period: from previous month's closing date to the day before current month's closing
          return transactionDate >= prevClosingDate && transactionDate <= adjustedClosingDate;
        } catch (error) {
          console.warn('Erro ao processar data da transação:', error);
          return false;
        }
      });

      // Calculate total amount - ensure it's a number
      const totalAmount = statementTransactions.reduce((sum, t) => {
        // Ensure amount is a number
        const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
        return sum + amount;
      }, 0);

      // Check if all transactions are paid
      const allTransactionsPaid = statementTransactions.length > 0 && 
        statementTransactions.every(t => t.paid === 1 || t.paid === true);

      // Define statement status
      let status = "Fechada";
      if (adjustedClosingDate > today) {
        status = "Aberta";
      } else if (dueDate < today) {
        if (statementTransactions.length === 0) {
          status = "Paga";
        } else if (statementTransactions.some(t => t.paid === 0 || t.paid === false)) {
          status = "Vencida";
        } else {
          status = "Paga";
        }
      } else {
        if (statementTransactions.length === 0) {
          status = "Paga";
        } else if (statementTransactions.some(t => t.paid === 0 || t.paid === false)) {
          status = "A pagar";
        } else {
          status = "Paga";
        }
      }

      // Add statement to list
      statements.push({
        period: {
          start: prevClosingDate,
          end: adjustedClosingDate,
        },
        closingDate,
        dueDate,
        totalAmount,
        transactionCount: statementTransactions.length,
        status,
        transactions: statementTransactions,
        allTransactionsPaid,
        paidAmount: totalAmount
      });
    } catch (error) {
      console.error('Erro ao gerar fatura:', error);
      continue;
    }
  }

  return statements;
}
