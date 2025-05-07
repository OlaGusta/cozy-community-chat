
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
        setIsLoading(true);
        const { data: chatRooms, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) {
          throw error;
        }
        
        if (chatRooms && chatRooms.length > 0) {
          // Format chat rooms for display - ensure ALL required properties are included
          const formattedChats: Chat[] = chatRooms.map(room => ({
            id: room.id,
            title: room.name,
            description: room.description || 'Ingen beskrivning tillgänglig',
            type: 'topic', // Ensure type property is always included
            lastMessage: {
              text: room.description || 'Inga nya meddelanden',
              time: 'Nyligen',
              sender: 'System'
            }
          }));
          
          setRecentChats(formattedChats);
        } else {
          // Set empty array if no chat rooms found
          setRecentChats([]);
        }
      } catch (error: any) {
        console.error('Error fetching chat rooms:', error.message);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta chattrummen.',
          variant: 'destructive'
        });
        setRecentChats([]); // Set empty array in case of error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatRooms();
  }, [limit, toast]);

  return { recentChats, isLoading };
};
