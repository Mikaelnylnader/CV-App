import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 
      'x-application-name': 'ai-resume-pro',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  },
  db: {
    schema: 'public'
  },
  storage: {
    retryAttempts: 3,
    retryInterval: 1000,
    maxRetryDelay: 5000,
    defaultHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  }
});

// Test Supabase connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};