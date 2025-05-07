
import React from 'react';
import { CalendarClock } from 'lucide-react';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface EventsListProps {
  events: EventItem[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      {events.map(event => (
        <div 
          key={event.id}
          className="flex gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
        >
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg">
            <CalendarClock className="h-6 w-6" />
          </div>
          
          <div>
            <h3 className="font-medium">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {event.date} • {event.time}
            </p>
            <p className="text-sm">{event.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
