import React, { useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PiggyBank, ArrowRightLeft } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import AccountsList from "@/components/accounts/AccountsList";
import AccountForm from "@/components/accounts/AccountForm.tsx";
import AccountDetail from "@/components/accounts/AccountDetail";
import { BankAccount } from "@/types/finance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AccountTransferModal from "@/components/accounts/AccountTransferModal";
import { StandardModal } from "@/components/ui/standard-modal";

export default function AccountsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const { accounts } = useFinance();

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleTransfer = () => {
    setIsTransferOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleAccountCreated = (account: BankAccount) => {
    setIsFormOpen(false);
    setSelectedAccount(account);
  };

  const handleTransferSuccess = () => {
    // Poderíamos atualizar os dados se necessário
    setIsTransferOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleTransfer} 
              className="flex items-center gap-2"
            >
              <ArrowRightLeft size={16} />
              Transferir
            </Button>
            <Button onClick={handleAddAccount} className="flex items-center gap-2">
              <Plus size={16} />
              Nova Conta
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground">
          Gerencie suas contas bancárias e saldos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="h-full dark:border-border">
              <CardHeader>
                <CardTitle>Suas Contas</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountsList
                  accounts={accounts}
                  selectedAccountId={selectedAccount?.id}
                  onSelectAccount={setSelectedAccount}
                  onEditAccount={handleEditAccount}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {isFormOpen ? (
              <Card className="dark:border-border">
                <CardHeader>
                  <CardTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccountForm
                    account={editingAccount}
                    onClose={() => setIsFormOpen(false)}
                    onSaved={handleAccountCreated}
                  />
                </CardContent>
              </Card>
            ) : selectedAccount ? (
              <AccountDetail 
                account={selectedAccount} 
                onEdit={() => handleEditAccount(selectedAccount)} 
              />
            ) : (
              <Card className="p-6 text-center dark:border-border">
                <p className="text-muted-foreground">Selecione uma conta para visualizar os detalhes</p>
              </Card>
            )}
          </div>
        </div>

        {/* Dialog para o formulário no mobile */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? "Atualize os detalhes da sua conta bancária."
                  : "Adicione uma nova conta para gerenciar suas finanças."}
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              account={editingAccount}
              onClose={() => setIsFormOpen(false)}
              onSaved={handleAccountCreated}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de transferência entre contas */}
        <StandardModal
          open={isTransferOpen}
          onOpenChange={setIsTransferOpen}
          title="Transferência entre Contas"
        >
          <AccountTransferModal
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
            onSuccess={handleTransferSuccess}
          />
        </StandardModal>
      </div>
    </Layout>
  );
}
