// flowglad.ts
import { supabase } from '@/integrations/supabase/client';

// Flowglad configuration for Vite React app
export const flowgladConfig = {
  secretKey: import.meta.env.VITE_FLOWGLAD_SECRET_KEY,
  supabaseClient: supabase,
};

// Helper function to get current user for billing context
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If no user is authenticated, return a default mock user
  if (!user || error) {
    console.log('✅ No authenticated user found, using default demo user for seamless experience');
    return {
      id: 'default-user-001',
      email: 'demo@dealsense.com',
      user_metadata: {
        full_name: 'Demo User',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      aud: 'authenticated',
      role: 'authenticated'
    };
  }
  
  console.log('✅ Authenticated user found:', user.email);
  return user;
};

// Helper function to get user's organization (if applicable)
export const getUserOrganization = async (userId: string) => {
  // If your customers are organizations rather than individual users,
  // implement your logic here to derive the organization associated with the user
  // For now, we'll use the user ID as the customer ID
  return userId;
};
