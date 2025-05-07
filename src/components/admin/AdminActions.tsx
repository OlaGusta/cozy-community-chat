
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus, LogOut } from 'lucide-react';

interface AdminActionsProps {
  onInviteClick: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ onInviteClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
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
