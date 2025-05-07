import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Shield, 
  UserPlus, 
  X, 
  Check, 
  MoreVertical, 
  UserX, 
  MessageSquare,
  EyeIcon,
  Users,
  Edit,
  LogOut
} from 'lucide-react';
import UserItem, { User } from '@/components/UserItem';
import EditUserForm from '@/components/EditUserForm';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

// Sample data for demonstration - we'll update this to work with real data from Supabase
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Anna Lindberg',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu',
    apartment: '1101',
    email: 'anna.lindberg@example.com'
  },
  {
    id: '2',
    name: 'Erik Holm',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu',
    apartment: '1102',
    email: 'erik.holm@example.com'
  },
  {
    id: '3',
    name: 'Sofia Chen',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 40 min sedan',
    apartment: '1103',
    email: 'sofia.chen@example.com'
  },
  {
    id: '4',
    name: 'Johan Bergman',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 2 tim sedan',
    apartment: '1104',
    email: 'johan.bergman@example.com'
  },
  {
    id: '5',
    name: 'Maria Andersson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 1 dag sedan',
    apartment: '1105',
    email: 'maria.andersson@example.com'
  },
  {
    id: '6',
    name: 'Karl Svensson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 2 dagar sedan',
    apartment: '1106',
    email: 'karl.svensson@example.com'
  },
  {
    id: '7',
    name: 'Åsa Nilsson',
    isOnline: false,
    isAdmin: false,
    lastSeen: 'För 5 dagar sedan',
    apartment: '1107',
    email: 'asa.nilsson@example.com'
  },
];

// Keep existing chat data
const allChats = [
  {
    id: '1',
    title: 'Allmänt',
    type: 'group',
    members: 6,
    messageCount: 143,
    lastActivity: 'För 10 min sedan',
  },
  {
    id: '2',
    title: 'Trädgårdsgruppen',
    type: 'topic',
    members: 3,
    messageCount: 57,
    lastActivity: 'För 1 dag sedan',
  },
  {
    id: '3',
    title: 'Fest & Aktiviteter',
    type: 'topic',
    members: 3,
    messageCount: 22,
    lastActivity: 'För 2 dagar sedan',
  },
  {
    id: '4',
    title: 'Renovering',
    type: 'topic',
    members: 3,
    messageCount: 45,
    lastActivity: 'För 2 dagar sedan',
  },
  {
    id: '5',
    title: 'Teknik & Wifi',
    type: 'topic',
    members: 3,
    messageCount: 31,
    lastActivity: 'För 5 dagar sedan',
  },
];

// Keep existing direct messages data
const directMessages = [
  {
    id: 'dm1',
    users: [
      { id: '1', name: 'Anna Lindberg' },
      { id: '3', name: 'Sofia Chen' }
    ],
    messageCount: 37,
    lastActivity: 'För 2 timmar sedan',
  },
  {
    id: 'dm2',
    users: [
      { id: '2', name: 'Erik Holm' },
      { id: '4', name: 'Johan Bergman' }
    ],
    messageCount: 23,
    lastActivity: 'För 1 dag sedan',
  },
  {
    id: 'dm3',
    users: [
      { id: '1', name: 'Anna Lindberg' },
      { id: '5', name: 'Maria Andersson' }
    ],
    messageCount: 15,
    lastActivity: 'För 3 dagar sedan',
  }
];

