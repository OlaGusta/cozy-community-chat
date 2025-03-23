
import React from 'react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  isAdmin?: boolean;
  lastSeen?: string;
}

interface UserItemProps {
  user: User;
  onClick?: () => void;
  showStatus?: boolean;
  compact?: boolean;
  className?: string;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onClick,
  showStatus = true,
  compact = false,
  className,
}) => {
  const { name, avatar, isOnline, isAdmin } = user;
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg transition-colors",
        onClick && "cursor-pointer hover:bg-muted",
        className
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {showStatus && isOnline !== undefined && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              isOnline ? "bg-green-500" : "bg-gray-300"
            )} 
          />
        )}
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{name}</span>
          {isAdmin && (
            <Badge variant="outline" className="text-xs py-0 h-5">
              Admin
            </Badge>
          )}
        </div>
        
        {!compact && user.lastSeen && (
          <span className="text-xs text-muted-foreground">
            {isOnline ? "Online" : `Senast sedd: ${user.lastSeen}`}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserItem;
