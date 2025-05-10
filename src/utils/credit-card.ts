import { Transaction } from "@/types/finance";

interface Statement {
  period: {
    start: Date;
    end: Date;
  };
  closingDate: Date;
  dueDate: Date;
  totalAmount: number;
  transactionCount: number;
  status: string;
  transactions: Transaction[];
  allTransactionsPaid: boolean;
  paidAmount: number;
}

export function generateStatements(
  closingDay: number,
  dueDay: number,
  transactions: Transaction[]
): Statement[] {
  const statements: Statement[] = [];
  const today = new Date();
  const currentDay = today.getDate();

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

    // Filter transactions for this period
    const statementTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      
      // Check if transaction is within bill period
      // Bill period: from previous month's closing date to the day before current month's closing
      return transactionDate >= prevClosingDate && transactionDate <= adjustedClosingDate;
    });

    // Calculate total amount - ensure it's a number
    const totalAmount = statementTransactions.reduce((sum, t) => {
      // Ensure amount is a number
      const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
      return sum + amount;
    }, 0);

    // Check if all transactions are paid - only include paid transactions in reports
    const paidTransactions = statementTransactions.filter(t => t.paid === true);
    const allTransactionsPaid = statementTransactions.length > 0 && 
      statementTransactions.every(t => t.paid === true);

    // Define statement status
    let status = "Fechada";
    if (adjustedClosingDate > today) {
      status = "Aberta";
    } else if (dueDate < today) {
      if (statementTransactions.length === 0) {
        status = "Paga";
      } else if (statementTransactions.some(t => t.paid === false)) {
        status = "Vencida";
      } else {
        status = "Paga";
      }
    } else {
      if (statementTransactions.length === 0) {
        status = "Paga";
      } else if (statementTransactions.some(t => t.paid === false)) {
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
      transactionCount: paidTransactions.length, // Only count paid transactions
      status,
      transactions: statementTransactions,
      allTransactionsPaid,
      paidAmount: paidTransactions.reduce((sum, t) => {
        const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
        return sum + amount;
      }, 0)
    });
  }

  return statements;
}

export function getNextClosingDate(closingDay: number): Date {
  const today = new Date();
  const validClosingDay = Math.min(Math.max(1, closingDay || 1), 31);
  
  let nextClosingDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    validClosingDay
  );

  // Se a data de fechamento já passou este mês, avança para o próximo
  if (today.getDate() > validClosingDay) {
    nextClosingDate.setMonth(nextClosingDate.getMonth() + 1);
  }

  return nextClosingDate;
}

export function getNextDueDate(dueDay: number, closingDay: number): Date {
  const today = new Date();
  const validDueDay = Math.min(Math.max(1, dueDay || 1), 31);
  const validClosingDay = Math.min(Math.max(1, closingDay || 1), 31);
  
  let nextDueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    validDueDay
  );
  
  // Se o vencimento é antes do fechamento, então é no mês seguinte
  if (validDueDay <= validClosingDay) {
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  } else {
    nextDueDate.setMonth(nextDueDate.getMonth());
  }

  return nextDueDate;
}

export function calculateNextStatementAmount(card: { closingDay: number; dueDay: number }, transactions: Transaction[]): number {
  const today = new Date();
  const closingDay = Math.min(Math.max(1, card.closingDay || 1), 31);
  const dueDay = Math.min(Math.max(1, card.dueDay || 1), 31);
  
  // Determina o mês de referência baseado no dia de fechamento
  let referenceMonth = today.getMonth();
  let referenceYear = today.getFullYear();

  // Se já passou do dia de fechamento, a fatura é do próximo mês
  if (today.getDate() > closingDay) {
    referenceMonth = today.getMonth() + 1;
    if (referenceMonth > 11) {
      referenceMonth = 0;
      referenceYear++;
    }
  }

  // Calcula data de fechamento da fatura atual
  let closingDate = new Date(referenceYear, referenceMonth, closingDay);
  
  // Calcula data de fechamento da fatura anterior (início do período)
  let prevClosingDate = new Date(referenceYear, referenceMonth - 1, closingDay);
  
  // Filtra transações deste período
  const statementTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    
    // Verifica se a transação está dentro do período da fatura
    // Período da fatura: do dia de fechamento do mês anterior até o dia de fechamento do mês atual
    return transactionDate >= prevClosingDate && transactionDate <= closingDate;
  });

  // Calcula valor total - Garantir que o valor seja um número
  const totalAmount = statementTransactions.reduce((sum, t) => {
    // Garantir que o valor seja um número
    const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount) || 0;
    return sum + amount;
  }, 0);

  return totalAmount;
} 