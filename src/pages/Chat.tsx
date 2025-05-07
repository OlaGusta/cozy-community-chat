import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Users } from 'lucide-react';
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import UserItem, { User } from '@/components/UserItem';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ExtendedChatRoom } from '@/types/supabase';

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'group' | 'topic';
  created_by?: string;
  created_at?: string;
}

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<ExtendedChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  
  useEffect(() => {
    // Hämta chattrumsinformation
    const fetchChatRoom = async () => {
      if (!chatId) return;
      
      setIsLoading(true);
      try {
        const { data: room, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', chatId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (room) {
          setChatRoom({
            id: room.id,
            name: room.name,
            description: room.description || undefined,
            type: 'topic', // Default value since it's not in the database
            created_by: room.created_by,
            created_at: room.created_at
          });
          
          // Hämta chattrummets meddelanden
          const { data: chatMessages, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              id, 
              content, 
              created_at, 
              user_id, 
              profiles(id, name, avatar, is_online, last_seen)
            `)
            .eq('room_id', chatId)
            .order('created_at', { ascending: true });
            
          if (messagesError) {
            throw messagesError;
          }
          
          if (chatMessages && chatMessages.length > 0) {
            // Hämta aktuell användarens ID
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user?.id;
            
            // Formatera meddelanden
            const formattedMessages: Message[] = chatMessages.map(msg => ({
              id: msg.id,
              text: msg.content,
              sender: {
                id: msg.profiles.id,
                name: msg.profiles.name || 'Okänd användare',
                avatar: msg.profiles.avatar
              },
              timestamp: new Date(msg.created_at),
              isMe: msg.profiles.id === currentUserId
            }));
            
            setMessages(formattedMessages);
          }
          
          // Hämta medlemmar i chattrummet (detta är en förenkling, i verkligheten skulle du ha en separat tabell för medlemskap)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*');
            
          if (profiles) {
            const formattedMembers: User[] = profiles.map(profile => ({
              id: profile.id,
              name: profile.name || 'Okänd användare',
              isOnline: profile.is_online || false,
              isAdmin: profile.is_admin || false,
              lastSeen: formatLastSeen(profile.last_seen),
              avatar: profile.avatar || undefined,
              apartment: profile.apartment || undefined
            }));
            
            setMembers(formattedMembers);
          }
        }
      } catch (error: any) {
        console.error('Fel vid hämtning av chattrum:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta chattrummets information.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatRoom();
  }, [chatId, toast]);
  
  // Format the last_seen timestamp to a readable format
  const formatLastSeen = (timestamp: string | null): string => {
    if (!timestamp) return 'Aldrig';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 5) {
      return 'Nu';
    } else if (diffMins < 60) {
      return `För ${diffMins} min sedan`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `För ${hours} tim sedan`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `För ${days} dag${days > 1 ? 'ar' : ''} sedan`;
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return;
    
    try {
      // Hämta aktuell användare
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: 'Inte inloggad',
          description: 'Du måste vara inloggad för att skicka meddelanden.',
          variant: 'destructive'
        });
        return;
      }
      
      const userId = session.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', userId)
        .single();
        
      // Lägg till meddelandet i UI direkt för bättre respons
      const tempId = `temp-${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        text,
        sender: {
          id: userId,
          name: profile?.name || 'Du',
          avatar: profile?.avatar
        },
        timestamp: new Date(),
        isMe: true
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Spara meddelandet till databasen
      const { data: savedMessage, error } = await supabase
        .from('chat_messages')
        .insert({
          content: text,
          room_id: chatId,
          user_id: userId
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Uppdatera meddelandet med rätt ID från databasen
      if (savedMessage) {
        setMessages(prevMessages => prevMessages.map(msg => 
          msg.id === tempId ? { 
            ...msg, 
            id: savedMessage.id 
          } : msg
        ));
      }
    } catch (error: any) {
      console.error('Fel vid sändning av meddelande:', error);
      toast({
        title: 'Fel vid sändning',
        description: 'Ditt meddelande kunde inte skickas. Försök igen.',
        variant: 'destructive'
      });
    }
  };

  // Om vi fortfarande laddar eller om chattrummet inte hittades
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Laddar chattrum...</p>
        </div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Chattrum hittades inte</h2>
            <p className="text-muted-foreground mb-4">
              Det chattrum du försöker nå finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate('/chats')}>
              Tillbaka till chattar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat header */}
        <div className="border-b p-3 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/chats')}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h2 className="font-medium text-lg leading-tight">{chatRoom.name}</h2>
              {chatRoom.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {chatRoom.description}
                </p>
              )}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Chat Info</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{chatRoom.name}</SheetTitle>
                  <SheetDescription>
                    {chatRoom.description}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4">
                  <h3 className="flex items-center gap-2 font-medium mb-2">
                    <Users className="h-4 w-4" /> Medlemmar ({members.length})
                  </h3>
                  
                  <ScrollArea className="h-[50vh]">
                    <div className="space-y-1 pr-3">
                      {members.map(member => (
                        <UserItem 
                          key={member.id} 
                          user={member}
                          onClick={() => {
                            navigate(`/messages/${member.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  <SheetClose asChild>
                    <Button className="w-full" variant="outline">
                      Stäng
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} />
        </div>
        
        {/* Message input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
