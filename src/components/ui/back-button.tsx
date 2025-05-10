import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className={className}>
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
} 