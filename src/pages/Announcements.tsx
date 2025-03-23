
import React from 'react';
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

// Sample data for demonstration
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
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
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
  },
  {
    id: '3',
    title: 'Årsstämma 2023',
    content: 'Information om årets stämma har skickats ut via post. Stämman hålls den 15 maj kl 18:00 i föreningslokalen.',
    sender: {
      id: '1',
      name: 'Anna Lindberg',
      role: 'Ordförande'
    },
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    important: true
  },
  {
    id: '4',
    title: 'Ny tvättmaskin i tvättstugan',
    content: 'Vi har installerat en ny tvättmaskin i tvättstugan. Den gamla maskinen var trasig och har ersatts med en energieffektiv modell.',
    sender: {
      id: '3',
      name: 'Sofia Chen',
      role: 'Styrelsemedlem'
    },
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: '5',
    title: 'Trädgårdsarbete under våren',
    content: 'Trädgårdsgruppen kommer att plantera nya växter under maj månad. Om du vill delta, kontakta Erik Holm.',
    sender: {
      id: '2',
      name: 'Erik Holm',
      role: 'Styrelsemedlem'
    },
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  }
];

const isAdmin = true; // This would normally come from auth state

const Announcements = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Meddelande skickat",
      description: "Ditt meddelande har skickats till alla medlemmar.",
    });
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
                      <Input id="title" placeholder="Ange titel" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Meddelande</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Skriv ditt meddelande..." 
                        rows={5} 
                        required 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="important" />
                      <Label htmlFor="important">Markera som viktigt</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Skicka meddelande</Button>
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
                {filteredAnnouncements.length > 0 ? (
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
                {filteredAnnouncements.filter(a => a.important).length > 0 ? (
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
