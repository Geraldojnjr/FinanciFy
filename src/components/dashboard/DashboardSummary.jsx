
import React from 'react';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from '@/utils/format';

const DashboardSummary = ({ balance, income, expenses }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6 animate-fade-in">
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(balance || 0)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receitas (Mês Atual)</p>
              <p className="text-2xl font-semibold mt-1 text-green-600 dark:text-green-400">{formatCurrency(income || 0)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <ArrowUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Despesas (Mês Atual)</p>
              <p className="text-2xl font-semibold mt-1 text-red-600 dark:text-red-400">{formatCurrency(expenses || 0)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
