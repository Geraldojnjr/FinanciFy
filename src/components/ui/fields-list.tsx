import React from 'react';
import { FieldDisplay } from "@/components/ui/field-display";

interface FieldsListProps {
  fields: {
    label: string;
    value: React.ReactNode;
  }[];
  className?: string;
}

export function FieldsList({ fields, className }: FieldsListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {fields.map((field, index) => (
        <FieldDisplay
          key={index}
          label={field.label}
          value={field.value}
        />
      ))}
    </div>
  );
} 