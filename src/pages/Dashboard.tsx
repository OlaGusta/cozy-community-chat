
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnouncementCard, { Announcement } from '@/components/AnnouncementCard';
import ChatList, { Chat } from '@/components/ChatList';
import UserItem, { User } from '@/components/UserItem';
import { MessageSquare, Users, Bell, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Städdag i helgen',
    content: 'Påminner om att vi har städdag på lördag 10:00. Alla medlemmar förväntas delta. Vi kommer att städa allmänna utrymmen och trädgården.\n\nVi bjuder på fika efteråt!',
    sender: {
      id: '1',
      name: 'Anna Lindberg',
      role: 'Ordförande'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    important: true
  },
  {
    id: '2',
    title: 'Renovering av entrén',
    content: 'Renoveringen av entrén kommer att påbörjas nästa vecka. Det kan medföra vissa störningar under dagtid.',
    sender: {
      id: '2',
      name: 'Erik Holm',
      role: 'Styrelsemedlem'
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  }
];

const activeMembers: User[] = [
  {
    id: '1',
    name: 'Anna Lindberg',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu'
  },
  {
    id: '2',
    name: 'Erik Holm',
    isOnline: true,
    lastSeen: 'Nu'
  },
  {
    id: '3',
    name: 'Sofia Chen',
    isOnline: false,
    lastSeen: 'För 40 min sedan'
  },
  {
    id: '4',
    name: 'Johan Bergman',
    isOnline: false,
    lastSeen: 'För 2 tim sedan'
  }
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Städdag',
    date: 'Lördag, 15 juni',
    time: '10:00 - 14:00',
    location: 'Gården'
  },
  {
    id: '2',
    title: 'Styrelsemöte',
    date: 'Onsdag, 19 juni',
    time: '18:30 - 20:00',
    location: 'Föreningslokalen'
  },
  {
    id: '3',
    title: 'Midsommarfest',
    date: 'Fredag, 21 juni',
    time: '15:00 - 22:00',
    location: 'Trädgården'
  }
];

const Dashboard = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 animate-in">Välkommen till BRF Humlan4</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2 space-y-6">
            {/* Announcements section */}
            <Card className="animate-in">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Meddelanden
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate('/announcements')}>
                  Visa alla
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map(announcement => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                  />
                ))}
              </CardContent>
            </Card>
            
            {/* Recent chats & events */}
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
          </div>
          
          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Active members */}
            <Card className="animate-in">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Medlemmar
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate('/members')}>
                  Visa alla
                </Button>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {activeMembers.map(member => (
                    <UserItem 
                      key={member.id} 
                      user={member} 
                      onClick={() => navigate(`/messages/${member.id}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick actions */}
            <Card className="animate-in">
              <CardHeader className="pb-2">
                <CardTitle>Snabbåtgärder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    // Use the first actual chat room ID if available, otherwise default to /chats
                    if (recentChats.length > 0) {
                      navigate(`/chat/${recentChats[0].id}`);
                    } else {
                      navigate('/chats');
                    }
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Skriv i allmänna chatten
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/members')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Hitta en granne
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/announcements')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Se alla meddelanden
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
