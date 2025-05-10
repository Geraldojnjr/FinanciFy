import React from 'react';
import { StatCard } from "@/components/ui/stat-card";
import { LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
}

interface StatsGridProps {
  stats: Stat[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  );
} 