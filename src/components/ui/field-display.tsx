import React from 'react';

interface FieldDisplayProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function FieldDisplay({ label, value, className }: FieldDisplayProps) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
} 