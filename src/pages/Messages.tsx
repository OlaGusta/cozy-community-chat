
import React from 'react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import ChatControls from '@/components/ChatControls';
import MessagesList from '@/components/messages/MessagesList';
import SearchInput from '@/components/messages/SearchInput';
import { useMessages } from '@/hooks/useMessages';

const Messages = () => {
  const { toast } = useToast();
  const { users, isLoading, searchTerm, setSearchTerm } = useMessages();

  const handleImageUpload = (imageFile: File) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageUrl = reader.result as string;
      // Here you would typically upload to storage and then store in database
      // For now, we just show a toast to confirm the action
      toast({
        title: "Bild uppladdad",
        description: "Bilden har laddats upp och kan nu användas i konversationen.",
      });
    };
    
    reader.onerror = () => {
      toast({
        title: "Fel vid uppladdning",
        description: "Det uppstod ett problem vid uppladdning av bilden.",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(imageFile);
  };

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    toast({
      title: "Fil uppladdad",
      description: `${file.name} har laddats upp och kan nu laddas ned.`,
    });
    // could upload to storage here
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
        <ChatControls onSendImage={handleImageUpload} onSendFile={handleFileUpload} />
      </div>
    </div>
  );
};

export default Messages;
