import React from 'react';
import { CalendarIcon } from "lucide-react";
import { formatDate } from '@/utils/format';

interface DateDisplayProps {
  date: Date | string;
  label?: string;
}

export function DateDisplay({ date, label }: DateDisplayProps) {
  return (
    <div>
      {label && <p className="text-muted-foreground text-sm mb-1">{label}</p>}
      <p className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2" />
        {formatDate(date)}
      </p>
    </div>
  );
} 