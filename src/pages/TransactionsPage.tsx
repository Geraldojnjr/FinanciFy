
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Tags as TagsIcon } from "lucide-react";
import { TabButton } from "@/components/ui/tab-button";
import TransactionsList from "@/components/transactions/TransactionsList";
import CategoriesManager from "@/components/transactions/CategoriesManager";
import { useFinance } from "@/contexts/FinanceContext";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TransactionsPage() {
  const { 
    transactions, 
    isLoading, 
    error,
    loadTransactions
  } = useFinance();
  
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState("transactions");

  const tabs = [
    { id: "transactions", icon: <Activity className="h-4 w-4" />, label: "Transações" },
    { id: "categories", icon: <TagsIcon className="h-4 w-4" />, label: "Categorias" }
  ];

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || 'Ocorreu um erro ao carregar as transações'}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className={isMobile ? "flex flex-col space-y-2 w-full" : "grid grid-cols-2 gap-3 w-full"}>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              value={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 
                "border-l-4 border-primary bg-primary/5 dark:bg-primary/10" : ""}
            />
          ))}
        </div>

        {activeTab === "transactions" && (
          <Card className="overflow-hidden">
            <CardHeader className={isMobile ? "p-4" : ""}>
              <CardTitle>Transações</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <TransactionsList 
                transactions={transactions} 
                onTransactionDeleted={loadTransactions}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "categories" && (
          <Card className="overflow-hidden">
            <CardHeader className={isMobile ? "p-4" : ""}>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "p-3 pt-0" : ""}>
              <CategoriesManager />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
