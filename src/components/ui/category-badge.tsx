import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/finance";
import { 
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

interface CategoryBadgeProps {
  category: Category | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  if (!category) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const IconComponent = category?.icon ? iconMapping[category.icon] || Home : Home;

  return (
    <Badge 
      variant="custom" 
      color={category.color} 
      className={`${sizeClasses[size]} ${className || ''} flex items-center gap-1`}
    >
      <IconComponent size={iconSize[size]} />
      {category.name}
    </Badge>
  );
}
