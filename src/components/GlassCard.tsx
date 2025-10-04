import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-card/50 border border-white/10 rounded-2xl p-6 shadow-glow",
        "transition-all duration-300 hover:shadow-xl hover:border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
};
