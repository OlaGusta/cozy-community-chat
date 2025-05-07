
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { handleInviteUser } from '@/utils/userManagement';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/components/UserItem';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ isOpen, onClose, onUserAdded }) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data using form elements
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const apartmentInput = form.elements.namedItem('apartment') as HTMLInputElement;
    const adminInput = form.elements.namedItem('admin') as HTMLInputElement;
    
    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      apartment: apartmentInput.value,
      isAdmin: adminInput.checked
    };
    
    const result = await handleInviteUser(formData);
    
    if (result.success && result.userId) {
      const newUser: User = {
        id: result.userId,
        name: formData.name,
        email: formData.email,
        apartment: formData.apartment,
        isAdmin: formData.isAdmin,
        isOnline: false,
        lastSeen: 'Just nu'
      };
      
      onUserAdded(newUser);
      
      toast({
        title: "Användare tillagd",
        description: `${newUser.name} har lagts till som medlem.`,
      });
      
      // Reset form and close dialog
      form.reset();
      onClose();
    } else {
      toast({
        title: "Fel vid tillägg av användare",
        description: result.message || "Kunde inte lägga till användaren.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Lägg till ny medlem</DialogTitle>
            <DialogDescription>
              Skicka en inbjudan till en ny medlem att ansluta sig till BRF Humlan4.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input id="name" name="name" placeholder="Förnamn Efternamn" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                placeholder="namn@exempel.se" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apartment">Lägenhetsnummer</Label>
              <Input id="apartment" name="apartment" placeholder="t.ex. 1201" required />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="admin" name="admin" />
              <Label htmlFor="admin">Ge administratörsrättigheter</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Skicka inbjudan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
