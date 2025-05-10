import React from 'react';
import { BackButton } from "@/components/ui/back-button";
import { IconButton } from "@/components/ui/icon-button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  actions?: {
    icon: LucideIcon;
    label: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    onClick: () => void;
  }[];
  children?: React.ReactNode;
}

export function PageHeader({ title, onBack, actions, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex items-center mb-4 sm:mb-0">
        {onBack && <BackButton onClick={onBack} className="mr-2" />}
        <h2 className="text-2xl font-bold">{title}</h2>
        {children}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex space-x-2">
          {actions.map((action, index) => (
            <IconButton
              key={index}
              icon={action.icon}
              label={action.label}
              variant={action.variant}
              size={action.size}
              onClick={action.onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
} 