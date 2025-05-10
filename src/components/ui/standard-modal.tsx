import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StandardModalProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StandardModal({
  title,
  description,
  children,
  className,
  contentClassName,
  open,
  onOpenChange,
}: StandardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[600px] max-h-[85vh] rounded-xl border-2 shadow-lg bg-gradient-to-br from-card to-background/80 backdrop-blur-sm",
          className
        )}
      >
        {(title || description) && (
          <DialogHeader className="pb-4">
            {title && <DialogTitle className="text-xl">{title}</DialogTitle>}
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        
        <div className={cn(
          "custom-scrollbar overflow-y-auto pr-1 max-h-[70vh]", 
          contentClassName
        )}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
