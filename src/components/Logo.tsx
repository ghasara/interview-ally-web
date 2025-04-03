
import { cn } from "@/lib/utils";
import { AppLogo } from "./AppLogo";

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export function Logo({ className, textClassName, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AppLogo size={32} />
      
      {showText && (
        <span className={cn("font-bold text-lg", textClassName)}>
          interviewally
        </span>
      )}
    </div>
  );
}
