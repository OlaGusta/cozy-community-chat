// Keep existing chat data
export const allChats = [
  {
    id: '1',
    title: 'Allmänt',
    type: 'group',
    members: 6,
    messageCount: 143,
    lastActivity: 'För 10 min sedan',
  },
  {
    id: '2',
    title: 'Trädgårdsgruppen',
    type: 'topic',
    members: 3,
    messageCount: 57,
    lastActivity: 'För 1 dag sedan',
  },
  {
    id: '3',
    title: 'Fest & Aktiviteter',
    type: 'topic',
    members: 3,
    messageCount: 22,
    lastActivity: 'För 2 dagar sedan',
  },
  {
    id: '4',
    title: 'Renovering',
    type: 'topic',
    members: 3,
    messageCount: 45,
    lastActivity: 'För 2 dagar sedan',
  },
  {
    id: '5',
    title: 'Teknik & Wifi',
    type: 'topic',
    members: 3,
    messageCount: 31,
    lastActivity: 'För 5 dagar sedan',
  },
];

// Keep existing direct messages data
export const directMessages = [
  {
    id: 'dm1',
    users: [
      { id: '1', name: 'Anna Lindberg' },
      { id: '3', name: 'Sofia Chen' }
    ],
    messageCount: 37,
    lastActivity: 'För 2 timmar sedan',
  },
  {
    id: 'dm2',
    users: [
      { id: '2', name: 'Erik Holm' },
      { id: '4', name: 'Johan Bergman' }
    ],
    messageCount: 23,
    lastActivity: 'För 1 dag sedan',
  },
  {
    id: 'dm3',
    users: [
      { id: '1', name: 'Anna Lindberg' },
      { id: '5', name: 'Maria Andersson' }
    ],
    messageCount: 15,
    lastActivity: 'För 3 dagar sedan',
  }
];

// Keep existing recent messages data
export const recentMessages = [
  {
    id: 'm1',
    chatId: '1',
    chatName: 'Allmänt',
    text: 'Har någon sett den nya informationen på anslagstavlan?',
    sender: { id: '3', name: 'Sofia Chen' },
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'group',
  },
  {
    id: 'm2',
    chatId: 'dm1',
    chatName: 'Sofia Chen & Anna Lindberg',
    text: 'Tack för hjälpen med att lösa problemet!',
    sender: { id: '3', name: 'Sofia Chen' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'direct',
  },
  {
    id: 'm3',
    chatId: '2',
    chatName: 'Trädgårdsgruppen',
    text: 'Vi behöver köpa nya verktyg till trädgården, vad tycker ni?',
    sender: { id: '1', name: 'Anna Lindberg' },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'group',
  },
  {
    id: 'm4',
    chatId: '4',
    chatName: 'Renovering',
    text: 'Jag har kontaktat entreprenören och fått ett nytt prisförslag.',
    sender: { id: '2', name: 'Erik Holm' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'group',
  },
];
