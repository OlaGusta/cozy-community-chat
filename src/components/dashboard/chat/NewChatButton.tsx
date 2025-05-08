
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateChatRoomDialog from '@/components/chat-rooms/CreateChatRoomDialog';
import { Chat } from '@/components/ChatList';

const NewChatButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleChatCreated = (newChat: Chat) => {
    // Navigate to the new chat room
    navigate(`/chat/${newChat.id}`);
  };
  
  return (
    <CreateChatRoomDialog onChatCreated={handleChatCreated} />
  );
};

export default NewChatButton;
