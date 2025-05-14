
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { handleSaveUser } from '@/utils/userManagement';
import { useToast } from '@/hooks/use-toast';
import EditUserForm from '@/components/EditUserForm';
import { User } from '@/components/UserItem';

// Import our custom hooks
import useAdminAuth from '@/hooks/useAdminAuth';
import useAdminTabs from '@/hooks/useAdminTabs';
import useAdminUsers from '@/hooks/useAdminUsers';

// Import our new components
import AdminHeader from '@/components/admin/AdminHeader';
import AdminActions from '@/components/admin/AdminActions';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminTabsContainer from '@/components/admin/AdminTabsContainer';
import InviteUserDialog from '@/components/admin/InviteUserDialog';

const AdminPanel = () => {
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Use our custom hooks
  const { isAdminChecked } = useAdminAuth();
  const { activeTab, setActiveTab } = useAdminTabs();
  const { 
    users, 
    setUsers,
    currentUserEdit,
    setCurrentUserEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    loadUsersData,
    handleEditUser,
    handleUserAdded
  } = useAdminUsers();
  
  // Load users when component mounts and admin check passes
  useEffect(() => {
    if (isAdminChecked) {
      loadUsersData();
    }
  }, [isAdminChecked, loadUsersData]);
  
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
      setIsEditDialogOpen(false);
    } else {
      toast({
        title: "Fel vid uppdatering av användare",
        description: "Kunde inte uppdatera användaren.",
        variant: "destructive"
      });
      setIsEditDialogOpen(false);
    }
  };

  // Don't render anything until we've checked if the user is an admin
  if (!isAdminChecked) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <AdminHeader />
          <AdminActions onInviteClick={() => setIsInviteDialogOpen(true)} />
        </div>
        
        <AdminDashboard />
        
        <AdminTabsContainer 
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as any)}
          users={users}
          setUsers={setUsers}
          onEditUser={handleEditUser}
        />
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
