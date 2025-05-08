
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Chat } from '@/components/ChatList';

export const useChatRoomsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const checkIfAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setIsAdmin(profile.is_admin || false);
        } else {
          // Check localStorage as fallback
          setIsAdmin(localStorage.getItem('userRole') === 'admin');
        }
      } else {
        // Check localStorage as fallback
        setIsAdmin(localStorage.getItem('userRole') === 'admin');
      }
    };

    // Fetch chat rooms from Supabase
    const fetchChatRooms = async () => {
      setIsLoading(true);
      try {
        const { data: chatRooms, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Convert from database format to app format
        if (chatRooms) {
          const formattedChats: Chat[] = chatRooms.map(room => ({
            id: room.id,
            title: room.name,
            description: room.description || undefined,
            type: 'topic', // Default value since it's not in the database
            isPrivate: false // Default value since it's not in the database
          }));

          setChats(formattedChats);
        }
      } catch (error: any) {
        console.error('Error fetching chat rooms:', error.message);
        toast({
          title: 'Error fetching chat rooms',
          description: 'Could not fetch chat rooms. Try again later.',
          variant: 'destructive',
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkIfAdmin();
    fetchChatRooms();
  }, [toast]);

  // Delete a chat room
  const deleteChatRoom = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_rooms')
        .delete()
        .eq('id', chatId);
        
      if (error) {
        throw error;
      }
      
      // Remove from local state
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      
      toast({
        title: 'Chattrum borttaget',
        description: 'Chattrummet har raderats.',
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error deleting chat room:', error.message);
      toast({
        title: 'Kunde inte radera chattrum',
        description: error.message || 'Ett fel uppstod när chattrummet skulle raderas.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.description && chat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const groupChats = filteredChats.filter(chat => chat.type === 'group');
  const topicChats = filteredChats.filter(chat => chat.type === 'topic');

  const addNewChat = (newChat: Chat) => {
    setChats(prevChats => [newChat, ...prevChats]);
  };

  return {
    searchTerm,
    setSearchTerm,
    activeId,
    setActiveId,
    isLoading,
    isAdmin,
    filteredChats,
    groupChats,
    topicChats,
    addNewChat,
    deleteChatRoom
  };
};
