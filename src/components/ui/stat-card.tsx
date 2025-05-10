import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={`bg-card/50 ${className}`}>
      <CardContent className="p-4 flex flex-col items-center justify-center h-28">
        {Icon && <Icon className="h-6 w-6 mb-2 text-muted-foreground" />}
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
} 