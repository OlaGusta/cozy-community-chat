
import { useState, useCallback } from 'react';
import { User } from '@/components/UserItem';
import { loadUsers } from '@/utils/userManagement';
import { useToast } from '@/components/ui/use-toast';

export function useAdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserEdit, setCurrentUserEdit] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadUsersData = useCallback(async () => {
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
  }, [toast]);
  
  const handleEditUser = useCallback((user: User) => {
    setCurrentUserEdit(user);
    setIsEditDialogOpen(true);
  }, []);
  
  // Function to add new user to state
  const handleUserAdded = useCallback((newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  }, []);
  
  return {
    users,
    setUsers,
    currentUserEdit,
    setCurrentUserEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isLoading,
    loadUsersData,
    handleEditUser,
    handleUserAdded
  };
}

export default useAdminUsers;
