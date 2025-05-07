
import React from 'react';
import Navbar from '@/components/Navbar';
import AnnouncementSection from '@/components/dashboard/AnnouncementSection';
import ChatSection from '@/components/dashboard/ChatSection';
import MembersSidebar from '@/components/dashboard/MembersSidebar';
import { announcements, activeMembers, upcomingEvents } from '@/components/dashboard/DashboardData';
import { useChatRooms } from '@/hooks/useChatRooms';

const Dashboard = () => {
  // Fetch recent chats using the hook
  const { recentChats, isLoading } = useChatRooms(3); // Limit to 3 chats for the sidebar
  
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
          
          {/* Sidebar column - now with recentChats passed */}
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
