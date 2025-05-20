import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

interface ChatControlsProps {
  onSendImage?: (imageFile: File) => void;
  onSendFile?: (fileUrl: string, fileName: string) => void;
}

const ChatControls: React.FC<ChatControlsProps> = ({ onSendImage, onSendFile }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Maximal filstorlek är 5 MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Handle image files
      if (file.type.startsWith('image/')) {
        // Here we would normally upload to storage
        // For now, just create a local URL and pass it to the parent component
        const imageUrl = URL.createObjectURL(file);
        if (onSendImage) {
          onSendImage(file);
          toast({
            title: "Bild uppladdad",
            description: "Bilden lades till i konversationen.",
          });
        }
      } 
      // Handle other files
      else {
        // Here we would normally upload to storage
        // For now, just notify the user
        if (onSendFile) {
          const fileUrl = URL.createObjectURL(file);
          onSendFile(fileUrl, file.name);
          toast({
            title: "Fil uppladdad",
            description: `${file.name} lades till i konversationen.`,
          });
        }
      }
      
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Fel vid uppladdning",
        description: "Kunde inte ladda upp filen. Försök igen senare.",
        variant: "destructive"
      });
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Lägg till</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" side="top" align="start">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Lägg till innehåll</h4>
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span>Ladda upp bild</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span>Ladda upp fil</span>
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatControls;
