
import { cn } from "@/lib/utils";
import { BadgeIcon } from "@/components/ui/badge-icon";

interface DataCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  percentageChange?: number;
  icon?: React.ReactNode;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  footer?: React.ReactNode;
  className?: string;
}

export function DataCard({
  title,
  value,
  previousValue,
  percentageChange,
  icon,
  iconColor = "bg-primary",
  trend,
  footer,
  className,
}: DataCardProps) {
  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    return trend === "up" 
      ? "text-finance-income" 
      : trend === "down" 
        ? "text-finance-expense" 
        : "text-muted-foreground";
  };

  const getTrendText = () => {
    if (percentageChange === undefined || percentageChange === null) return null;
    
    const formattedPercentage = `${Math.abs(percentageChange).toFixed(1)}%`;
    const trendText = trend === "up" ? "+" : trend === "down" ? "-" : "";
    
    return (
      <span className={`${getTrendColor()} text-sm ml-2`}>
        {trendText}{formattedPercentage}
      </span>
    );
  };

  return (
    <div className={cn("rounded-xl border p-4 bg-card", className)}>
      <div className="flex justify-between items-start">
        {icon && (
          <BadgeIcon icon={icon} bgColor={iconColor} className="p-2" />
        )}
        <div className="flex-1 ml-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {getTrendText()}
          </div>
          {previousValue !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Anterior: {previousValue}
            </p>
          )}
        </div>
      </div>
      {footer && <div className="mt-4 pt-3 border-t text-sm">{footer}</div>}
    </div>
  );
}
