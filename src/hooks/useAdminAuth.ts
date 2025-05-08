
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
        console.log("Starting admin authentication process");
        // Get current user info from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not logged in, clear any admin status
          console.log("No session found, clearing admin status");
          localStorage.removeItem('userRole');
          navigate('/');
          return;
        }
        
        const currentUser = session.user;
        console.log("Current user:", currentUser);
        
        // Check if current user is Ola or has an admin profile
        const isOla = currentUser?.email === 'ola@olagustafsson.com' || 
                      currentUser?.email === 'ola.gustafsson70@gmail.com';
                      
        if (isOla) {
          // Make sure Ola has admin rights
          console.log("Current user is Ola, ensuring admin rights");
          const success = await makeOlaAdmin();
          if (success) {
            console.log("Ola Gustafsson är nu admin");
            localStorage.setItem('userRole', 'admin');
            setIsAdminChecked(true);
            return;
          } else {
            console.error("Kunde inte göra Ola till admin");
          }
        } else {
          // For non-Ola users, check if they have an admin profile
          if (currentUser) {
            console.log("Checking if current user has admin profile");
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', currentUser.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile:", error);
            }
              
            if (profile?.is_admin) {
              console.log("User is admin according to profile");
              localStorage.setItem('userRole', 'admin');
              setIsAdminChecked(true);
              return;
            }
          }
        }
        
        // Always run makeOlaAdmin to ensure all Ola profiles are set to admin
        await makeOlaAdmin();
        
        // Check if we're still here but user should actually be admin
        const forceAdmin = localStorage.getItem('userRole') === 'admin';
        if (forceAdmin) {
          console.log("User has admin in localStorage, allowing access");
          setIsAdminChecked(true);
          return;
        }
        
        // If we reach here, the user is not an admin
        console.log("User is not an admin, redirecting to dashboard");
        toast({
          title: "Åtkomst nekad",
          description: "Du har inte behörighet att se denna sida.",
          variant: "destructive"
        });
        navigate('/dashboard');
      } catch (err) {
        console.error("Fel vid initialisering av admin:", err);
        navigate('/dashboard');
      } finally {
        setIsAdminChecked(true);
      }
    };
    
    initializeAdmin();
    
    // Set up auth state change listener to handle logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing localStorage');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
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
