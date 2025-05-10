
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Category, FilterOptions, TransactionType, PaymentMethod } from '@/types/finance';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionsFilterProps {
  categories: Category[];
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function TransactionsFilter({
  categories,
  filterOptions,
  onFilterChange,
}: TransactionsFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filterOptions.startDate,
    to: filterOptions.endDate,
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange({
      ...filterOptions,
      startDate: range?.from,
      endDate: range?.to,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filterOptions,
      categoryId: categoryId === 'all' ? undefined : categoryId,
    });
  };

  const handleTypeChange = (type: string) => {
    onFilterChange({
      ...filterOptions,
      type: type === 'all' ? undefined : type as TransactionType,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filterOptions,
      searchTerm: e.target.value || undefined,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar transações..."
            className="pl-9"
            value={filterOptions.searchTerm || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-1">
              <CalendarIcon size={16} />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'P', { locale: ptBR })} -{' '}
                    {format(dateRange.to, 'P', { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, 'P', { locale: ptBR })
                )
              ) : (
                'Período'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          className={showFilters ? 'bg-primary/10' : ''}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon size={16} className="mr-2" />
          Filtros
        </Button>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-md">
          <div>
            <label className="text-sm font-medium block mb-1">Categoria</label>
            <Select
              value={filterOptions.categoryId || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Tipo</label>
            <Select
              value={filterOptions.type || 'all'}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
