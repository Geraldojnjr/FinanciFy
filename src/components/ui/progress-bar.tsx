
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = false,
  color = "var(--primary)",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const formattedPercentage = `${Math.round(percentage)}%`;

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="font-medium">{formattedPercentage}</span>}
        </div>
      )}
      <div
        className={cn(
          "h-2 w-full rounded-full bg-muted overflow-hidden relative",
          className
        )}
      >
        <div 
          className="h-full rounded-full absolute left-0 top-0 transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
