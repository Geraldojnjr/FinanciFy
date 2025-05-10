import React from 'react';

interface DetailsContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailsContent({ children, className }: DetailsContentProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
} 