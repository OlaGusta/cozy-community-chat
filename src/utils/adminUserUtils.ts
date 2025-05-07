
import { User } from "@/components/UserItem";
import { supabase } from "@/integrations/supabase/client";

/**
 * Improved function to make Ola admin - handles all Ola profiles to ensure he gets admin access
 */
export const makeOlaAdmin = async () => {
  try {
    // First search for any existing Ola profiles with case-insensitive name match or email
    const { data: olaProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .or('email.eq.ola@olagustafsson.com,name.ilike.%Ola%Gustafsson%,name.eq.Ola Gustafsson');
    
    if (fetchError) {
      console.error("Error searching for Ola's profile:", fetchError);
      throw fetchError;
    }
    
    console.log("Found Ola profiles:", olaProfiles);
    
    // If we found any Ola profiles, make sure they all have admin status
    if (olaProfiles && olaProfiles.length > 0) {
      let successCount = 0;
      
      for (const profile of olaProfiles) {
        // Ensure we have a valid ID before updating
        if (!profile.id) {
          console.error("Profile missing ID, cannot update:", profile);
          continue;
        }

        // Update each profile to ensure they have admin status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_admin: true,
            // Ensure any required fields are present
            apartment: profile.apartment || '1001',
            email: profile.email || 'ola@olagustafsson.com',
          })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
        } else {
          console.log(`Profile ${profile.id} successfully updated to admin`);
          
          // Also set the userRole in localStorage if this is Ola
          try {
            localStorage.setItem('userRole', 'admin');
            console.log("Set userRole to admin in localStorage");
          } catch (e) {
            console.error("Could not update localStorage:", e);
          }
          
          successCount++;
        }
      }
      
      return successCount > 0;
    } else {
      // No Ola profile found, create a new one
      console.log("No Ola profile found, creating a new one...");
      
      // Generate a UUID for the new user
      const newOlaId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: newOlaId,
          name: 'Ola Gustafsson',
          email: 'ola@olagustafsson.com',
          is_admin: true,
          is_online: false,
          apartment: '1001',
          last_seen: new Date().toISOString()
        })
        .select();
        
      if (error) {
        console.error("Error creating Ola profile:", error);
        throw error;
      }
      
      console.log("Ola Gustafsson profile created with admin status:", data);
      
      // Set the userRole in localStorage
      try {
        localStorage.setItem('userRole', 'admin');
        console.log("Set userRole to admin in localStorage");
      } catch (e) {
        console.error("Could not update localStorage:", e);
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error in makeOlaAdmin function:", error);
    return false;
  }
};
