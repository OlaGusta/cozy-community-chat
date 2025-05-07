
import { Database } from "@/integrations/supabase/types";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Export convenience types from the auto-generated types
export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type ChatRoom = Tables['chat_rooms']['Row'];
export type ChatMessage = Tables['chat_messages']['Row'];
export type DirectMessage = Tables['direct_messages']['Row'];
export type Announcement = Tables['announcements']['Row'];

// Extended ChatRoom type with optional fields used in the app
export interface ExtendedChatRoom extends ChatRoom {
  type?: 'group' | 'topic';
  is_private?: boolean;
}

// Extended user type that includes profile information
export interface UserWithProfile extends SupabaseUser {
  profile?: Profile;
}
