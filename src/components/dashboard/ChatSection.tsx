
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CalendarClock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatList, { Chat } from '@/components/ChatList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface ChatSectionProps {
  upcomingEvents: EventItem[];
}

const ChatSection: React.FC<ChatSectionProps> = ({ upcomingEvents }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch actual chat rooms from the database
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const { data: chatRooms, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
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
  }, [toast]);

  return (
    <Tabs defaultValue="chats" className="animate-in">
      <div className="flex items-center justify-between mb-2">
        <TabsList>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Chattar
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" /> Evenemang
          </TabsTrigger>
        </TabsList>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/chats')}
        >
          Visa alla
        </Button>
      </div>
      
      <TabsContent value="chats" className="m-0">
        <Card>
          <CardContent className="p-3">
            {isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Laddar chattar...</p>
            ) : (
              recentChats.length > 0 ? (
                <ChatList chats={recentChats} />
              ) : (
                <p className="text-center py-4 text-muted-foreground">Inga chattar tillgängliga</p>
              )
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="events" className="m-0">
        <Card>
          <CardContent className="p-4 space-y-4">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="flex gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg">
                  <CalendarClock className="h-6 w-6" />
                </div>
                
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ChatSection;
