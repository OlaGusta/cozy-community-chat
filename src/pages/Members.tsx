
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import UserItem, { User } from '@/components/UserItem';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

const Members = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        const formattedUsers: User[] = profiles.map((profile: Profile) => ({
          id: profile.id,
          name: profile.name || 'Okänd användare',
          apartment: profile.apartment || '',
          isAdmin: profile.is_admin || false,
          isOnline: profile.is_online || false,
          lastSeen: formatLastSeen(profile.last_seen),
          email: profile.email || '',
          avatar: profile.avatar || undefined
        }));

        setUsers(formattedUsers);
      } catch (error: any) {
        console.error('Fel vid hämtning av användare:', error);
        toast({
          title: 'Ett fel uppstod',
          description: 'Kunde inte hämta medlemmar. Försök igen senare.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.apartment && user.apartment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Medlemmar</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök efter namn eller lägenhetsnummer..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Laddar medlemmar...</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
            <div className="p-4 space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={user.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <UserItem user={user} showStatus />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-medium">Inga medlemmar hittades</p>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Det finns inga medlemmar som matchar "${searchTerm}"`
                      : "Det finns inga medlemmar att visa."}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
};

export default Members;
