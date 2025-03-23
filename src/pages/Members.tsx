
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users } from 'lucide-react';
import UserItem, { User } from '@/components/UserItem';

// Sample data for demonstration
const users: User[] = [
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
  },
  {
    id: '5',
    name: 'Maria Andersson',
    isOnline: false,
    lastSeen: 'För 1 dag sedan'
  },
  {
    id: '6',
    name: 'Karl Svensson',
    isOnline: false,
    lastSeen: 'För 2 dagar sedan'
  },
  {
    id: '7',
    name: 'Åsa Nilsson',
    isOnline: false,
    lastSeen: 'För 5 dagar sedan'
  },
  {
    id: '8',
    name: 'Henrik Larsson',
    isOnline: false,
    lastSeen: 'För 1 vecka sedan'
  },
  {
    id: '9',
    name: 'Lena Pettersson',
    isOnline: false,
    lastSeen: 'För 1 vecka sedan'
  },
  {
    id: '10',
    name: 'Gustav Johansson',
    isOnline: false,
    lastSeen: 'För 2 veckor sedan'
  }
];

const Members = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const onlineUsers = filteredUsers.filter(user => user.isOnline);
  const offlineUsers = filteredUsers.filter(user => !user.isOnline);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <Users className="h-6 w-6" /> Medlemmar
          </h1>
        </div>
        
        <div className="mb-6 animate-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök medlemmar..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-16rem)] pr-3 animate-in">
          {onlineUsers.length > 0 && (
            <div className="mb-6">
              <h2 className="font-medium text-sm text-muted-foreground mb-2">
                Online ({onlineUsers.length})
              </h2>
              <div className="space-y-1">
                {onlineUsers.map(user => (
                  <UserItem 
                    key={user.id} 
                    user={user} 
                    onClick={() => navigate(`/messages/${user.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {offlineUsers.length > 0 && (
            <div>
              <h2 className="font-medium text-sm text-muted-foreground mb-2">
                Offline ({offlineUsers.length})
              </h2>
              <div className="space-y-1">
                {offlineUsers.map(user => (
                  <UserItem 
                    key={user.id} 
                    user={user} 
                    onClick={() => navigate(`/messages/${user.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Inga medlemmar hittades</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `Inga medlemmar matchade söktermen "${searchTerm}"`
                  : "Det finns inga medlemmar att visa ännu."}
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
};

export default Members;
