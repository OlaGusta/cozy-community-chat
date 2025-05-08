
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AdminActionsProps {
  onInviteClick: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ onInviteClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear all auth related local storage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      
      toast({
        title: "Utloggad",
        description: "Du har loggats ut från systemet.",
      });
      
      // Force navigation to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Fel vid utloggning",
        description: "Ett problem uppstod vid utloggning. Försök igen.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        className="flex items-center gap-2"
        onClick={onInviteClick}
      >
        <UserPlus className="h-4 w-4" /> Lägg till medlem
      </Button>
      
      <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" /> Logga ut
      </Button>
    </div>
  );
};

export default AdminActions;
