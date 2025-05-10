import React from 'react';
import { DateDisplay } from "@/components/ui/date-display";

interface DatesGridProps {
  dates: {
    date: Date | string;
    label: string;
  }[];
  className?: string;
}

export function DatesGrid({ dates, className }: DatesGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {dates.map((date, index) => (
        <DateDisplay
          key={index}
          date={date.date}
          label={date.label}
        />
      ))}
    </div>
  );
} 