
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  withText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-brand flex items-center justify-center text-white font-bold",
        sizeClasses[size],
        size === 'sm' ? 'w-8' : size === 'md' ? 'w-10' : 'w-12'
      )}>
        <span className="animate-in text-lg">H4</span>
      </div>
      
      {withText && (
        <span className={cn(
          "font-medium animate-in",
          size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
        )}>
          BRF Humlan4
        </span>
      )}
    </div>
  );
};

export default Logo;
