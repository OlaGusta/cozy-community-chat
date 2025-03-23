
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from '@/components/UserItem';
import { Search } from 'lucide-react';

// Sample data for demonstration (same as in DirectMessage.tsx)
const usersData: User[] = [
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
    isAdmin: true,
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

// Add some preview messages for each user
const lastMessages: {[key: string]: {text: string, timestamp: Date}} = {
  '1': {
    text: 'Vi ska diskutera budgeten för nästa år och planera höstens aktiviteter.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000)
  },
  '2': {
    text: 'När träffas ni nästa gång?',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000)
  },
  '3': {
    text: 'Inga problem! Fick du gjort det du behövde?',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
  },
  '4': {
    text: 'Jag ska kolla upp det och återkomma.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
};

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

const Messages = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredUsers = usersData.filter(user => 
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
          <div className="space-y-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
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
                          {lastMessages[user.id] && formatTimestamp(lastMessages[user.id].timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessages[user.id]?.text || "Ingen konversation ännu"}
                      </p>
                    </div>
                    
                    {user.isOnline && (
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                    )}
                  </div>
                </Button>
              ))
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
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Messages;
