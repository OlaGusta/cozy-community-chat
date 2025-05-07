
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ChatRoomSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ChatRoomSearch: React.FC<ChatRoomSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6 animate-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök gruppchattar..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatRoomSearch;
