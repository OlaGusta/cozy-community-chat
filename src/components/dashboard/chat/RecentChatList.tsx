
import React from 'react';
import ChatList, { Chat } from '@/components/ChatList';

interface RecentChatListProps {
  chats: Chat[];
  isLoading: boolean;
}

const RecentChatList: React.FC<RecentChatListProps> = ({ chats, isLoading }) => {
  if (isLoading) {
    return <p className="text-center py-4 text-muted-foreground">Laddar chattar...</p>;
  }

  return chats.length > 0 ? (
    <ChatList chats={chats} />
  ) : (
    <p className="text-center py-4 text-muted-foreground">Inga chattar tillgängliga</p>
  );
};

export default RecentChatList;
