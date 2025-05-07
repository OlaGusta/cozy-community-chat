
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AnnouncementSection from '@/components/dashboard/AnnouncementSection';
import ChatSection from '@/components/dashboard/ChatSection';
import MembersSidebar from '@/components/dashboard/MembersSidebar';
import { announcements, activeMembers, upcomingEvents } from '@/components/dashboard/DashboardData';
import { supabase } from '@/integrations/supabase/client';
import { Chat } from '@/components/ChatList';

const Dashboard = () => {
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  
  // Fetch chat rooms to pass to sidebar for quick actions
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const { data } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (data) {
          const formattedChats = data.map(room => ({
            id: room.id,
            title: room.name
          }));
          
          setRecentChats(formattedChats);
        }
      } catch (error) {
        console.error('Error fetching chat rooms for sidebar:', error);
      }
    };
    
    fetchChatRooms();
  }, []);

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
          
          {/* Sidebar column */}
          <MembersSidebar 
            activeMembers={activeMembers}
            recentChats={recentChats}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
