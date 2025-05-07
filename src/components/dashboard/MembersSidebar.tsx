
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Bell } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserItem, { User } from '@/components/UserItem';
import RecentChatList from '@/components/dashboard/chat/RecentChatList';
import { Chat } from '@/components/ChatList';

interface MembersSidebarProps {
  activeMembers: User[];
  recentChats: Chat[];
}

const MembersSidebar: React.FC<MembersSidebarProps> = ({ activeMembers, recentChats }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Active members */}
      <Card className="animate-in">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Medlemmar
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => navigate('/members')}>
            Visa alla
          </Button>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-1">
            {activeMembers.map(member => (
              <UserItem 
                key={member.id} 
                user={member} 
                onClick={() => navigate(`/messages/${member.id}`)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent chats section */}
      <Card className="animate-in">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Senaste chattar
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => navigate('/chats')}>
            Visa alla
          </Button>
        </CardHeader>
        <CardContent className="p-2">
          <RecentChatList chats={recentChats} isLoading={false} />
        </CardContent>
      </Card>
      
      {/* Quick actions */}
      <Card className="animate-in">
        <CardHeader className="pb-2">
          <CardTitle>Snabbåtgärder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => {
              // Use the first actual chat room ID if available, otherwise default to /chats
              if (recentChats && recentChats.length > 0) {
                navigate(`/chat/${recentChats[0].id}`);
              } else {
                navigate('/chats');
              }
            }}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Skriv i allmänna chatten
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/members')}
          >
            <Users className="mr-2 h-4 w-4" />
            Hitta en granne
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/announcements')}
          >
            <Bell className="mr-2 h-4 w-4" />
            Se alla meddelanden
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersSidebar;
