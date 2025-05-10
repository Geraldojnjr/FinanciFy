import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabButtonProps {
  value: string;
  icon: ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TabButton({
  value,
  icon,
  label,
  count,
  isActive,
  onClick,
  className
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 w-full text-left border-l-4 transition-colors",
        isActive 
          ? "border-l-primary bg-blue-50 dark:bg-blue-900/20 text-primary font-medium" 
          : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30",
        className
      )}
    >
      <span className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </span>
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn(
          "ml-auto px-2 py-0.5 rounded-full text-xs",
          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {count}
        </span>
      )}
    </button>
  );
} 