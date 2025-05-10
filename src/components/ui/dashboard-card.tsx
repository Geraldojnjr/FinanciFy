
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  gradient?: boolean;
  glassmorphism?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon,
  footer,
  gradient = false,
  glassmorphism = false,
  className,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        gradient && "bg-gradient-card-light dark:bg-gradient-card text-foreground",
        glassmorphism && "glass-card",
        !gradient && !glassmorphism && "bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div>{children}</div>
      </div>
      {footer && <div className="p-4 bg-muted/30 border-t">{footer}</div>}
    </div>
  );
}
