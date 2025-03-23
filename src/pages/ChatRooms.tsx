
import React, { useState } from 'react';
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

// Sample data for demonstration
const chats: Chat[] = [
  {
    id: '1',
    title: 'Allmänt',
    description: 'Chattrum för allmänna diskussioner',
    type: 'group',
    unreadCount: 3,
    lastMessage: {
      text: 'Någon som har en borrmaskin att låna ut?',
      time: '10:42',
      sender: 'Lisa'
    }
  },
  {
    id: '2',
    title: 'Trädgårdsgruppen',
    description: 'Planering och diskussioner för trädgårdsarbete',
    type: 'topic',
    lastMessage: {
      text: 'Jag kan hjälpa till på söndag istället',
      time: 'Igår',
      sender: 'Johan'
    }
  },
  {
    id: '3',
    title: 'Fest & Aktiviteter',
    description: 'Planering av föreningens sociala aktiviteter',
    type: 'topic',
    lastMessage: {
      text: 'Midsommarfesten är planerad till den 21 juni',
      time: 'Fre',
      sender: 'Anna'
    }
  },
  {
    id: '4',
    title: 'Renovering',
    description: 'Diskussioner kring fasad- och trapphusrenovering',
    type: 'topic',
    unreadCount: 1,
    lastMessage: {
      text: 'Mötet med entreprenören är på måndag kl 14:00',
      time: 'Ons',
      sender: 'Erik'
    }
  },
  {
    id: '5',
    title: 'Teknik & Wifi',
    description: 'Hjälp med tekniska problem och diskussioner',
    type: 'topic',
    lastMessage: {
      text: 'Har installerat en ny router i källaren för bättre täckning',
      time: '25 maj',
      sender: 'Anders'
    }
  },
  {
    id: '6',
    title: 'Köp & Sälj',
    description: 'Saker att sälja eller köpa inom föreningen',
    type: 'topic',
    lastMessage: {
      text: 'Har någon intresse av en bokhylla? Den är i bra skick.',
      time: '20 maj',
      sender: 'Maria'
    }
  },
  {
    id: '7',
    title: 'Husdjur',
    description: 'För alla som har eller gillar husdjur',
    type: 'topic',
    lastMessage: {
      text: 'Någon som kan hundvakta i helgen?',
      time: '15 maj',
      sender: 'Lisa'
    }
  }
];

const isAdmin = true; // This would normally come from auth state

const ChatRooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.description && chat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const groupChats = filteredChats.filter(chat => chat.type === 'group');
  const topicChats = filteredChats.filter(chat => chat.type === 'topic');
  
  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Chattrum skapat",
      description: "Ditt nya chattrum har skapats.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <MessageSquare className="h-6 w-6" /> Chattar
          </h1>
          
          {isAdmin && (
            <Dialog>
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
                      <Input id="title" placeholder="t.ex. Renovering" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Beskrivning</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Beskrivning av chattrummet..." 
                        rows={3} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="private" />
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
              placeholder="Sök chattar..."
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
              {filteredChats.length > 0 ? (
                <ChatList 
                  chats={filteredChats} 
                  activeId={activeId} 
                />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Inga chattar hittades</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Inga chattar matchade söktermen "${searchTerm}"`
                      : "Det finns inga chattar att visa ännu."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="group" className="mt-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {groupChats.length > 0 ? (
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
              {topicChats.length > 0 ? (
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
