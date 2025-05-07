
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Plus, Search } from 'lucide-react';
import AnnouncementCard, { Announcement } from '@/components/AnnouncementCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/utils/dateUtils';

const Announcements = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    important: false
  });
  
  // Fetch announcements from Supabase
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        
        const { data: announcementsData, error } = await supabase
          .from('announcements')
          .select('*, sender:sender_id(id, name)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (announcementsData) {
          const formattedAnnouncements: Announcement[] = announcementsData.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            sender: {
              id: item.sender?.id || '',
              name: item.sender?.name || 'System',
              role: 'Admin'
            },
            timestamp: new Date(item.created_at || Date.now()),
            important: item.important || false
          }));
          
          setAnnouncements(formattedAnnouncements);
        }
      } catch (error: any) {
        console.error('Error fetching announcements:', error.message);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta meddelanden. Försök igen senare.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [toast]);
  
  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkIfAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.is_admin || false);
      }
    };
    
    checkIfAdmin();
  }, []);
  
  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Inte inloggad",
          description: "Du måste vara inloggad för att skapa meddelanden.",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            important: formData.important,
            sender_id: session.user.id
          }
        ])
        .select('*, sender:sender_id(id, name)');
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newAnnouncement: Announcement = {
          id: data[0].id,
          title: data[0].title,
          content: data[0].content,
          sender: {
            id: data[0].sender?.id || session.user.id,
            name: data[0].sender?.name || 'System',
            role: 'Admin'
          },
          timestamp: new Date(data[0].created_at || Date.now()),
          important: data[0].important || false
        };
        
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        
        toast({
          title: "Meddelande skickat",
          description: "Ditt meddelande har skickats till alla medlemmar.",
        });
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          important: false
        });
      }
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skapa meddelande. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <Bell className="h-6 w-6" /> Meddelanden
          </h1>
          
          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nytt meddelande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateAnnouncement}>
                  <DialogHeader>
                    <DialogTitle>Skapa nytt meddelande</DialogTitle>
                    <DialogDescription>
                      Detta meddelande kommer att skickas till alla medlemmar.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titel</Label>
                      <Input 
                        id="title" 
                        placeholder="Ange titel" 
                        required 
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Meddelande</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Skriv ditt meddelande..." 
                        rows={5} 
                        required 
                        value={formData.content}
                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="important" 
                        checked={formData.important}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, important: checked === true }))
                        }
                      />
                      <Label htmlFor="important">Markera som viktigt</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? 'Skickar...' : 'Skicka meddelande'}
                    </Button>
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
              placeholder="Sök meddelanden..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="animate-in">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Alla</TabsTrigger>
            <TabsTrigger value="important">Viktiga</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-4 pr-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Laddar meddelanden...</p>
                  </div>
                ) : filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map(announcement => (
                    <AnnouncementCard 
                      key={announcement.id} 
                      announcement={announcement} 
                      className="animate-in fade-in"
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Inga meddelanden hittades</h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `Inga meddelanden matchade söktermen "${searchTerm}"`
                        : "Det finns inga meddelanden att visa ännu."}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="important" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-4 pr-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Laddar meddelanden...</p>
                  </div>
                ) : filteredAnnouncements.filter(a => a.important).length > 0 ? (
                  filteredAnnouncements
                    .filter(a => a.important)
                    .map(announcement => (
                      <AnnouncementCard 
                        key={announcement.id} 
                        announcement={announcement} 
                        className="animate-in fade-in"
                      />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Inga viktiga meddelanden</h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `Inga viktiga meddelanden matchade söktermen "${searchTerm}"`
                        : "Det finns inga viktiga meddelanden att visa ännu."}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Announcements;
