
import { User } from "@/components/UserItem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Format date for display
export const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 60) {
    return `För ${diffMins} min sedan`;
  } else if (diffMins < 24 * 60) {
    const hours = Math.floor(diffMins / 60);
    return `För ${hours} tim sedan`;
  } else {
    const days = Math.floor(diffMins / (24 * 60));
    return `För ${days} dag${days > 1 ? 'ar' : ''} sedan`;
  }
};

// Förbättrad funktion för att göra Ola admin - hanterar båda användarprofilerna
export const makeOlaAdmin = async () => {
  try {
    // Identifiera Ola med email
    const { data: olaProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .or('email.eq.ola@olagustafsson.com,name.ilike.%Ola Gustafsson%');
    
    if (fetchError) throw fetchError;
    
    console.log("Hittade Ola-profiler:", olaProfiles);
    
    // Uppdatera alla matchande profiler till admin
    if (olaProfiles && olaProfiles.length > 0) {
      for (const profile of olaProfiles) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_admin: true,
            // Säkerställ att andra obligatoriska fält finns
            apartment: profile.apartment || '1001'
          })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error(`Fel vid uppdatering av profil ${profile.id}:`, updateError);
        } else {
          console.log(`Profil ${profile.id} uppdaterad till admin`);
        }
      }
      return true;
    } else {
      // Om ingen profil hittades, skapa en ny
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: 'ola-gustafsson-id',
          name: 'Ola Gustafsson',
          email: 'ola@olagustafsson.com',
          is_admin: true,
          is_online: false,
          apartment: '1001',
          last_seen: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();
        
      if (error) throw error;
      
      console.log("Ola Gustafsson set as admin:", data);
      return true;
    }
  } catch (error) {
    console.error("Error making Ola admin:", error);
    return false;
  }
};

// User management functions
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
