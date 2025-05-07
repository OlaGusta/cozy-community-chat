
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, LogOut, Users, MessageSquare, EyeIcon } from 'lucide-react';
import { User } from '@/components/UserItem';
import EditUserForm from '@/components/EditUserForm';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { makeOlaAdmin, loadUsers, handleSaveUser } from '@/utils/adminUtils';

// Import our new components
import UsersTab from '@/components/admin/UsersTab';
import ChatsTab from '@/components/admin/ChatsTab';
import MessagesTab from '@/components/admin/MessagesTab';
import InviteUserDialog from '@/components/admin/InviteUserDialog';
import AdminDashboard from '@/components/admin/AdminDashboard';

// Sample data for chat and message tabs
import { allChats, directMessages, recentMessages } from '@/data/adminChatData';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserEdit, setCurrentUserEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Kör makeOlaAdmin direkt när komponenten laddas
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const success = await makeOlaAdmin();
        if (success) {
          console.log("Ola Gustafsson är nu admin");
        } else {
          console.error("Kunde inte göra Ola till admin");
        }
      } catch (err) {
        console.error("Fel vid initialisering av admin:", err);
      }
    };
    
    initializeAdmin();
  }, []);
  
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
      loadUsersData();
    }
  }, [navigate, toast]);
  
  const loadUsersData = async () => {
    setIsLoading(true);
    try {
      const userData = await loadUsers();
      setUsers(userData);
    } catch (error) {
      toast({
        title: "Fel vid inläsning av användare",
        description: "Kunde inte hämta användarlistan.",
        variant: "destructive"
      });
      // We'll leave the users array empty in case of an error
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUserEdit(user);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveUserData = async (updatedUser: User) => {
    const success = await handleSaveUser(updatedUser);
    if (success) {
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      toast({
        title: "Användare uppdaterad",
        description: `${updatedUser.name} har uppdaterats.`,
      });
    } else {
      toast({
        title: "Fel vid uppdatering av användare",
        description: "Kunde inte uppdatera användaren.",
        variant: "destructive"
      });
    }
    setIsEditDialogOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };
  
  // Function to add new user to state
  const handleUserAdded = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <Shield className="h-6 w-6" /> Admin Panel
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" /> Lägg till medlem
            </Button>
            
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logga ut
            </Button>
          </div>
        </div>
        
        <AdminDashboard />
        
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
            <UsersTab 
              users={users}
              setUsers={setUsers}
              onEditUser={handleEditUser}
            />
          </TabsContent>
          
          <TabsContent value="chats" className="space-y-4">
            <ChatsTab 
              chats={allChats} 
              directMessages={directMessages} 
            />
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <MessagesTab messages={recentMessages} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dialogs */}
      {currentUserEdit && (
        <EditUserForm 
          user={currentUserEdit}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveUserData}
        />
      )}
      
      <InviteUserDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AdminPanel;
