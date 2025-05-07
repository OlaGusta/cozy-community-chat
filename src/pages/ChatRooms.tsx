
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, MessageSquare } from 'lucide-react';
import ChatList, { Chat } from '@/components/ChatList';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ChatRooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatDescription, setNewChatDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [newChatType, setNewChatType] = useState<'group' | 'topic'>('topic');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChatTitle.trim()) {
      toast({
        title: 'Fill in name',
        description: 'You must provide a name for the chat room.',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Not logged in',
          description: 'You must be logged in to create chat rooms.',
          variant: 'destructive',
          duration: 3000
        });
        return;
      }

      // Create new chat room in the database
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: newChatTitle,
          description: newChatDescription || null,
          created_by: session.user.id
          // Note: We don't include type and is_private since they don't exist in the database
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local list
      if (newRoom) {
        const newChat: Chat = {
          id: newRoom.id,
          title: newRoom.name,
          description: newRoom.description || undefined,
          type: newChatType,
          isPrivate: isPrivate
        };

        setChats(prevChats => [newChat, ...prevChats]);
        
        toast({
          title: "Chat room created",
          description: `Chat room "${newChatTitle}" has been created.`,
          duration: 3000
        });
        
        // Reset form
        setNewChatTitle('');
        setNewChatDescription('');
        setIsPrivate(false);
        setNewChatType('topic');
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating chat room:', error.message);
      toast({
        title: 'Error creating chat room',
        description: error.message || 'Something went wrong. Try again later.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.description && chat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const groupChats = filteredChats.filter(chat => chat.type === 'group');
  const topicChats = filteredChats.filter(chat => chat.type === 'topic');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <MessageSquare className="h-6 w-6" /> Gruppchattar
          </h1>
          
          {(isAdmin || true) && ( // Always show create button temporarily for testing
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nytt chattrum
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateChat}>
                  <DialogHeader>
                    <DialogTitle>Skapa nytt chattrum</DialogTitle>
                    <DialogDescription>
                      Skapa ett nytt ämne eller chattrum för medlemmarna att diskutera i.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Namn på chattrum</Label>
                      <Input 
                        id="title" 
                        placeholder="t.ex. Renovering" 
                        value={newChatTitle}
                        onChange={(e) => setNewChatTitle(e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Beskrivning</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Beskrivning av chattrummet..." 
                        rows={3}
                        value={newChatDescription}
                        onChange={(e) => setNewChatDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Typ av chattrum</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="typeTopic"
                            name="chatType"
                            checked={newChatType === 'topic'}
                            onChange={() => setNewChatType('topic')}
                          />
                          <Label htmlFor="typeTopic">Ämne</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="typeGroup"
                            name="chatType"
                            checked={newChatType === 'group'}
                            onChange={() => setNewChatType('group')}
                          />
                          <Label htmlFor="typeGroup">Grupp</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="private" 
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                      />
                      <Label htmlFor="private">Privat chattrum (endast inbjudna)</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Skapa chattrum</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="mb-6 animate-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök gruppchattar..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="animate-in">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Alla</TabsTrigger>
            <TabsTrigger value="group">Grupper</TabsTrigger>
            <TabsTrigger value="topic">Ämnen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Laddar gruppchattar...</p>
                </div>
              ) : filteredChats.length > 0 ? (
                <ChatList 
                  chats={filteredChats} 
                  activeId={activeId} 
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Inga gruppchattar hittades</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Inga gruppchattar matchade söktermen "${searchTerm}"`
                      : "Det finns inga gruppchattar att visa ännu."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="group" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Laddar grupper...</p>
                </div>
              ) : groupChats.length > 0 ? (
                <ChatList 
                  chats={groupChats} 
                  activeId={activeId} 
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Inga gruppchattar hittades</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Inga gruppchattar matchade söktermen "${searchTerm}"`
                      : "Det finns inga gruppchattar att visa ännu."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="topic" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Laddar ämnen...</p>
                </div>
              ) : topicChats.length > 0 ? (
                <ChatList 
                  chats={topicChats} 
                  activeId={activeId} 
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Inga ämnen hittades</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Inga ämnen matchade söktermen "${searchTerm}"`
                      : "Det finns inga ämnen att visa ännu."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ChatRooms;
