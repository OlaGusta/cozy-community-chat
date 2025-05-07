
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { makeOlaAdmin } from '@/utils/adminUtils';

export function useAdminAuth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  
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
      setIsAdminChecked(true);
    }
  }, [navigate, toast]);
  
  return { isAdminChecked };
}

export default useAdminAuth;
