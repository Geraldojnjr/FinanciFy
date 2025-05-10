
import React from 'react';
import { formatCurrency } from '@/utils/format';
import { Transaction } from '@/types/finance';
import { format } from 'date-fns';
import { 
  Edit, 
  Trash2, 
  Home, 
  ShoppingCart, 
  Car, 
  Utensils, 
  HeartPulse, 
  Book, 
  Gamepad2, 
  Shirt, 
  Smartphone, 
  Gift, 
  Building2, 
  Wallet, 
  DollarSign, 
  Coins, 
  PiggyBank, 
  LineChart, 
  BarChart, 
  Building, 
  Files, 
  Music, 
  Film, 
  Coffee, 
  Pizza, 
  Trophy, 
  Scissors, 
  Laptop, 
  GraduationCap, 
  Tv, 
  Plane, 
  Beer, 
  Baby,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useFinance } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { CategoryBadge } from '@/components/ui/category-badge';
import { BadgeIcon } from '@/components/ui/badge-icon';

// Mapeamento de ícones do banco de dados para componentes Lucide
const iconMapping: { [key: string]: React.ElementType } = {
  'home': Home,
  'cart': ShoppingCart,
  'car': Car,
  'food': Utensils,
  'health': HeartPulse,
  'book': Book,
  'game': Gamepad2,
  'shirt': Shirt,
  'mobile': Smartphone,
  'gift': Gift,
  'bank': Building2,
  'wallet': Wallet,
  'dollar': DollarSign,
  'money': Coins,
  'money-bag': PiggyBank,
  'chart-bar': BarChart,
  'chart-line': LineChart,
  'chart-pie': PieChart,
  'chart-up': TrendingUp,
  'building': Building,
  'files': Files,
  'music': Music,
  'film': Film,
  'coffee': Coffee,
  'pizza': Pizza,
  'basketball': Trophy,
  'scissors': Scissors,
  'laptop': Laptop,
  'graduation': GraduationCap,
  'tv': Tv,
  'plane': Plane,
  'beer': Beer,
  'baby': Baby,
  'coin': Coins,
};

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (transaction: Transaction) => void;
  isMobile?: boolean;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
  onTogglePaid,
  isMobile = false
}: TransactionCardProps) {
  const { getCategoryById } = useFinance();
  const category = getCategoryById(transaction.category_id);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  // Parse the icon string into a React element if it exists
  const renderCategoryIcon = () => {
    if (!category?.icon) return null;
    
    try {
      // Get the icon component from the mapping
      const IconComponent = iconMapping[category.icon] || Home;
      
      // Using BadgeIcon component to display the icon with the category's color
      return (
        <BadgeIcon 
          icon={<IconComponent size={isMobile ? 16 : 20} />}
          bgColor={`bg-${category.color}-100 dark:bg-${category.color}-900/30`}
          textColor={`text-${category.color}-500 dark:text-${category.color}-400`}
          className={`${isMobile ? 'h-6 w-6 mr-1' : 'h-8 w-8 mr-2'}`}
        />
      );
    } catch (error) {
      console.error("Error rendering category icon:", error);
      return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className={`p-${isMobile ? '3' : '4'}`}>
        {isMobile ? (
          // Mobile layout
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                {renderCategoryIcon()}
                <div className="flex flex-col">
                  <h3 className="font-medium text-sm">
                    {transaction.description}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
              
              <span className={`font-medium text-sm ${getTypeColor(transaction.type)}`}>
                {transaction.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CategoryBadge category={category} />
              
              <span className={`text-xs px-2 py-1 rounded-full ${
                transaction.paid 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {transaction.paid ? 'Pago' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t">
              <Switch 
                checked={transaction.paid}
                onCheckedChange={() => onTogglePaid(transaction)} 
                aria-label="Toggle paid status"
                className="mr-1"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                title="Editar"
                className="h-8 w-8 p-0"
              >
                <Edit size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.id)}
                title="Excluir"
                className="h-8 w-8 p-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ) : (
          // Desktop layout - improved with consistent alignment
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {renderCategoryIcon()}
                <div className="flex flex-col">
                  <h3 className="font-medium">
                    {transaction.description}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-0 sm:ml-10">
                <CategoryBadge category={category} />
                
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.paid 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {transaction.paid ? 'Pago' : 'Pendente'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className={`font-medium ${getTypeColor(transaction.type)} mr-6 w-28 text-right`}>
                {transaction.type === 'expense' ? '- ' : '+ '}
                {formatCurrency(transaction.amount)}
              </span>
              
              <div className="flex items-center gap-1 min-w-[110px]">
                <Switch 
                  checked={transaction.paid}
                  onCheckedChange={() => onTogglePaid(transaction)} 
                  aria-label="Toggle paid status"
                  className="mr-2"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  title="Editar"
                >
                  <Edit size={18} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
