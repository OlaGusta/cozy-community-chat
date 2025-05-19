
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
        
        // Hämta alla användare
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId);  // Filtrera bort den aktuella användaren
          
        if (error) {
          throw error;
        }
        
        if (profiles) {
          const formattedUsers: UserWithLastMessage[] = await Promise.all(profiles.map(async (profile) => {
            // Hämta senaste meddelandet mellan aktuell användare och denna användare
            // Den tidigare implementationen hämtade meddelanden där någon av
            // användarna deltog, vilket kunde ge fel resultat om det fanns
            // meddelanden med andra användare. Här ser vi till att endast
            // meddelanden mellan de två specifika användarna hämtas.
            const {
              data: lastMsg,
              error: lastMsgError
            } = await supabase
              .from('direct_messages')
              .select('*')
              .or(
                `and(sender_id.eq.${currentUserId},recipient_id.eq.${profile.id}),` +
                `and(sender_id.eq.${profile.id},recipient_id.eq.${currentUserId})`
              )
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            let lastMessage: { text: string; timestamp: Date } | undefined;

            if (lastMsgError) {
              console.error('Error fetching last message:', lastMsgError);
            } else if (lastMsg) {
              lastMessage = {
                text: lastMsg.content,
                timestamp: new Date(lastMsg.created_at)
              };
            }
            
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
          }));
          
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
