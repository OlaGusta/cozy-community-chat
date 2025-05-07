
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CalendarClock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentChatList from './RecentChatList';
import EventsList, { EventItem } from './EventsList';
import { Chat } from '@/components/ChatList';

interface ChatTabsProps {
  recentChats: Chat[];
  upcomingEvents: EventItem[];
  isLoading: boolean;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ recentChats, upcomingEvents, isLoading }) => {
  const navigate = useNavigate();
  
  return (
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
            <RecentChatList chats={recentChats} isLoading={isLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="events" className="m-0">
        <Card>
          <CardContent className="p-4">
            <EventsList events={upcomingEvents} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ChatTabs;
