
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User } from '@/components/UserItem';

interface EditUserFormProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, isOpen, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedUser(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
    toast({
      title: "Användare uppdaterad",
      description: `${editedUser.name} har uppdaterats.`,
    });
    onClose();
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Redigera användare</DialogTitle>
          <DialogDescription>
            Ändra användarinformation för att matcha verkligheten.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input 
                id="name" 
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                placeholder="Förnamn Efternamn" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apartment">Lägenhetsnummer</Label>
              <Input 
                id="apartment" 
                name="apartment"
                value={editedUser.apartment || ""}
                onChange={handleChange}
                placeholder="t.ex. 1201" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isAdmin" 
                checked={!!editedUser.isAdmin}
                onCheckedChange={(checked) => handleSwitchChange("isAdmin", checked)}
              />
              <Label htmlFor="isAdmin">Administratörsrättigheter</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit">Spara ändringar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
