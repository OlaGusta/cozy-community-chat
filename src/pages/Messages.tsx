
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from '@/components/UserItem';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/dateUtils';

interface LastMessage {
  text: string;
  timestamp: Date;
}

interface UserWithLastMessage extends User {
  lastMessage?: LastMessage;
}

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithLastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Hämta aktuell användare
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: 'Inte inloggad',
            description: 'Du måste vara inloggad för att se direktmeddelanden.',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }
        
        const currentUserId = session.user.id;
        
        // Hämta alla användare
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId);  // Filtrera bort den aktuella användaren
          
        if (error) {
          throw error;
        }
        
        if (profiles) {
          const formattedUsers: UserWithLastMessage[] = await Promise.all(profiles.map(async (profile) => {
            // Hämta senaste meddelandet mellan aktuell användare och denna användare
            const { data: messages } = await supabase
              .from('direct_messages')
              .select('*')
              .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
              .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
              .order('created_at', { ascending: false })
              .limit(1);
              
            let lastMessage: LastMessage | undefined = undefined;
            
            if (messages && messages.length > 0) {
              lastMessage = {
                text: messages[0].content,
                timestamp: new Date(messages[0].created_at)
              };
            }
            
            return {
              id: profile.id,
              name: profile.name || 'Okänd användare',
              isOnline: profile.is_online || false,
              lastSeen: formatDate(new Date(profile.last_seen || Date.now())),
              isAdmin: profile.is_admin || false,
              avatar: profile.avatar || undefined,
              apartment: profile.apartment || undefined,
              lastMessage
            };
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error: any) {
        console.error('Fel vid hämtning av användare:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta användarlista. Försök igen senare.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [navigate, toast]);
  
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const day = 24 * 60 * 60 * 1000;
    
    if (diff < day) {
      return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * day) {
      const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'numeric' });
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 animate-in">Direktmeddelanden</h1>
        
        <div className="mb-6 animate-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök användare..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Laddar användare...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-1">
              {filteredUsers.map(user => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start px-2 py-3 h-auto animate-in"
                  onClick={() => navigate(`/messages/${user.id}`)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className={user.isOnline ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {user.lastMessage && formatTimestamp(user.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.lastMessage?.text || "Ingen konversation ännu"}
                      </p>
                    </div>
                    
                    {user.isOnline && (
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Inga användare hittades</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `Inga användare matchade söktermen "${searchTerm}"`
                  : "Det finns inga användare att visa ännu."}
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
};

export default Messages;
