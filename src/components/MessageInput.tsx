
import React, { useState, KeyboardEvent } from 'react';
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus, Paperclip, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Skriv ett meddelande...",
  className,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  
  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col p-3 border-t bg-background",
      className
    )}>
      <div className="flex items-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="rounded-full flex-shrink-0"
          disabled={disabled}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add attachment</span>
        </Button>
        
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] resize-none pr-12 py-3"
            rows={1}
          />
          
          <div className="absolute bottom-1 right-1">
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || disabled}
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
