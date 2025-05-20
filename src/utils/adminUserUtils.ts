
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
    if (currentUserEmail === 'ola@olagustafsson.com' || 
        currentUserEmail === 'ola.gustafsson70@gmail.com') {
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
              email: currentUserEmail
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
              email: currentUserEmail,
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
    
    // Search for existing Ola profiles
    console.log("Searching for existing Ola profiles...");
    const { data: olaProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .or('email.eq.ola@olagustafsson.com,email.eq.ola.gustafsson70@gmail.com,name.ilike.%Ola%Gustafsson%');
    
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
    }
    
    // Create new admin profiles for Ola if none exist
    // This ensures there's always an Ola admin profile in the system
    const olaEmails = ['ola@olagustafsson.com', 'ola.gustafsson70@gmail.com'];
    
    // Create or update Ola profiles
    let createdAny = false;
    for (const email of olaEmails) {
      // Check if profile exists with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!existingProfile) {
        // Generate a UUID for the new user
        const newId = crypto.randomUUID();
        
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            name: 'Ola Gustafsson',
            email: email,
            is_admin: true,
            apartment: '1001'
          })
          .select();
          
        if (error) {
          console.error(`Error creating Ola profile for ${email}:`, error);
        } else {
          console.log(`Created Ola profile with admin status for ${email}:`, data);
          createdAny = true;
        }
      }
    }
    
    // Create Hola Gustafsson profile
    const { data: existingHolaProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('name', 'Hola Gustafsson')
      .single();
    
    if (!existingHolaProfile) {
      // Generate a UUID for the new user
      const newHolaId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: newHolaId,
          name: 'Hola Gustafsson',
          email: 'ola.gustafsson70@gmail.com',
          is_admin: true,
          apartment: '1002'
        })
        .select();
        
      if (error) {
        console.error("Error creating Hola Gustafsson profile:", error);
      } else {
        console.log("Created Hola Gustafsson profile with admin status:", data);
        createdAny = true;
      }
    }
    
    return createdAny || olaProfiles?.length > 0;
  } catch (error) {
    console.error("Error in makeOlaAdmin function:", error);
    return false;
  }
};
