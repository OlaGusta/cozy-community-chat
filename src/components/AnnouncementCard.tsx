
import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  timestamp: Date;
  important?: boolean;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ 
  announcement,
  className 
}) => {
  const { title, content, sender, timestamp, important } = announcement;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      important && "ring-2 ring-brand-accent",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {important && (
            <Badge className="bg-brand-accent">Viktigt</Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <span>{format(timestamp, 'PPp', { locale: sv })}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 text-sm whitespace-pre-line">
        {content}
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {sender.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{sender.name}</span>
          {sender.role && (
            <span className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
              {sender.role}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnnouncementCard;
