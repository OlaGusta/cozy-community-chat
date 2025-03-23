
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/components/UserItem';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for demonstration
const usersData: {[key: string]: User} = {
  '1': {
    id: '1',
    name: 'Anna Lindberg',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu'
  },
  '2': {
    id: '2',
    name: 'Erik Holm',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu'
  },
  '3': {
    id: '3',
    name: 'Sofia Chen',
    isOnline: false,
    lastSeen: 'För 40 min sedan'
  },
  '4': {
    id: '4',
    name: 'Johan Bergman',
    isOnline: false,
    lastSeen: 'För 2 tim sedan'
  }
};

const conversations: {[key: string]: Message[]} = {
  '1': [
    {
      id: '1',
      text: 'Hej! Har du möjlighet att delta i styrelsemötet på tisdag?',
      sender: { id: '1', name: 'Anna Lindberg' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isMe: false
    },
    {
      id: '2',
      text: 'Ja, jag kan delta. Vad är agendan för mötet?',
      sender: { id: 'me', name: 'Du' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      isMe: true
    },
    {
      id: '3',
      text: 'Vi ska diskutera budgeten för nästa år och planera höstens aktiviteter. Mötet börjar kl 18:00.',
      sender: { id: '1', name: 'Anna Lindberg' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
      isMe: false
    },
    {
      id: '4',
      text: 'Perfekt, jag kommer vara där!',
      sender: { id: 'me', name: 'Du' },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000),
      isMe: true
    }
  ],
  '2': [
    {
      id: '1',
      text: 'Hej! Jag såg att du hade lagt upp förslag om trädgårdsgruppen. Jag är intresserad!',
      sender: { id: '2', name: 'Erik Holm' },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isMe: false
    },
    {
      id: '2',
      text: 'Kul att höra! Vi behöver verkligen fler deltagare.',
      sender: { id: 'me', name: 'Du' },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      isMe: true
    },
    {
      id: '3',
      text: 'När träffas ni nästa gång?',
      sender: { id: '2', name: 'Erik Holm' },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
      isMe: false
    }
  ],
  '3': [
    {
      id: '1',
      text: 'Hej! Tack för hjälpen med att låna ut borrhammaren igår!',
      sender: { id: 'me', name: 'Du' },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isMe: true
    },
    {
      id: '2',
      text: 'Inga problem! Fick du gjort det du behövde?',
      sender: { id: '3', name: 'Sofia Chen' },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
      isMe: false
    },
    {
      id: '3',
      text: 'Ja, jag fick upp alla hyllor. Det gick mycket snabbare med en bra borrmaskin!',
      sender: { id: 'me', name: 'Du' },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      isMe: true
    }
  ]
};

const DirectMessage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(
    userId && conversations[userId] ? conversations[userId] : []
  );
  
  const user = userId && usersData[userId];
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Användaren hittades inte</h2>
            <p className="text-muted-foreground mb-4">
              Den användare du försöker nå finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate('/members')}>
              Tillbaka till medlemslistan
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      text,
      sender: {
        id: 'me',
        name: 'Du'
      },
      timestamp: new Date(),
      isMe: true
    };
    
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat header */}
        <div className="border-b p-3 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/members')}
                className="md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-medium leading-none">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {user.isOnline ? 'Online' : `Senast sedd: ${user.lastSeen}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Ring</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Video className="h-5 w-5" />
                <span className="sr-only">Videosamtal</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Mer</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Alternativ</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> Ring
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Video className="mr-2 h-4 w-4" /> Videosamtal
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Info className="mr-2 h-4 w-4" /> Visa profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} />
        </div>
        
        {/* Message input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default DirectMessage;
