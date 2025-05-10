import React, { useState } from 'react';
import { Investment } from "@/types/finance";
import { InvestmentCard } from "./InvestmentCard";
import { InvestmentForm } from "./InvestmentForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { toast } from "react-hot-toast";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { investmentTypes } from "@/utils/investment";

interface FilterOptions {
  searchTerm: string;
  type: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  active: boolean | null;
}

export function InvestmentsList() {
  const { investments, addInvestment, updateInvestment, deleteInvestment } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    type: null,
    minAmount: null,
    maxAmount: null,
    active: null
  });

  const handleAddInvestment = () => {
    setSelectedInvestment(undefined);
    setIsFormOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsFormOpen(true);
  };

  const handleDeleteInvestment = async (id: string) => {
    try {
      await deleteInvestment(id);
      toast.success('Investimento excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir investimento:', error);
      toast.error('Não foi possível excluir o investimento');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
      toast.error('Não foi possível salvar o investimento');
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesType = !filters.type || investment.type === filters.type;
    const matchesAmount = (!filters.minAmount || investment.amount >= filters.minAmount) &&
                         (!filters.maxAmount || investment.amount <= filters.maxAmount);
    const matchesActive = filters.active === null || investment.active === filters.active;
    
    return matchesSearch && matchesType && matchesAmount && matchesActive;
  });

  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturn = filteredInvestments.reduce((sum, inv) => sum + (inv.currentReturn || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Investimentos</h2>
          <p className="text-muted-foreground">
            Total Investido: {formatCurrency(totalInvested)} | Retorno Total: {formatPercentage(totalReturn)}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar investimentos..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddInvestment}>Novo Investimento</Button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
          <div className="flex gap-2">
            {investmentTypes.map((type) => (
              <Button
                key={type.value}
                variant={filters.type === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  type: prev.type === type.value ? null : type.value
                }))}
              >
                {type.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filters.active === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters(prev => ({
                ...prev,
                active: prev.active === true ? null : true
              }))}
            >
              Ativos
            </Button>
            <Button
              variant={filters.active === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters(prev => ({
                ...prev,
                active: prev.active === false ? null : false
              }))}
            >
              Inativos
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInvestments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            investment={investment}
            onEdit={handleEditInvestment}
            onDelete={handleDeleteInvestment}
          />
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedInvestment ? "Editar Investimento" : "Novo Investimento"}
            </DialogTitle>
          </DialogHeader>
          <InvestmentForm
            investment={selectedInvestment}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

