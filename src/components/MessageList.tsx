
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Download } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date | string; // Allow string or Date
  isMe?: boolean;
  replyTo?: {
    id: string;
    text: string;
    sender: {
      id: string;
      name: string;
    };
  };
}

interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Helper function to ensure we're working with Date objects
  const getDateObject = (timestamp: Date | string): Date => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return parseISO(timestamp);
  };

  const formatMessageDate = (timestamp: Date | string) => {
    const date = getDateObject(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, 'HH:mm');
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Igår ${format(date, 'HH:mm')}`;
    }
    
    return format(date, 'PP', { locale: sv });
  };

  // Group messages by date
  const groupedMessages: {[key: string]: Message[]} = {};
  
  messages.forEach(message => {
    const dateObj = getDateObject(message.timestamp);
    const date = dateObj.toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <ScrollArea 
      ref={scrollRef}
      className={cn("h-full py-4", className)}
    >
      <div className="space-y-6 px-4">
        {sortedDates.map(date => {
          const dateMessages = groupedMessages[date];
          return (
            <div key={date} className="space-y-4">
              <div className="sticky top-0 z-10 flex justify-center">
                <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {format(new Date(date), 'PP', { locale: sv })}
                </div>
              </div>
              
              {dateMessages.map((message, index) => {
                const isConsecutive = index > 0 && 
                  dateMessages[index - 1].sender.id === message.sender.id;
                
                return (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.isMe ? "justify-end" : "justify-start",
                      isConsecutive ? "mt-1" : "mt-4"
                    )}
                  >
                    {!message.isMe && !isConsecutive && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {message.sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    {!message.isMe && isConsecutive && (
                      <div className="w-8" /> // spacer
                    )}
                    
                    <div 
                      className={cn(
                        "flex flex-col max-w-[75%]",
                        message.isMe ? "items-end" : "items-start"
                      )}
                    >
                      {!isConsecutive && (
                        <div className={cn(
                          "flex items-center gap-2 mb-1",
                          message.isMe ? "justify-end" : "justify-start"
                        )}>
                          <span className="text-sm font-medium">
                            {message.isMe ? "Du" : message.sender.name}
                          </span>
                        </div>
                      )}
                      
                      {message.replyTo && (
                        <div className={cn(
                          "px-3 py-2 rounded-lg mb-1 text-xs border-l-2 border-primary/50",
                          message.isMe ? "bg-primary/10 text-right" : "bg-muted/70"
                        )}>
                          <div className="font-medium mb-1">{message.replyTo.sender.name}:</div>
                          <p className="line-clamp-2">{message.replyTo.text}</p>
                        </div>
                      )}
                      
                      {(() => {
                        const imgMatch = message.text.match(/^\[Bild: ([^\]]+)\]\((.+)\)$/);
                        const docMatch = message.text.match(/^\[Dokument: ([^\]]+)\]\((.+)\)$/);
                        const isImage = !!imgMatch;
                        const containerClasses = cn(
                          "px-4 py-2 rounded-lg",
                          message.isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none",
                          isImage && "p-0 bg-transparent text-inherit"
                        );
                        if (imgMatch) {
                          const [, alt, url] = imgMatch;
                          return (
                            <div className={containerClasses}>
                              <img src={url} alt={alt} className="max-w-xs rounded-lg" />
                            </div>
                          );
                        }
                        if (docMatch) {
                          const [, name, url] = docMatch;
                          return (
                            <div className={containerClasses}>
                              <a href={url} download className="text-primary underline flex items-center gap-1">
                                <Download className="w-4 h-4" /> {name}
                              </a>
                            </div>
                          );
                        }
                        return (
                          <div className={containerClasses}>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                          </div>
                        );
                      })()}
                      
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatMessageDate(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
