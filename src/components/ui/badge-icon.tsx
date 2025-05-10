import { cn } from "@/lib/utils";

interface BadgeIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

export function BadgeIcon({ 
  icon, 
  bgColor = "bg-primary", 
  textColor = "text-primary-foreground",
  className,
  ...props
}: BadgeIconProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center rounded-full p-1.5",
        bgColor,
        textColor,
        className
      )}
      {...props}
    >
      {icon}
    </span>
  );
}
