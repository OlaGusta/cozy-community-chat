
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search, MessageSquare, Users, EyeIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';

interface ChatData {
  id: string;
  title: string;
  type: string;
  members: number;
  messageCount: number;
  lastActivity: string;
}

interface DirectMessageData {
  id: string;
  users: { id: string; name: string }[];
  messageCount: number;
  lastActivity: string;
}

interface ChatsTabProps {
  chats: ChatData[];
  directMessages: DirectMessageData[];
}

const ChatsTab: React.FC<ChatsTabProps> = ({ chats, directMessages }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDirectMessages = directMessages.filter(dm => 
    dm.users.some(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök konversationer..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gruppchatter</CardTitle>
            <CardDescription>Chattrum för alla medlemmar</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-32rem)]">
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                  >
                    <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {chat.lastActivity}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{chat.members} medlemmar</span>
                        <span className="mx-1">•</span>
                        <span>{chat.messageCount} meddelanden</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">Visa</span>
                    </Button>
                  </div>
                ))}
                
                {filteredChats.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Inga gruppchatter hittades
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Direktmeddelanden</CardTitle>
            <CardDescription>Privata konversationer mellan medlemmar</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-32rem)]">
              <div className="space-y-2">
                {filteredDirectMessages.map((dm) => (
                  <div 
                    key={dm.id} 
                    className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate(`/messages/${dm.users[1].id}`)}
                  >
                    <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">
                          {dm.users.map(u => u.name).join(' & ')}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {dm.lastActivity}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{dm.messageCount} meddelanden</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">Visa</span>
                    </Button>
                  </div>
                ))}
                
                {filteredDirectMessages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Inga direktmeddelanden hittades
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatsTab;
