
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { MessageSquare, Users, Lock } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface Chat {
  id: string;
  title: string;
  description?: string;
  type: 'group' | 'topic';
  unreadCount?: number;
  lastMessage?: {
    text: string;
    time: string;
    sender: string;
  };
  isPrivate?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  activeId?: string;
  className?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeId, className }) => {
  const navigate = useNavigate();

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-1 p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer",
              chat.id === activeId 
                ? "bg-primary/10 hover:bg-primary/15" 
                : "hover:bg-muted"
            )}
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
              chat.id === activeId ? "bg-primary/20" : "bg-muted"
            )}>
              {chat.type === 'group' ? (
                <Users className={cn(
                  "h-5 w-5",
                  chat.id === activeId ? "text-primary" : "text-muted-foreground"
                )} />
              ) : (
                <MessageSquare className={cn(
                  "h-5 w-5",
                  chat.id === activeId ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <span className="font-medium truncate">{chat.title}</span>
                  {chat.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>
                
                {chat.unreadCount ? (
                  <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center">
                    {chat.unreadCount}
                  </Badge>
                ) : (
                  chat.lastMessage && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {chat.lastMessage.time}
                    </span>
                  )
                )}
              </div>
              
              {(chat.description || chat.lastMessage) && (
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage ? (
                    <>
                      <span className="font-medium">{chat.lastMessage.sender}: </span>
                      {chat.lastMessage.text}
                    </>
                  ) : chat.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatList;
