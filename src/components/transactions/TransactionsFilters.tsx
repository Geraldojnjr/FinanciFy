
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { TransactionType, PaymentMethod, Category } from '@/types/finance';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { BadgeIcon } from '@/components/ui/badge-icon';

interface TransactionsFiltersProps {
  onFilter: (filters: {
    dateRange: DateRange | undefined;
    categories: string[];
    types: TransactionType[];
    paymentMethods: PaymentMethod[];
  }) => void;
}

export default function TransactionsFilters({ onFilter }: TransactionsFiltersProps) {
  const { categories } = useFinance();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);

  const handleFilter = () => {
    onFilter({
      dateRange,
      categories: selectedCategories,
      types: selectedTypes,
      paymentMethods: selectedPaymentMethods
    });
  };

  const renderCategoryIcon = (category: Category) => {
    if (!category?.icon) return null;
    
    try {
      return (
        <BadgeIcon 
          icon={<span className="icon-container" dangerouslySetInnerHTML={{ __html: category.icon }} />}
          bgColor={`bg-${category.color}-100 dark:bg-${category.color}-900/30`}
          textColor={`text-${category.color}-500 dark:text-${category.color}-400`}
          className="mr-2 h-6 w-6"
        />
      );
    } catch (error) {
      console.error("Error rendering category icon:", error);
      return null;
    }
  };

  // This is a simplified version - using our TransactionsFilter component would be better
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex items-center"
          >
            {renderCategoryIcon(category)}
            <span className="text-sm">{category.name}</span>
          </div>
        ))}
      </div>
      <Button 
        onClick={handleFilter}
        className="bg-primary text-white px-4 py-2 rounded-md"
      >
        Aplicar Filtros
      </Button>
    </div>
  );
}
