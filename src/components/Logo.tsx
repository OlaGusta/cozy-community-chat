
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  withText = true,
  iconOnly = false
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative overflow-hidden flex items-center justify-center",
        sizeClasses[size],
        iconOnly ? (size === 'sm' ? 'w-8' : size === 'md' ? 'w-10' : 'w-12') : 'w-auto'
      )}>
        <img 
          src="/lovable-uploads/44438dc8-11da-4c0a-8818-0bbe8113c06b.png" 
          alt="Humlan4 Logo" 
          className={cn(
            "object-contain",
            size === 'sm' ? 'h-8' : size === 'md' ? 'h-10' : 'h-12'
          )} 
        />
      </div>
      
      {withText && !iconOnly && (
        <div className="flex flex-col">
          <span className={cn(
            "font-medium animate-in",
            size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
          )}>
            humlan4
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Bostadsrättsföreningen
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
