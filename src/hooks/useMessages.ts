
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase, getUsersWithLastMessage } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/dateUtils';
import { UserWithLastMessage } from '@/components/messages/MessageListItem';

export const useMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithLastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Hämta aktuell användare
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: 'Inte inloggad',
            description: 'Du måste vara inloggad för att se direktmeddelanden.',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }
        
        const currentUserId = session.user.id;

        const { data, error } = await getUsersWithLastMessage(currentUserId);

        if (error) {
          throw error;
        }

        if (data) {
          const formattedUsers: UserWithLastMessage[] = data.map(profile => {
            const lastMessage = profile.content && profile.created_at ? {
              text: profile.content,
              timestamp: new Date(profile.created_at)
            } : undefined;

            return {
              id: profile.id,
              name: profile.name || 'Okänd användare',
              isOnline: profile.is_online || false,
              lastSeen: formatDate(new Date(profile.last_seen || Date.now())),
              isAdmin: profile.is_admin || false,
              avatar: profile.avatar || undefined,
              apartment: profile.apartment || undefined,
              lastMessage
            };
          });

          setUsers(formattedUsers);
        }
      } catch (error: any) {
        console.error('Fel vid hämtning av användare:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta användarlista. Försök igen senare.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate, toast]);

  return {
    users,
    isLoading,
    searchTerm,
    setSearchTerm
  };
};
