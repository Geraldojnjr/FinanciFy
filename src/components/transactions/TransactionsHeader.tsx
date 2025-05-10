
import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

interface TransactionsHeaderProps {
  onAddTransaction: () => void;
  onToggleFilters?: () => void;
  showFilters?: boolean;
}

export function TransactionsHeader({ 
  onAddTransaction, 
  onToggleFilters,
  showFilters = false 
}: TransactionsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Transações</h2>
      <div className="flex items-center gap-2">
        {onToggleFilters && (
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            size="sm"
            onClick={onToggleFilters}
            className={showFilters ? "bg-primary/10" : ""}
          >
            <Filter className="mr-2" size={16} />
            Filtros
          </Button>
        )}
        <IconButton 
          icon={Plus} 
          variant="default" 
          label="Nova Transação" 
          onClick={onAddTransaction}
        />
      </div>
    </div>
  );
}
