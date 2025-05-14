
import React from 'react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import ChatControls from '@/components/ChatControls';
import MessagesList from '@/components/messages/MessagesList';
import SearchInput from '@/components/messages/SearchInput';
import { useMessages } from '@/hooks/useMessages';

const Messages = () => {
  const { toast } = useToast();
  const { users, isLoading, searchTerm, setSearchTerm } = useMessages();

  const handleImageUpload = (imageUrl: string) => {
    toast({
      title: "Funktionalitet kommer snart",
      description: "Bilduppladdning implementeras i nästa version.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 animate-in">Direktmeddelanden</h1>
        
        <div className="mb-6 animate-in">
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </div>
        
        <MessagesList 
          users={users} 
          searchTerm={searchTerm} 
          isLoading={isLoading} 
        />
      </main>
      
      <div className="fixed bottom-4 left-4">
        <ChatControls onSendImage={handleImageUpload} />
      </div>
    </div>
  );
};

export default Messages;
