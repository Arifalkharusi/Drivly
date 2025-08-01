import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "card";
}

const GradientCard = ({
  children,
  className,
  variant = "card",
}: GradientCardProps) => {
  const variantClasses = {
    primary: "bg-gradient-primary text-primary-foreground",
    secondary: "bg-gradient-card text-card-foreground",
    card: "bg-gradient-card text-card-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card touch-manipulation",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default GradientCard;
