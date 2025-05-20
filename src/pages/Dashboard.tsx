
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnnouncementSection from '@/components/dashboard/AnnouncementSection';
import ChatSection from '@/components/dashboard/ChatSection';
import MembersSidebar from '@/components/dashboard/MembersSidebar';
import { Announcement } from '@/components/AnnouncementCard';
import { User } from '@/components/UserItem';
import { useChatRooms } from '@/hooks/useChatRooms';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  // State for data
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch recent chats using the hook
  const { recentChats, isLoading: isLoadingChats } = useChatRooms(3);
  
  // Fetch announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*, sender:sender_id(id, name)')
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (error) throw error;
        
        if (data) {
          const formattedAnnouncements: Announcement[] = data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            sender: {
              id: item.sender?.id || '',
              name: item.sender?.name || 'System',
              role: 'Admin'
            },
            timestamp: new Date(item.created_at || Date.now()),
            important: item.important || false
          }));
          
          setAnnouncements(formattedAnnouncements);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    
    fetchAnnouncements();
  }, []);
  
  // Fetch active members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('is_online', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        
        if (data) {
          const formattedMembers: User[] = data.map(profile => ({
            id: profile.id,
            name: profile.name || 'Unnamed User',
            isOnline: profile.is_online || false,
            isAdmin: profile.is_admin || false,
            lastSeen: formatLastSeen(profile.last_seen),
            apartment: profile.apartment || '',
            avatar: profile.avatar
          }));
          
          setMembers(formattedMembers);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    
    fetchMembers();
  }, []);
  
  // Format the last_seen timestamp
  const formatLastSeen = (timestamp: string | null): string => {
    if (!timestamp) return 'Aldrig';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 5) {
      return 'Nu';
    } else if (diffMins < 60) {
      return `För ${diffMins} min sedan`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `För ${hours} tim sedan`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `För ${days} dag${days > 1 ? 'ar' : ''} sedan`;
    }
  };
  
  // Sample upcoming events - in a real app, this would come from a database
  const upcomingEvents = [
    {
      id: '1',
      title: 'Städdag',
      date: 'Lördag, 15 juni',
      time: '10:00 - 14:00',
      location: 'Gården'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 animate-in">Välkommen till BRF Humlan4</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2 space-y-6">
            <AnnouncementSection announcements={announcements} />
            <ChatSection upcomingEvents={upcomingEvents} />
          </div>
          
          {/* Sidebar column - now with real members data */}
          <MembersSidebar 
            activeMembers={members}
            recentChats={recentChats || []}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