// Keep existing recent messages data
const recentMessages = [
  {
    id: 'm1',
    chatId: '1',
    chatName: 'Allmänt',
    text: 'Har någon sett den nya informationen på anslagstavlan?',
    sender: { id: '3', name: 'Sofia Chen' },
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'group',
  },
  {
    id: 'm2',
    chatId: 'dm1',
    chatName: 'Sofia Chen & Anna Lindberg',
    text: 'Tack för hjälpen med att lösa problemet!',
    sender: { id: '3', name: 'Sofia Chen' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'direct',
  },
  {
    id: 'm3',
    chatId: '2',
    chatName: 'Trädgårdsgruppen',
    text: 'Vi behöver köpa nya verktyg till trädgården, vad tycker ni?',
    sender: { id: '1', name: 'Anna Lindberg' },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'group',
  },
  {
    id: 'm4',
    chatId: '4',
    chatName: 'Renovering',
    text: 'Jag har kontaktat entreprenören och fått ett nytt prisförslag.',
    sender: { id: '2', name: 'Erik Holm' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'group',
  },
];

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserEdit, setCurrentUserEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast({
        title: "Åtkomst nekad",
        description: "Du har inte behörighet att se denna sida.",
        variant: "destructive"
      });
      navigate('/dashboard');
    } else {
      loadUsers();
    }
  }, [navigate, toast]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (profiles) {
        const mappedUsers: User[] = profiles.map((profile: Profile) => ({
          id: profile.id,
          name: profile.name,
          isOnline: profile.is_online || false,
          isAdmin: profile.is_admin || false,
          lastSeen: profile.last_seen ? new Date(profile.last_seen).toLocaleString('sv-SE') : 'Aldrig',
          apartment: profile.apartment || '',
          email: profile.email || '',
        }));
        
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Fel vid inläsning av användare",
        description: "Kunde inte hämta användarlistan.",
        variant: "destructive"
      });
      // Fall back to sample data
      setUsers(initialUsers);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredChats = allChats.filter(chat => 
    chat.title.toLowerCase().includes(chatSearchTerm.toLowerCase())
  );
  
  const filteredDirectMessages = directMessages.filter(dm => 
    dm.users.some(user => user.name.toLowerCase().includes(chatSearchTerm.toLowerCase()))
  );
  
  const filteredMessages = recentMessages.filter(message => 
    message.text.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
    message.chatName.toLowerCase().includes(messageSearchTerm.toLowerCase())
  );
  
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Get form data using form elements
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const apartmentInput = form.elements.namedItem('apartment') as HTMLInputElement;
    const adminInput = form.elements.namedItem('admin') as HTMLInputElement;
    
    try {
      // Generate a UUID for the new user
      const newUserId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          name: nameInput.value,
          email: emailInput.value,
          apartment: apartmentInput.value,
          is_admin: adminInput.checked,
          is_online: false,
          last_seen: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newUser: User = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email || '',
          apartment: data[0].apartment || '',
          isAdmin: data[0].is_admin || false,
          isOnline: data[0].is_online || false,
          lastSeen: 'Just nu'
        };
        
        setUsers([...users, newUser]);
        
        toast({
          title: "Användare tillagd",
          description: `${newUser.name} har lagts till som medlem.`,
        });
        
        // Reset form
        form.reset();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Fel vid tillägg av användare",
        description: "Kunde inte lägga till användaren.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUserEdit(user);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: updatedUser.name,
          apartment: updatedUser.apartment,
          is_admin: updatedUser.isAdmin
        })
        .eq('id', updatedUser.id);
      
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      toast({
        title: "Användare uppdaterad",
        description: `${updatedUser.name} har uppdaterats.`,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Fel vid uppdatering av användare",
        description: "Kunde inte uppdatera användaren.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Är du säker på att du vill ta bort denna medlem?")) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Användare borttagen",
          description: "Användaren har tagits bort från föreningen.",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Fel vid borttagning av användare",
          description: "Kunde inte ta bort användaren.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: makeAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
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
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Fel vid ändring av admin-status",
        description: "Kunde inte ändra användarens admin-status.",
        variant: "destructive"
      });
    }
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
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `För ${diffMins} min sedan`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `För ${hours} tim sedan`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `För ${days} dag${days > 1 ? 'ar' : ''} sedan`;
    }
  };
  
  // Modified function to make Ola Gustafsson an admin - ensuring it creates and sets admin status
  const makeOlaAdmin = async () => {
    try {
      // Use a simpler approach - regardless if user exists or not, insert or update
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: 'ola-gustafsson-id', // Use a fixed ID to ensure we're working with the same record
          name: 'Ola Gustafsson',
          email: 'ola@olagustafsson.com',
          is_admin: true,
          is_online: false,
          apartment: '1001',
          last_seen: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();
        
      if (error) throw error;
      
      console.log("Ola Gustafsson set as admin:", data);
      toast({
        title: "Admin status",
        description: "Ola Gustafsson är nu en administratör.",
      });
      
      // Refresh the users list
      loadUsers();
    } catch (error) {
      console.error("Error making Ola admin:", error);
      toast({
        title: "Fel vid ändring av admin-status",
        description: "Kunde inte göra Ola Gustafsson till administratör.",
        variant: "destructive"
      });
    }
  };

  // Run the function once when component mounts to make Ola an admin
  useEffect(() => {
    makeOlaAdmin();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <Shield className="h-6 w-6" /> Admin Panel
          </h1>
          
          <div className="flex items-center gap-2">
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
            
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logga ut
            </Button>
          </div>
        </div>
        
        <Card className="mb-6 animate-in">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Hantera föreningen</h2>
            <p className="text-muted-foreground mb-4">
              Som administratör kan du hantera medlemmar, moderera konversationer och övervaka aktiviteter i föreningen.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-muted rounded-lg">
                <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Hantera medlemmar</h3>
                  <p className="text-sm text-muted-foreground">
                    Bjud in och hantera föreningens medlemmar
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted rounded-lg">
                <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Moderera konversationer</h3>
                  <p className="text-sm text-muted-foreground">
                    Övervaka och hantera chattkonversationer
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
        
        <Tabs 
          defaultValue="users" 
          className="mb-6 animate-in" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Medlemmar
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Konversationer
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4" /> Meddelanden
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
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
                      <DropdownMenuItem onClick={() => {
                        selectedUsers.forEach(id => handleToggleAdmin(id, true));
                        clearSelection();
                      }}>
                        <Shield className="mr-2 h-4 w-4" />
                        Ge admin-behörighet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        if (confirm(`Är du säker på att du vill ta bort ${selectedUsers.length} medlemmar?`)) {
                          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                          clearSelection();
                          toast({
                            title: "Medlemmar borttagna",
                            description: `${selectedUsers.length} medlemmar har tagits bort.`,
                          });
                        }
                      }}>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Redigera uppgifter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => 
                          handleToggleAdmin(user.id, !user.isAdmin)
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
                          onClick={() => handleDeleteUser(user.id)}
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
          </TabsContent>
          
          <TabsContent value="chats" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök konversationer..."
                className="pl-9"
                value={chatSearchTerm}
                onChange={(e) => setChatSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gruppchatter</CardTitle>
                  <CardDescription>Chattrum för alla medlemmar</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-32rem)]">
                    <div className="space-y-2">
                      {filteredChats.map((chat) => (
                        <div 
                          key={chat.id} 
                          className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                          onClick={() => navigate(`/chat/${chat.id}`)}
                        >
                          <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">{chat.title}</h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {chat.lastActivity}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{chat.members} medlemmar</span>
                              <span className="mx-1">•</span>
                              <span>{chat.messageCount} meddelanden</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">Visa</span>
                          </Button>
                        </div>
                      ))}
                      
                      {filteredChats.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Inga gruppchatter hittades
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direktmeddelanden</CardTitle>
                  <CardDescription>Privata konversationer mellan medlemmar</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-32rem)]">
                    <div className="space-y-2">
                      {filteredDirectMessages.map((dm) => (
                        <div 
                          key={dm.id} 
                          className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                          onClick={() => navigate(`/messages/${dm.users[1].id}`)}
                        >
                          <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">
                                {dm.users.map(u => u.name).join(' & ')}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {dm.lastActivity}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{dm.messageCount} meddelanden</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">Visa</span>
                          </Button>
                        </div>
                      ))}
                      
                      {filteredDirectMessages.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Inga direktmeddelanden hittades
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök i meddelanden..."
                className="pl-9"
                value={messageSearchTerm}
                onChange={(e) => setMessageSearchTerm(e.target.value)}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Senaste meddelanden</CardTitle>
                <CardDescription>Översikt över alla konversationer i appen</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="space-y-3">
                    {filteredMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          if (message.type === 'group') {
                            navigate(`/chat/${message.chatId}`);
                          } else {
                            navigate(`/messages/${message.sender.id}`);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <span className="font-medium">{message.sender.name}</span>
                            <span className="mx-2 text-muted-foreground">i</span>
                            <span className="text-primary">{message.chatName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.text}</p>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <EyeIcon className="h-3 w-3 mr-1" /> Visa konversation
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredMessages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Inga meddelanden hittades
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {currentUserEdit && (
        <EditUserForm 
          user={currentUserEdit}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AdminPanel;
