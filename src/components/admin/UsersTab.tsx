import React, { useState } from 'react';
import { Search, MoreVertical, Edit, Shield, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserItem, { User } from '@/components/UserItem';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { handleToggleAdmin, handleDeleteUser } from '@/utils/userManagement';

interface UsersTabProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onEditUser: (user: User) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, setUsers, onEditUser }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const clearSelection = () => {
    setSelectedUsers([]);
  };
  
  const handleToggleAdminStatus = async (userId: string, makeAdmin: boolean) => {
    const success = await handleToggleAdmin(userId, makeAdmin);
    if (success) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: makeAdmin } : user
      ));
      
      const affectedUser = users.find(user => user.id === userId);
      if (affectedUser) {
        toast({
          title: makeAdmin ? "Admin-rättigheter tilldelad" : "Admin-rättigheter borttagen",
          description: `${affectedUser.name} är ${makeAdmin ? 'nu' : 'inte längre'} en administratör.`,
        });
      }
    } else {
      toast({
        title: "Fel vid ändring av admin-status",
        description: "Kunde inte ändra användarens admin-status.",
        variant: "destructive"
      });
    }
  };
  
  const handleUserDelete = async (userId: string) => {
    if (confirm("Är du säker på att du vill ta bort denna medlem?")) {
      const success = await handleDeleteUser(userId);
      if (success) {
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Användare borttagen",
          description: "Användaren har tagits bort från föreningen.",
        });
      } else {
        toast({
          title: "Fel vid borttagning av användare",
          description: "Kunde inte ta bort användaren.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleBulkToggleAdmin = (makeAdmin: boolean) => {
    selectedUsers.forEach(id => handleToggleAdminStatus(id, makeAdmin));
    clearSelection();
  };
  
  const handleBulkDelete = () => {
    if (confirm(`Är du säker på att du vill ta bort ${selectedUsers.length} medlemmar?`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      clearSelection();
      toast({
        title: "Medlemmar borttagna",
        description: `${selectedUsers.length} medlemmar har tagits bort.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök medlemmar..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="flex items-center ml-4">
            <span className="text-sm text-muted-foreground mr-2">
              {selectedUsers.length} valda
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  Åtgärder
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hantera valda</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkToggleAdmin(true)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Ge admin-behörighet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkDelete}>
                  <UserX className="mr-2 h-4 w-4" />
                  Ta bort medlemmar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-24rem)]">
        <div className="space-y-1 pr-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center">
              <Checkbox
                id={`select-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => toggleUserSelection(user.id)}
                className="mr-2"
              />
              
              <div className="flex-1">
                <UserItem 
                  user={user} 
                  className="flex-1"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Hantera medlem</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Redigera uppgifter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => 
                    handleToggleAdminStatus(user.id, !user.isAdmin)
                  }>
                    {user.isAdmin ? (
                      <>
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        Ta bort admin
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Gör till admin
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleUserDelete(user.id)}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Ta bort medlem
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Inga medlemmar hittades</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `Inga medlemmar matchade söktermen "${searchTerm}"`
                  : "Det finns inga medlemmar att visa ännu."}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersTab;
