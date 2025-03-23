
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MessageList, { Message } from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Users } from 'lucide-react';
import { 
  Sheet, 
  SheetClose, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import UserItem, { User } from '@/components/UserItem';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Sample data for demonstration
const chatData = {
  '1': {
    id: '1',
    title: 'Allmänt',
    description: 'Chattrum för allmänna diskussioner',
    type: 'group' as const,
    members: [
      { id: '1', name: 'Anna Lindberg', isOnline: true, isAdmin: true, lastSeen: 'Nu' },
      { id: '2', name: 'Erik Holm', isOnline: true, lastSeen: 'Nu' },
      { id: '3', name: 'Sofia Chen', isOnline: false, lastSeen: 'För 40 min sedan' },
      { id: '4', name: 'Johan Bergman', isOnline: false, lastSeen: 'För 2 tim sedan' },
      { id: '5', name: 'Maria Andersson', isOnline: false, lastSeen: 'För 1 dag sedan' },
      { id: '6', name: 'Karl Svensson', isOnline: false, lastSeen: 'För 2 dagar sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Hej alla tillsammans! Välkomna till vår nya kommunikationsapp för BRF Humlan4.',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 30 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Tack! Ser riktigt bra ut detta. Kommer bli enklare att hålla kontakten.',
        sender: { id: '2', name: 'Erik Holm' },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 25 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Perfekt! Har någon en borrmaskin att låna ut till helgen förresten?',
        sender: { id: '3', name: 'Sofia Chen' },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '4',
        text: 'Jag har en, Sofia. Du kan komma förbi och hämta den när det passar.',
        sender: { id: '4', name: 'Johan Bergman' },
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '3',
          text: 'Perfekt! Har någon en borrmaskin att låna ut till helgen förresten?',
          sender: { id: '3', name: 'Sofia Chen' }
        }
      },
      {
        id: '5',
        text: 'Tack Johan! Jag kommer förbi imorgon förmiddag om det funkar för dig?',
        sender: { id: '3', name: 'Sofia Chen' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '4',
          text: 'Jag har en, Sofia. Du kan komma förbi och hämta den när det passar.',
          sender: { id: '4', name: 'Johan Bergman' }
        }
      },
      {
        id: '6',
        text: 'Absolut, jag är hemma hela dagen.',
        sender: { id: '4', name: 'Johan Bergman' },
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '5',
          text: 'Tack Johan! Jag kommer förbi imorgon förmiddag om det funkar för dig?',
          sender: { id: '3', name: 'Sofia Chen' }
        }
      },
      {
        id: '7',
        text: 'Förresten, när är nästa styrelsemöte planerat?',
        sender: { id: '5', name: 'Maria Andersson' },
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '8',
        text: 'Det är den 15:e kl 18:00 i föreningslokalen. Det kommer finnas fika!',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '7',
          text: 'Förresten, när är nästa styrelsemöte planerat?',
          sender: { id: '5', name: 'Maria Andersson' }
        }
      },
      {
        id: '9',
        text: 'Kan någon hjälpa mig med att flytta ett skåp på lördag? Det är ganska tungt.',
        sender: { id: '6', name: 'Karl Svensson' },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isMe: false
      },
      {
        id: '10',
        text: 'Jag kan hjälpa till på eftermiddagen, Karl. Runt klockan 15?',
        sender: { id: '2', name: 'Erik Holm' },
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '9',
          text: 'Kan någon hjälpa mig med att flytta ett skåp på lördag? Det är ganska tungt.',
          sender: { id: '6', name: 'Karl Svensson' }
        }
      },
      {
        id: '11',
        text: 'Perfekt, tack Erik! Jag bjuder på fika efteråt.',
        sender: { id: '6', name: 'Karl Svensson' },
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        isMe: false,
        replyTo: {
          id: '10',
          text: 'Jag kan hjälpa till på eftermiddagen, Karl. Runt klockan 15?',
          sender: { id: '2', name: 'Erik Holm' }
        }
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Trädgårdsgruppen',
    description: 'Planering och diskussioner för trädgårdsarbete',
    type: 'topic' as const,
    members: [
      { id: '1', name: 'Anna Lindberg', isOnline: true, isAdmin: true, lastSeen: 'Nu' },
      { id: '2', name: 'Erik Holm', isOnline: true, lastSeen: 'Nu' },
      { id: '3', name: 'Sofia Chen', isOnline: false, lastSeen: 'För 40 min sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Vi behöver planera sommarens planteringar. Har ni några förslag?',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Jag tycker vi ska plantera fler kryddväxter i år. Rosmarin, timjan och basilika kanske?',
        sender: { id: '3', name: 'Sofia Chen' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Bra idé! Jag kan hjälpa till på söndag istället för lördag om det funkar för alla.',
        sender: { id: '2', name: 'Erik Holm' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isMe: false
      },
    ]
  },
  '3': {
    id: '3',
    title: 'Fest & Aktiviteter',
    description: 'Planering av föreningens sociala aktiviteter',
    type: 'topic' as const,
    members: [
      { id: '1', name: 'Anna Lindberg', isOnline: true, isAdmin: true, lastSeen: 'Nu' },
      { id: '3', name: 'Sofia Chen', isOnline: false, lastSeen: 'För 40 min sedan' },
      { id: '5', name: 'Maria Andersson', isOnline: false, lastSeen: 'För 1 dag sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Midsommarfesten är planerad till den 21 juni i år, hur många kan delta?',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Jag och min familj kommer! Vi blir 4 personer.',
        sender: { id: '5', name: 'Maria Andersson' },
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Vi ska ha en planeringsträff på måndag kl 18. Kan någon ta med fika?',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isMe: false
      },
    ]
  },
  '4': {
    id: '4',
    title: 'Renovering',
    description: 'Diskussioner kring fasad- och trapphusrenovering',
    type: 'topic' as const,
    members: [
      { id: '1', name: 'Anna Lindberg', isOnline: true, isAdmin: true, lastSeen: 'Nu' },
      { id: '2', name: 'Erik Holm', isOnline: true, lastSeen: 'Nu' },
      { id: '4', name: 'Johan Bergman', isOnline: false, lastSeen: 'För 2 tim sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Vi behöver diskutera entreprenörens förslag till renoveringsplan.',
        sender: { id: '1', name: 'Anna Lindberg' },
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Har alla fått offerten som skickades i förra veckan?',
        sender: { id: '4', name: 'Johan Bergman' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Mötet med entreprenören är på måndag kl 14:00 i föreningslokalen.',
        sender: { id: '4', name: 'Johan Bergman' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isMe: false
      },
    ]
  },
  '5': {
    id: '5',
    title: 'Teknik & Wifi',
    description: 'Hjälp med tekniska problem och diskussioner',
    type: 'topic' as const,
    members: [
      { id: '2', name: 'Erik Holm', isOnline: true, lastSeen: 'Nu' },
      { id: '4', name: 'Johan Bergman', isOnline: false, lastSeen: 'För 2 tim sedan' },
      { id: '6', name: 'Karl Svensson', isOnline: false, lastSeen: 'För 2 dagar sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Någon som vet hur man fixar en router som tappar anslutningen?',
        sender: { id: '6', name: 'Karl Svensson' },
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Prova att starta om den och se om det hjälper först.',
        sender: { id: '2', name: 'Erik Holm' },
        timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Har installerat en ny router i källaren för bättre täckning.',
        sender: { id: '2', name: 'Erik Holm' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isMe: false
      },
    ]
  },
  '6': {
    id: '6',
    title: 'Köp & Sälj',
    description: 'Saker att sälja eller köpa inom föreningen',
    type: 'topic' as const,
    members: [
      { id: '1', name: 'Anna Lindberg', isOnline: true, isAdmin: true, lastSeen: 'Nu' },
      { id: '3', name: 'Sofia Chen', isOnline: false, lastSeen: 'För 40 min sedan' },
      { id: '5', name: 'Maria Andersson', isOnline: false, lastSeen: 'För 1 dag sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Jag har en cykel att sälja. Vuxenstorlek, knappt använd.',
        sender: { id: '3', name: 'Sofia Chen' },
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Har någon intresse av en bokhylla? Den är i bra skick.',
        sender: { id: '5', name: 'Maria Andersson' },
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isMe: false
      }
    ]
  },
  '7': {
    id: '7',
    title: 'Husdjur',
    description: 'För alla som har eller gillar husdjur',
    type: 'topic' as const,
    members: [
      { id: '3', name: 'Sofia Chen', isOnline: false, lastSeen: 'För 40 min sedan' },
      { id: '5', name: 'Maria Andersson', isOnline: false, lastSeen: 'För 1 dag sedan' },
    ],
    messages: [
      {
        id: '1',
        text: 'Någon som kan rekommendera en bra veterinär i närheten?',
        sender: { id: '5', name: 'Maria Andersson' },
        timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '2',
        text: 'Djurkliniken på Storgatan är bra! Dr. Andersson där är fantastisk med katter.',
        sender: { id: '3', name: 'Sofia Chen' },
        timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        isMe: false
      },
      {
        id: '3',
        text: 'Någon som kan hundvakta i helgen?',
        sender: { id: '5', name: 'Maria Andersson' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isMe: false
      },
    ]
  }
};

// Deep clone function to avoid mutating original data
const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use a local copy of the chat data to avoid mutating the original
  const [chats, setChats] = useState(() => deepClone(chatData));
  
  const chat = chatId && chats[chatId];
  const [messages, setMessages] = useState<Message[]>(
    chatId && chat ? chat.messages : []
  );
  
  if (!chat) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Chattrum hittades inte</h2>
            <p className="text-muted-foreground mb-4">
              Det chattrum du försöker nå finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate('/chats')}>
              Tillbaka till chattar
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
    
    // Add message immediately
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Generate a reply after a short delay
    const responseTimeout = setTimeout(() => {
      // Select a random member to respond
      const availableMembers = chat.members.filter(m => m.id !== 'me');
      const respondingMember = availableMembers[Math.floor(Math.random() * availableMembers.length)];
      
      // Create a reply that references the user's message
      const responseMessage: Message = {
        id: `response-${Date.now()}`,
        text: generateResponseText(text, chat.id, respondingMember.name),
        sender: {
          id: respondingMember.id,
          name: respondingMember.name,
          avatar: respondingMember.avatar
        },
        timestamp: new Date(),
        isMe: false,
        replyTo: {
          id: newMessage.id,
          text: newMessage.text,
          sender: newMessage.sender
        }
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
      
      // Show toast notification
      toast({
        title: `Nytt meddelande från ${respondingMember.name}`,
        description: responseMessage.text.substring(0, 60) + (responseMessage.text.length > 60 ? "..." : ""),
      });
      
      // Update the chat data
      if (chatId) {
        setChats(prevChats => {
          const updatedChats = { ...prevChats };
          updatedChats[chatId].messages = [...messages, newMessage, responseMessage];
          return updatedChats;
        });
      }
      
      // Sometimes add a second reply from another member
      if (Math.random() > 0.6) {
        setTimeout(() => {
          const otherMembers = availableMembers.filter(m => m.id !== respondingMember.id);
          const secondRespondingMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
          
          const secondResponseMessage: Message = {
            id: `response-2-${Date.now()}`,
            text: generateSecondResponseText(responseMessage.text, chat.id, secondRespondingMember.name),
            sender: {
              id: secondRespondingMember.id,
              name: secondRespondingMember.name,
              avatar: secondRespondingMember.avatar
            },
            timestamp: new Date(),
            isMe: false,
            replyTo: {
              id: responseMessage.id,
              text: responseMessage.text,
              sender: responseMessage.sender
            }
          };
          
          setMessages(prevMessages => [...prevMessages, secondResponseMessage]);
          
          // Show toast notification
          toast({
            title: `Nytt meddelande från ${secondRespondingMember.name}`,
            description: secondResponseMessage.text.substring(0, 60) + (secondResponseMessage.text.length > 60 ? "..." : ""),
          });
          
          // Update the chat data
          if (chatId) {
            setChats(prevChats => {
              const updatedChats = { ...prevChats };
              updatedChats[chatId].messages = [...updatedChats[chatId].messages, secondResponseMessage];
              return updatedChats;
            });
          }
        }, 2000 + Math.random() * 3000);
      }
    }, 1000 + Math.random() * 1500);
    
    return () => clearTimeout(responseTimeout);
  };

  // Helper function to generate contextual responses based on chat room and message content
  const generateResponseText = (originalMessage: string, roomId: string, responderName: string): string => {
    // Common responses that could fit in any context
    const genericResponses = [
      `Tack för ditt meddelande! Det var intressant att läsa.`,
      `Bra poäng, jag håller med dig.`,
      `Det låter som en bra idé!`,
      `Tack för att du delar med dig.`,
      `Jag förstår vad du menar, tack för förtydligandet.`
    ];
    
    // Check for common questions or keywords
    if (originalMessage.toLowerCase().includes('när') || originalMessage.toLowerCase().includes('tid')) {
      return `Vi behöver nog bestämma en tid som funkar för de flesta. Hur ser det ut för dig nästa vecka?`;
    }
    
    if (originalMessage.toLowerCase().includes('hjälp') || originalMessage.toLowerCase().includes('hjälpa')) {
      return `Jag kan hjälpa till! När behöver du hjälp?`;
    }
    
    if (originalMessage.toLowerCase().includes('möte')) {
      return `Ja, angående mötet så tror jag att vi behöver förbereda lite mer material först.`;
    }
    
    // Room-specific responses
    if (roomId === '1') { // Allmänt
      const responses = [
        `Det är alltid trevligt med allmänna diskussioner i föreningen!`,
        `Bra att du tar upp det här i allmänna kanalen så att alla kan delta.`,
        `Vi borde kanske diskutera detta vidare på nästa föreningsmöte?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (roomId === '2') { // Trädgårdsgruppen
      const responses = [
        `Intressant förslag för trädgården! Jag tror vi kan planera in det till våren.`,
        `Vi behöver fler frivilliga till trädgårdsarbetet, bra att du är engagerad!`,
        `Jag såg några fina växter på plantskolan igår som skulle passa perfekt i vår trädgård.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (roomId === '3') { // Fest & Aktiviteter
      const responses = [
        `Det låter som en rolig aktivitet! Jag kan hjälpa till med planeringen.`,
        `Vi borde definitivt ha fler sociala evenemang i föreningen.`,
        `Kanske vi kan kombinera detta med sommarfesten?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default to a generic response if nothing specific matches
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };
  
  // Helper function to generate a second response that builds on the first response
  const generateSecondResponseText = (firstResponse: string, roomId: string, responderName: string): string => {
    // Responses that build on other messages
    const followUpResponses = [
      `Jag håller med ${firstResponse.split(' ')[0]} och vill tillägga att vi kanske borde ta upp detta på nästa möte.`,
      `Bra poäng! Jag tror också att vi behöver tänka långsiktigt här.`,
      `Det där låter vettigt. Kan vi schemalägga det snart?`,
      `Absolut, jag kan också hjälpa till med detta!`,
      `Jag har också funderat på det där faktiskt. Vi borde samordna oss bättre.`
    ];
    
    return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat header */}
        <div className="border-b p-3 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/chats')}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <h2 className="font-medium text-lg leading-tight">{chat.title}</h2>
              {chat.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {chat.description}
                </p>
              )}
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Chat Info</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{chat.title}</SheetTitle>
                  <SheetDescription>
                    {chat.description}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4">
                  <h3 className="flex items-center gap-2 font-medium mb-2">
                    <Users className="h-4 w-4" /> Medlemmar ({chat.members.length})
                  </h3>
                  
                  <ScrollArea className="h-[50vh]">
                    <div className="space-y-1 pr-3">
                      {chat.members.map(member => (
                        <UserItem 
                          key={member.id} 
                          user={member}
                          onClick={() => {
                            navigate(`/messages/${member.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  <SheetClose asChild>
                    <Button className="w-full" variant="outline">
                      Stäng
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
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

export default Chat;
