
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/components/UserItem';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const DirectMessage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Hämta aktuell användare
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: 'Inte inloggad',
            description: 'Du måste vara inloggad för att skicka meddelanden.',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }
        
        setCurrentUserId(session.user.id);
        
        // Hämta användarinfo
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name || 'Okänd användare',
            isOnline: profile.is_online || false,
            lastSeen: formatLastSeen(profile.last_seen),
            isAdmin: profile.is_admin || false,
            avatar: profile.avatar || undefined,
            apartment: profile.apartment || undefined
          });
          
          // Hämta konversation
          const { data: directMessages, error: messagesError } = await supabase
            .from('direct_messages')
            .select(`*, sender:profiles!sender_id(id, name, avatar)`)
            .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${session.user.id})`)
            .order('created_at', { ascending: true });
            
          if (messagesError) {
            throw messagesError;
          }
          
          if (directMessages) {
            const formattedMessages: Message[] = directMessages.map(msg => ({
              id: msg.id,
              text: msg.content,
              sender: {
                id: msg.sender.id,
                name: msg.sender.name || 'Okänd användare',
                avatar: msg.sender.avatar
              },
              timestamp: new Date(msg.created_at),
              isMe: msg.sender.id === session.user.id
            }));
            
            setMessages(formattedMessages);
            
            // Markera meddelanden som lästa om de var till användaren
            await supabase
              .from('direct_messages')
              .update({ is_read: true })
              .eq('recipient_id', session.user.id)
              .eq('sender_id', userId);
          }
        }
      } catch (error: any) {
        console.error('Fel vid hämtning av användare eller meddelanden:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta konversationen. Försök igen senare.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    // Prenumerera på nya meddelanden
    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: userId ? `recipient_id=eq.${currentUserId}` : undefined
        },
        async (payload) => {
          // Kontrollera om det nya meddelandet är relevant för denna konversation
          const newMsg = payload.new;
          if (newMsg.sender_id !== userId && newMsg.recipient_id !== userId) {
            return;
          }
          
          // Hämta avsändarens information
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, name, avatar')
            .eq('id', newMsg.sender_id)
            .single();
            
          // Lägg till nya meddelandet
          const newMessage: Message = {
            id: newMsg.id,
            text: newMsg.content,
            sender: {
              id: sender.id,
              name: sender.name || 'Okänd användare',
              avatar: sender.avatar
            },
            timestamp: new Date(newMsg.created_at),
            isMe: sender.id === currentUserId
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Markera som läst om det skickades till användaren
          if (newMsg.recipient_id === currentUserId) {
            await supabase
              .from('direct_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, navigate, toast, currentUserId]);
  
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
    if (!userId || !text.trim() || !currentUserId) return;
    
    try {
      // Skapa ett temporärt meddelande
      const tempId = `temp-${Date.now()}`;
      const newMessage: Message = {
        id: tempId,
        text,
        sender: {
          id: currentUserId,
          name: 'Du',
          avatar: undefined // Detta skulle hämtas från profilen i verkligheten
        },
        timestamp: new Date(),
        isMe: true
      };
      
      // Lägg till i UI direkt för bättre användargränssnittsupplevelse
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Skicka meddelande till databasen
      const { data: savedMessage, error } = await supabase
        .from('direct_messages')
        .insert({
          content: text,
          sender_id: currentUserId,
          recipient_id: userId,
          is_read: false
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Uppdatera meddelandet med korrekt ID
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Laddar konversation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Användaren hittades inte</h2>
            <p className="text-muted-foreground mb-4">
              Den användare du försöker nå finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate('/members')}>
              Tillbaka till medlemslistan
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/messages')}
                className="md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-medium leading-none">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {user.isOnline ? 'Online' : `Senast sedd: ${user.lastSeen}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Ring</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Video className="h-5 w-5" />
                <span className="sr-only">Videosamtal</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Mer</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Alternativ</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> Ring
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Video className="mr-2 h-4 w-4" /> Videosamtal
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={() => navigate(`/members?id=${user.id}`)}>
                    <Info className="mr-2 h-4 w-4" /> Visa profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

export default DirectMessage;
