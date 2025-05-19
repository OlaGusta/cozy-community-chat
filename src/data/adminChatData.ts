export const allChats = [
  {
    id: "1",
    title: "Allmänt",
    type: "group",
    members: 6,
    messageCount: 143,
    lastActivity: "För 10 min sedan",
  },
  {
    id: "2",
    title: "Trädgårdsgruppen",
    type: "topic",
    members: 3,
    messageCount: 57,
    lastActivity: "För 1 dag sedan",
  },
  {
    id: "3",
    title: "Fest & Aktiviteter",
    type: "topic",
    members: 3,
    messageCount: 22,
    lastActivity: "För 2 dagar sedan",
  },
  {
    id: "4",
    title: "Renovering",
    type: "topic",
    members: 3,
    messageCount: 45,
    lastActivity: "För 2 dagar sedan",
  },
  {
    id: "5",
    title: "Teknik & Wifi",
    type: "topic",
    members: 3,
    messageCount: 31,
    lastActivity: "För 5 dagar sedan",
  },
];

export const directMessages = [
  {
    id: "dm1",
    users: [
      { id: "1", name: "Anna Lindberg" },
      { id: "3", name: "Sofia Chen" },
    ],
    messageCount: 37,
    lastActivity: "För 2 timmar sedan",
  },
  {
    id: "dm2",
    users: [
      { id: "2", name: "Erik Holm" },
      { id: "4", name: "Johan Bergman" },
    ],
    messageCount: 23,
    lastActivity: "För 1 dag sedan",
  },
  {
    id: "dm3",
    users: [
      { id: "1", name: "Anna Lindberg" },
      { id: "5", name: "Maria Andersson" },
    ],
    messageCount: 15,
    lastActivity: "För 3 dagar sedan",
  },
];

// Define a type for the message type to ensure it's properly typed
type MessageType = "group" | "direct";

// Create an interface for the message data to match the expected type in MessagesTab
interface RecentMessage {
  id: string;
  chatId: string;
  chatName: string;
  text: string;
  sender: { id: string; name: string };
  timestamp: Date;
  type: MessageType;
}

// Define recentMessages with the correct type
// These demo messages were used during development but should not appear in
// production. They are replaced with an empty array until real data is loaded
// from the backend.
export const recentMessages: RecentMessage[] = [];
