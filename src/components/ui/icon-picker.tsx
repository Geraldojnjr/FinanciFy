import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ShoppingCart,
  Home,
  Car,
  Heart,
  Book,
  Gamepad2,
  Shirt,
  Smartphone,
  DollarSign,
  Laptop,
  TrendingUp,
  Gift,
  Utensils,
  Bus,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  CreditCard,
  PiggyBank,
  Wallet,
  Banknote,
  Coins,
  LineChart,
  PieChart,
  Bitcoin,
  type LucideIcon
} from 'lucide-react';

interface IconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

const iconOptions: IconOption[] = [
  { value: 'cart', label: 'Carrinho', icon: ShoppingCart },
  { value: 'home', label: 'Casa', icon: Home },
  { value: 'car', label: 'Carro', icon: Car },
  { value: 'health', label: 'Saúde', icon: Heart },
  { value: 'book', label: 'Livro', icon: Book },
  { value: 'game', label: 'Jogo', icon: Gamepad2 },
  { value: 'shirt', label: 'Roupa', icon: Shirt },
  { value: 'mobile', label: 'Celular', icon: Smartphone },
  { value: 'dollar', label: 'Dólar', icon: DollarSign },
  { value: 'laptop', label: 'Notebook', icon: Laptop },
  { value: 'chart-up', label: 'Gráfico Subindo', icon: TrendingUp },
  { value: 'gift', label: 'Presente', icon: Gift },
  { value: 'food', label: 'Comida', icon: Utensils },
  { value: 'bus', label: 'Ônibus', icon: Bus },
  { value: 'stethoscope', label: 'Estetoscópio', icon: Stethoscope },
  { value: 'graduation', label: 'Graduação', icon: GraduationCap },
  { value: 'bag', label: 'Bolsa', icon: ShoppingBag },
  { value: 'credit-card', label: 'Cartão', icon: CreditCard },
  { value: 'piggy', label: 'Cofrinho', icon: PiggyBank },
  { value: 'wallet', label: 'Carteira', icon: Wallet },
  { value: 'banknote', label: 'Nota', icon: Banknote },
  { value: 'coins', label: 'Moedas', icon: Coins },
  { value: 'chart-line', label: 'Gráfico Linha', icon: LineChart },
  { value: 'chart-pie', label: 'Gráfico Pizza', icon: PieChart },
  { value: 'bitcoin', label: 'Bitcoin', icon: Bitcoin },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const selectedIcon = iconOptions.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedIcon && (
            <div className="flex items-center gap-2">
              <selectedIcon.icon className="h-4 w-4" />
              <span>{selectedIcon.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {iconOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 