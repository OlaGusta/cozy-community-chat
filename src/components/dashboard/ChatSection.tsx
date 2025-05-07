
import React from 'react';
import ChatTabs from './chat/ChatTabs';
import { useChatRooms } from '@/hooks/useChatRooms';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface ChatSectionProps {
  upcomingEvents: EventItem[];
}

const ChatSection: React.FC<ChatSectionProps> = ({ upcomingEvents }) => {
  const { recentChats, isLoading } = useChatRooms(3);

  return (
    <ChatTabs
      recentChats={recentChats}
      upcomingEvents={upcomingEvents}
      isLoading={isLoading}
    />
  );
};

export default ChatSection;
