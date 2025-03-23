
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Shield, UserPlus, X, Check, MoreVertical, UserX } from 'lucide-react';
import UserItem, { User } from '@/components/UserItem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// Sample data for demonstration
const users: User[] = [
  {
    id: '1',
    name: 'Anna Lindberg',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu',
  },
  {
    id: '2',
    name: 'Erik Holm',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu',
  },
  {
    id: '3',
    name: 'Sofia Chen',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 40 min sedan',
  },
  {
    id: '4',
    name: 'Johan Bergman',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 2 tim sedan',
  },
  {
    id: '5',
    name: 'Maria Andersson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 1 dag sedan',
  },
  {
    id: '6',
    name: 'Karl Svensson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 2 dagar sedan',
  },
  {
    id: '7',
    name: 'Åsa Nilsson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 5 dagar sedan',
  },
];

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inbjudan skickad",
      description: "En inbjudan har skickats till den angivna e-postadressen.",
    });
  };
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <Shield className="h-6 w-6" /> Admin Panel
          </h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Lägg till medlem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleInviteUser}>
                <DialogHeader>
                  <DialogTitle>Lägg till ny medlem</DialogTitle>
                  <DialogDescription>
                    Skicka en inbjudan till en ny medlem att ansluta sig till BRF Humlan4.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Namn</Label>
                    <Input id="name" placeholder="Förnamn Efternamn" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="namn@exempel.se" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Lägenhetsnummer</Label>
                    <Input id="apartment" placeholder="t.ex. 1201" required />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="admin" />
                    <Label htmlFor="admin">Ge administratörsrättigheter</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Skicka inbjudan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-6 animate-in">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Hantera medlemmar</h2>
            <p className="text-muted-foreground mb-4">
              Som administratör kan du lägga till nya medlemmar, hantera deras rättigheter och ta bort medlemmar från föreningen vid behov.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-muted rounded-lg">
                <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Lägg till medlemmar</h3>
                  <p className="text-sm text-muted-foreground">
                    Bjud in nya boende i föreningen
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted rounded-lg">
                <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Hantera rättigheter</h3>
                  <p className="text-sm text-muted-foreground">
                    Ändra medlemmars behörigheter
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6 flex items-center justify-between animate-in">
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
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Ge admin-behörighet
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserX className="mr-2 h-4 w-4" />
                    Ta bort medlemmar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100vh-20rem)] animate-in">
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
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      Redigera uppgifter
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
                    <DropdownMenuItem className="text-destructive">
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
      </main>
    </div>
  );
};

export default AdminPanel;
