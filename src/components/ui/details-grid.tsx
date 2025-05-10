import React from 'react';
import { InfoCard } from "@/components/ui/info-card";

interface DetailsGridProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailsGrid({ children, className }: DetailsGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
} 