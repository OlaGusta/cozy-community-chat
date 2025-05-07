
import { Announcement } from '@/components/AnnouncementCard';
import { User } from '@/components/UserItem';

// Sample announcements data
export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Städdag i helgen',
    content: 'Påminner om att vi har städdag på lördag 10:00. Alla medlemmar förväntas delta. Vi kommer att städa allmänna utrymmen och trädgården.\n\nVi bjuder på fika efteråt!',
    sender: {
      id: '1',
      name: 'Anna Lindberg',
      role: 'Ordförande'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    important: true
  },
  {
    id: '2',
    title: 'Renovering av entrén',
    content: 'Renoveringen av entrén kommer att påbörjas nästa vecka. Det kan medföra vissa störningar under dagtid.',
    sender: {
      id: '2',
      name: 'Erik Holm',
      role: 'Styrelsemedlem'
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  }
];

// Sample active members data
export const activeMembers: User[] = [
  {
    id: '1',
    name: 'Anna Lindberg',
    isOnline: true,
    isAdmin: true,
    lastSeen: 'Nu'
  },
  {
    id: '2',
    name: 'Erik Holm',
    isOnline: true,
    lastSeen: 'Nu'
  },
  {
    id: '3',
    name: 'Sofia Chen',
    isOnline: false,
    lastSeen: 'För 40 min sedan'
  },
  {
    id: '4',
    name: 'Johan Bergman',
    isOnline: false,
    lastSeen: 'För 2 tim sedan'
  }
];

// Sample upcoming events data
export const upcomingEvents = [
  {
    id: '1',
    title: 'Städdag',
    date: 'Lördag, 15 juni',
    time: '10:00 - 14:00',
    location: 'Gården'
  },
  {
    id: '2',
    title: 'Styrelsemöte',
    date: 'Onsdag, 19 juni',
    time: '18:30 - 20:00',
    location: 'Föreningslokalen'
  },
  {
    id: '3',
    title: 'Midsommarfest',
    date: 'Fredag, 21 juni',
    time: '15:00 - 22:00',
    location: 'Trädgården'
  }
];
