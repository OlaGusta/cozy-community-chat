
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from '@/components/UserItem';
import { formatTimestamp } from '@/utils/messageUtils';

interface LastMessage {
  text: string;
  timestamp: Date;
}

export interface UserWithLastMessage extends User {
  lastMessage?: LastMessage;
}

interface MessageListItemProps {
  user: UserWithLastMessage;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-2 py-3 h-auto animate-in"
      onClick={() => navigate(`/messages/${user.id}`)}
    >
      <div className="flex items-start gap-3 w-full">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className={user.isOnline ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">{user.name}</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {user.lastMessage && formatTimestamp(user.lastMessage.timestamp)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {user.lastMessage?.text || "Ingen konversation ännu"}
          </p>
        </div>
        
        {user.isOnline && (
          <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mt-2"></div>
        )}
      </div>
    </Button>
  );
};

export default MessageListItem;
