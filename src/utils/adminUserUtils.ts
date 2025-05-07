
import { User } from "@/components/UserItem";
import { supabase } from "@/integrations/supabase/client";

/**
 * Improved function to make Ola admin - handles all Ola profiles to ensure he gets admin access
 */
export const makeOlaAdmin = async () => {
  try {
    console.log("Starting makeOlaAdmin function");
    
    // First check if we're already logged in as Ola 
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    const currentUserEmail = session?.user?.email;
    
    console.log("Current user info:", { id: currentUserId, email: currentUserEmail });
    
    // If current user is Ola (by email), update their profile
    if (currentUserEmail === 'ola@olagustafsson.com') {
      console.log("Current user is Ola by email - updating profile");
      
      if (currentUserId) {
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUserId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching Ola's profile:", profileError);
        }
        
        // Update or insert the profile
        if (existingProfile) {
          console.log("Updating existing profile for Ola:", existingProfile);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              is_admin: true,
              name: 'Ola Gustafsson',
              email: 'ola@olagustafsson.com'
            })
            .eq('id', currentUserId);
          
          if (updateError) {
            console.error("Error updating Ola's profile:", updateError);
            return false;
          }
        } else {
          console.log("No profile found for Ola, creating a new one");
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: currentUserId,
              name: 'Ola Gustafsson',
              email: 'ola@olagustafsson.com',
              is_admin: true
            });
          
          if (insertError) {
            console.error("Error inserting Ola's profile:", insertError);
            return false;
          }
        }
        
        // Set the admin status in localStorage regardless of database operations
        try {
          localStorage.setItem('userRole', 'admin');
          console.log("Set userRole to admin in localStorage");
        } catch (e) {
          console.error("Could not update localStorage:", e);
        }
        
        return true;
      }
    }
    
    // If we're not logged in as Ola, search for existing Ola profiles
    console.log("Searching for existing Ola profiles...");
    const { data: olaProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .or('email.eq.ola@olagustafsson.com,name.ilike.%Ola%Gustafsson%');
    
    if (fetchError) {
      console.error("Error searching for Ola's profile:", fetchError);
      throw fetchError;
    }
    
    console.log("Found Ola profiles:", olaProfiles);
    
    // If we found any Ola profiles, make sure they all have admin status
    if (olaProfiles && olaProfiles.length > 0) {
      for (const profile of olaProfiles) {
        // Ensure we have a valid ID before updating
        if (!profile.id) {
          console.error("Profile missing ID, cannot update:", profile);
          continue;
        }

        // Update each profile to ensure they have admin status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
        } else {
          console.log(`Profile ${profile.id} successfully updated to admin`);
          // If the current user is this profile, update localStorage
          if (currentUserId === profile.id) {
            try {
              localStorage.setItem('userRole', 'admin');
              console.log("Set userRole to admin in localStorage for current user");
            } catch (e) {
              console.error("Could not update localStorage:", e);
            }
          }
        }
      }
      
      return true;
    } else {
      // No Ola profile found, create a new one with random ID
      console.log("No Ola profile found, creating a new one...");
      
      // Generate a UUID for the new user if we don't have a current user
      const newOlaId = currentUserId || crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: newOlaId,
          name: 'Ola Gustafsson',
          email: 'ola@olagustafsson.com',
          is_admin: true,
          apartment: '1001'
        })
        .select();
        
      if (error) {
        console.error("Error creating Ola profile:", error);
        throw error;
      }
      
      console.log("Ola Gustafsson profile created with admin status:", data);
      
      // Set the userRole in localStorage if this is for the current user
      if (currentUserId === newOlaId) {
        try {
          localStorage.setItem('userRole', 'admin');
          console.log("Set userRole to admin in localStorage for new profile");
        } catch (e) {
          console.error("Could not update localStorage:", e);
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error in makeOlaAdmin function:", error);
    return false;
  }
};
