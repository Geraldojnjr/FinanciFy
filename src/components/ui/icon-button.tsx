import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  label: string;
}

export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
} 