
import React from 'react';
import Navbar from '@/components/Navbar';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { useChatRoomsManager } from '@/hooks/useChatRoomsManager';
import ChatRoomSearch from '@/components/chat-rooms/ChatRoomSearch';
import CreateChatRoomDialog from '@/components/chat-rooms/CreateChatRoomDialog';
import ChatRoomTabs from '@/components/chat-rooms/ChatRoomTabs';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Chat } from '@/components/ChatList';
import { useNavigate } from 'react-router-dom';

const ChatRooms = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    activeId,
    isLoading,
    isAdmin,
    filteredChats,
    groupChats,
    topicChats,
    addNewChat,
    deleteChatRoom
  } = useChatRoomsManager();

  const handleChatClick = (chat: Chat) => {
    navigate(`/chat/${chat.id}`);
  };
  
  // Render each chat item with delete button
  const renderChatItem = (chat: Chat) => (
    <div key={chat.id} className="flex justify-between items-center p-3 hover:bg-muted rounded-lg">
      <div 
        className="flex-1 cursor-pointer" 
        onClick={() => handleChatClick(chat)}
      >
        <h3 className="font-medium">{chat.title}</h3>
        {chat.description && (
          <p className="text-sm text-muted-foreground">{chat.description}</p>
        )}
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort chattrum?</AlertDialogTitle>
            <AlertDialogDescription>
              Är du säker på att du vill ta bort "{chat.title}"? Detta kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteChatRoom(chat.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 animate-in">
            <MessageSquare className="h-6 w-6" /> Gruppchattar
          </h1>
          
          <CreateChatRoomDialog onChatCreated={addNewChat}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nytt chattrum
            </Button>
          </CreateChatRoomDialog>
        </div>
        
        <ChatRoomSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        {/* Custom rendering of chat rooms with delete functionality */}
        <div className="mt-6 space-y-6">
          {isLoading ? (
            <p className="text-center py-4 text-muted-foreground">Laddar chattar...</p>
          ) : (
            <>
              {searchTerm ? (
                <div>
                  <h2 className="text-lg font-medium mb-2">Sökresultat</h2>
                  {filteredChats.length > 0 ? (
                    <div className="space-y-2">
                      {filteredChats.map(renderChatItem)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Inga chattar matchade din sökning.</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Group chats section */}
                  <div>
                    <h2 className="text-lg font-medium mb-2">Grupp chattar</h2>
                    {groupChats.length > 0 ? (
                      <div className="space-y-2">
                        {groupChats.map(renderChatItem)}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Inga gruppchattar tillgängliga.</p>
                    )}
                  </div>
                  
                  {/* Topic chats section */}
                  <div>
                    <h2 className="text-lg font-medium mb-2">Ämnen</h2>
                    {topicChats.length > 0 ? (
                      <div className="space-y-2">
                        {topicChats.map(renderChatItem)}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Inga ämnen tillgängliga.</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatRooms;
