
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageListItem, { UserWithLastMessage } from './MessageListItem';

interface MessagesListProps {
  users: UserWithLastMessage[];
  searchTerm: string;
  isLoading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({ users, searchTerm, isLoading }) => {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Laddar användare...</p>
      </div>
    );
  }
  
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Inga användare hittades</h3>
        <p className="text-muted-foreground">
          {searchTerm 
            ? `Inga användare matchade söktermen "${searchTerm}"`
            : "Det finns inga användare att visa ännu."}
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-1">
        {filteredUsers.map(user => (
          <MessageListItem key={user.id} user={user} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
