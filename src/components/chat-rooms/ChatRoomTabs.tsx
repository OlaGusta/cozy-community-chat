
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatList, { Chat } from '@/components/ChatList';

interface ChatRoomTabsProps {
  isLoading: boolean;
  filteredChats: Chat[];
  groupChats: Chat[];
  topicChats: Chat[];
  activeId?: string;
  searchTerm: string;
}

const ChatRoomTabs: React.FC<ChatRoomTabsProps> = ({
  isLoading,
  filteredChats,
  groupChats,
  topicChats,
  activeId,
  searchTerm
}) => {
  // Helper function to render content based on loading state and available chats
  const renderChatContent = (chats: Chat[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <p>Laddar gruppchattar...</p>
        </div>
      );
    }
    
    return chats.length > 0 ? (
      <ChatList chats={chats} activeId={activeId} />
    ) : (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Inga gruppchattar hittades</h3>
        <p className="text-muted-foreground">
          {searchTerm 
            ? `Inga gruppchattar matchade söktermen "${searchTerm}"`
            : emptyMessage}
        </p>
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="animate-in">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Alla</TabsTrigger>
        <TabsTrigger value="group">Grupper</TabsTrigger>
        <TabsTrigger value="topic">Ämnen</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {renderChatContent(filteredChats, "Det finns inga gruppchattar att visa ännu.")}
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="group" className="mt-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {renderChatContent(groupChats, "Det finns inga gruppchattar att visa ännu.")}
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="topic" className="mt-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {renderChatContent(topicChats, "Det finns inga ämnen att visa ännu.")}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default ChatRoomTabs;
