import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, EyeIcon } from "lucide-react";
import UsersTab from "@/components/admin/UsersTab";
import ChatsTab from "@/components/admin/ChatsTab";
import MessagesTab from "@/components/admin/MessagesTab";
import { User } from "@/components/UserItem";
// Demo messages are removed; real data should be fetched from the backend.
import { allChats, directMessages } from "@/data/adminChatData";

interface AdminTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onEditUser: (user: User) => void;
}

const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
  activeTab,
  onTabChange,
  users,
  setUsers,
  onEditUser,
}) => {
  return (
    <Tabs
      className="mb-6 animate-in"
      value={activeTab}
      onValueChange={onTabChange}
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" /> Medlemmar
        </TabsTrigger>
        <TabsTrigger value="chats" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Konversationer
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4" /> Meddelanden
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <UsersTab users={users} setUsers={setUsers} onEditUser={onEditUser} />
      </TabsContent>

      <TabsContent value="chats" className="space-y-4">
        <ChatsTab chats={allChats} directMessages={directMessages} />
      </TabsContent>

      <TabsContent value="messages" className="space-y-4">
        {/* Replace empty array with fetched data when available */}
        <MessagesTab messages={[]} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContainer;
