
import React, { useState, KeyboardEvent, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus, Paperclip, Image, FileImage } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendImage?: (imageFile: File) => void;
  onSendFile?: (file: File) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendImage,
  onSendFile,
  placeholder = "Skriv ett meddelande...",
  className,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Filen är för stor",
        description: "Maximal filstorlek är 5 MB.",
        variant: "destructive"
      });
      return;
    }

    if (file.type.startsWith('image/')) {
      if (onSendImage) {
        onSendImage(file);
      } else {
        // Fallback if no handler provided
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          onSendMessage(`[Bild: ${file.name}](${imageUrl})`);
        };
        reader.readAsDataURL(file);
      }
      
      toast({
        title: "Bild uppladdad",
        description: "Bilden lades till i konversationen."
      });
    }
    
    setIsPopoverOpen(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Filen är för stor",
        description: "Maximal filstorlek är 5 MB.",
        variant: "destructive"
      });
      return;
    }

    if (onSendFile) {
      onSendFile(file);
    } else {
      // Fallback if no handler provided
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        onSendMessage(`[Dokument: ${file.name}](${url})`);
      };
      reader.readAsDataURL(file);
    }
    
    toast({
      title: "Fil uppladdad",
      description: `${file.name} lades till i konversationen.`
    });
    
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn(
      "flex flex-col p-3 border-t bg-background",
      className
    )}>
      <div className="flex items-end gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              type="button"
              className="rounded-full flex-shrink-0"
              disabled={disabled}
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Lägg till bilaga</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="top">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => imageInputRef.current?.click()}
              >
                <FileImage className="mr-2 h-4 w-4" /> Bilder
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="mr-2 h-4 w-4" /> Dokument
              </Button>
            </div>
            
            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </PopoverContent>
        </Popover>
        
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
              <span className="sr-only">Skicka meddelande</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
