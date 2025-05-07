
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnnouncementCard, { Announcement } from '@/components/AnnouncementCard';

interface AnnouncementSectionProps {
  announcements: Announcement[];
}

const AnnouncementSection: React.FC<AnnouncementSectionProps> = ({ announcements }) => {
  const navigate = useNavigate();

  return (
    <Card className="animate-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Meddelanden
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => navigate('/announcements')}>
          Visa alla
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map(announcement => (
          <AnnouncementCard 
            key={announcement.id} 
            announcement={announcement} 
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default AnnouncementSection;
