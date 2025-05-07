
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const NewChatButton: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const descriptionInput = form.elements.namedItem('description') as HTMLTextAreaElement;
    
    try {
      const userId = localStorage.getItem('userId');
      
      // Create new chat room
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: nameInput.value,
          description: descriptionInput.value,
          created_by: userId
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Chattrum skapat',
        description: `${nameInput.value} har skapats.`
      });
      
      // Navigate to the new chat room
      if (data && data[0]) {
        navigate(`/chat/${data[0].id}`);
      }
      
      // Reset form
      form.reset();
    } catch (error: any) {
      console.error('Error creating chat room:', error);
      toast({
        title: 'Ett fel uppstod',
        description: 'Kunde inte skapa chattrummet.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Ny chatt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleCreateChat}>
          <DialogHeader>
            <DialogTitle>Skapa nytt chattrum</DialogTitle>
            <DialogDescription>
              Skapa en ny gruppchat för diskussioner med andra medlemmar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="t.ex. Trädgårdsgruppen" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Beskriv vad chatten handlar om..." 
                rows={3} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Skapa chattrum</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatButton;
