
import React, { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chat } from '@/components/ChatList';

interface CreateChatRoomDialogProps {
  onChatCreated: (newChat: Chat) => void;
  children?: ReactNode;
}

const CreateChatRoomDialog: React.FC<CreateChatRoomDialogProps> = ({ onChatCreated, children }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatDescription, setNewChatDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [newChatType, setNewChatType] = useState<'group' | 'topic'>('topic');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChatTitle.trim()) {
      toast({
        title: 'Fyll i namn',
        description: 'Du måste ange ett namn för chattrummet.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Inte inloggad',
          description: 'Du måste vara inloggad för att skapa chattrum.',
          variant: 'destructive',
          duration: 3000
        });
        setIsLoading(false);
        return;
      }

      // Create new chat room in the database
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: newChatTitle,
          description: newChatDescription || null,
          created_by: session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating chat room:", error);
        throw error;
      }

      // Add to local list
      if (newRoom) {
        const newChat: Chat = {
          id: newRoom.id,
          title: newRoom.name,
          description: newRoom.description || undefined,
          type: newChatType,
          isPrivate: isPrivate
        };

        onChatCreated(newChat);
        
        toast({
          title: "Chattrum skapat",
          description: `Chattrummet "${newChatTitle}" har skapats.`,
          duration: 3000
        });
        
        // Reset form
        setNewChatTitle('');
        setNewChatDescription('');
        setIsPrivate(false);
        setNewChatType('topic');
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating chat room:', error.message);
      toast({
        title: 'Ett fel uppstod',
        description: error.message || 'Något gick fel. Försök igen senare.',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      setNewChatTitle('');
      setNewChatDescription('');
      setIsPrivate(false);
      setNewChatType('topic');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nytt chattrum
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleCreateChat}>
          <DialogHeader>
            <DialogTitle>Skapa nytt chattrum</DialogTitle>
            <DialogDescription>
              Skapa ett nytt ämne eller chattrum för medlemmarna att diskutera i.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Namn på chattrum</Label>
              <Input 
                id="title" 
                placeholder="t.ex. Renovering" 
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea 
                id="description" 
                placeholder="Beskrivning av chattrummet..." 
                rows={3}
                value={newChatDescription}
                onChange={(e) => setNewChatDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Typ av chattrum</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="typeTopic"
                    name="chatType"
                    checked={newChatType === 'topic'}
                    onChange={() => setNewChatType('topic')}
                  />
                  <Label htmlFor="typeTopic">Ämne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="typeGroup"
                    name="chatType"
                    checked={newChatType === 'group'}
                    onChange={() => setNewChatType('group')}
                  />
                  <Label htmlFor="typeGroup">Grupp</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="private" 
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="private">Privat chattrum (endast inbjudna)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Avbryt</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Skapar...' : 'Skapa chattrum'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatRoomDialog;
