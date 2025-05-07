
import React from 'react';
import Navbar from '@/components/Navbar';
import { MessageSquare } from 'lucide-react';
import { useChatRoomsManager } from '@/hooks/useChatRoomsManager';
import ChatRoomSearch from '@/components/chat-rooms/ChatRoomSearch';
import CreateChatRoomDialog from '@/components/chat-rooms/CreateChatRoomDialog';
import ChatRoomTabs from '@/components/chat-rooms/ChatRoomTabs';

const ChatRooms = () => {
  const {
    searchTerm,
    setSearchTerm,
    activeId,
    isLoading,
    isAdmin,
    filteredChats,
    groupChats,
    topicChats,
    addNewChat
  } = useChatRoomsManager();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <MessageSquare className="h-6 w-6" /> Gruppchattar
          </h1>
          
          {/* Always show create button temporarily for testing */}
          {(isAdmin || true) && (
            <CreateChatRoomDialog onChatCreated={addNewChat} />
          )}
        </div>
        
        <ChatRoomSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <ChatRoomTabs
          isLoading={isLoading}
          filteredChats={filteredChats}
          groupChats={groupChats}
          topicChats={topicChats}
          activeId={activeId}
          searchTerm={searchTerm}
        />
      </main>
    </div>
  );
};

export default ChatRooms;
