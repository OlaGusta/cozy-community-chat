
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { makeOlaAdmin } from '@/utils/adminUserUtils';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Get current user info from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not logged in, clear any admin status
          localStorage.removeItem('userRole');
          navigate('/');
          return;
        }
        
        const currentUser = session.user;
        
        // Check if current user is Ola or has an admin profile
        const isOla = currentUser?.email === 'ola@olagustafsson.com' || 
                      localStorage.getItem('userEmail') === 'ola@olagustafsson.com';
                      
        if (isOla) {
          // Make sure Ola has admin rights
          const success = await makeOlaAdmin();
          if (success) {
            console.log("Ola Gustafsson är nu admin");
            localStorage.setItem('userRole', 'admin');
          } else {
            console.error("Kunde inte göra Ola till admin");
          }
        } else {
          // For non-Ola users, check if they have an admin profile
          if (currentUser) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', currentUser.id)
              .single();
              
            if (profile?.is_admin) {
              localStorage.setItem('userRole', 'admin');
              console.log("Användare markerad som admin");
            }
          }
        }
      } catch (err) {
        console.error("Fel vid initialisering av admin:", err);
      } finally {
        checkAdminStatus();
      }
    };
    
    const checkAdminStatus = () => {
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
    };
    
    initializeAdmin();
    
    // Set up auth state change listener to handle logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing localStorage');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
  
  return { isAdminChecked };
}

export default useAdminAuth;
