import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PageCard({ children, className }: PageCardProps) {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
} 