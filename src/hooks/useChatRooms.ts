
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Chat } from '@/components/ChatList';

export const useChatRooms = (limit: number = 3) => {
  const { toast } = useToast();
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const { data: chatRooms, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) {
          throw error;
        }
        
        if (chatRooms) {
          // Format chat rooms for display
          const formattedChats: Chat[] = chatRooms.map(room => ({
            id: room.id,
            title: room.name,
            description: room.description || undefined,
            type: 'topic',
            lastMessage: {
              text: room.description || 'Inga nya meddelanden',
              time: 'Nyligen',
              sender: 'System'
            }
          }));
          
          setRecentChats(formattedChats);
        }
      } catch (error: any) {
        console.error('Error fetching chat rooms:', error.message);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta chattrummen.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatRooms();
  }, [limit, toast]);

  return { recentChats, isLoading };
};
