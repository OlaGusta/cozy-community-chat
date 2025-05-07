
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search, EyeIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/adminUtils';

interface MessageData {
  id: string;
  chatId: string;
  chatName: string;
  text: string;
  sender: { id: string; name: string };
  timestamp: Date;
  type: 'group' | 'direct';
}

interface MessagesTabProps {
  messages: MessageData[];
}

const MessagesTab: React.FC<MessagesTabProps> = ({ messages }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMessages = messages.filter(message => 
    message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök i meddelanden..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Senaste meddelanden</CardTitle>
          <CardDescription>Översikt över alla konversationer i appen</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    if (message.type === 'group') {
                      navigate(`/chat/${message.chatId}`);
                    } else {
                      navigate(`/messages/${message.sender.id}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="font-medium">{message.sender.name}</span>
                      <span className="mx-2 text-muted-foreground">i</span>
                      <span className="text-primary">{message.chatName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.text}</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <EyeIcon className="h-3 w-3 mr-1" /> Visa konversation
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Inga meddelanden hittades
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
