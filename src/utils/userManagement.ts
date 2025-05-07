
import { User } from "@/components/UserItem";
import { supabase } from "@/integrations/supabase/client";

/**
 * Load all users from the database
 */
export const loadUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (profiles) {
      const mappedUsers: User[] = profiles.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        isOnline: profile.is_online || false,
        isAdmin: profile.is_admin || false,
        lastSeen: profile.last_seen ? new Date(profile.last_seen).toLocaleString('sv-SE') : 'Aldrig',
        apartment: profile.apartment || '',
        email: profile.email || '',
      }));
      
      return mappedUsers;
    }
    return [];
  } catch (error) {
    console.error("Error loading users:", error);
    throw error;
  }
};

/**
 * Toggle admin status for a user
 */
export const handleToggleAdmin = async (userId: string, makeAdmin: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: makeAdmin })
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error toggling admin status:", error);
    return false;
  }
};

/**
 * Delete a user from the database
 */
export const handleDeleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

/**
 * Invite a new user to the system
 */
export const handleInviteUser = async (formData: {
  name: string;
  email: string;
  apartment: string;
  isAdmin: boolean;
}): Promise<{success: boolean; userId?: string; message?: string}> => {
  try {
    // Generate a UUID for the new user
    const newUserId = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: newUserId,
        name: formData.name,
        email: formData.email,
        apartment: formData.apartment,
        is_admin: formData.isAdmin,
        is_online: false,
        last_seen: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return { success: true, userId: data[0].id };
    }

    return { success: false, message: "Kunde inte lägga till användaren." };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, message: "Ett fel uppstod vid tillägg av användaren." };
  }
};

/**
 * Save changes to an existing user
 */
export const handleSaveUser = async (updatedUser: User): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        name: updatedUser.name,
        apartment: updatedUser.apartment,
        is_admin: updatedUser.isAdmin
      })
      .eq('id', updatedUser.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};
