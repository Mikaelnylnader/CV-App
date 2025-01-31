import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables (safely)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0,
  keyPrefix: supabaseAnonKey?.substring(0, 10) + '...'
});

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase configuration. Check your environment variables.');
}

// Verify key format
if (!supabaseAnonKey.startsWith('eyJ') || !supabaseAnonKey.includes('.')) {
  console.error('Invalid Supabase key format');
  throw new Error('Invalid Supabase key format. Please check your configuration.');
}

// Create Supabase client with validated credentials
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'x-application-name': 'ai-resume-pro'
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Initialize Supabase connection
const initializeSupabase = async () => {
  try {
    // Test auth endpoint first
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth initialization error:', authError);
      return false;
    }
    console.log('Auth endpoint accessible:', !!authData);

    // Then test database connection
    const { data, error: dbError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);

    if (dbError) {
      console.error('Database connection error:', dbError);
      return false;
    }

    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    return false;
  }
};

// Initialize on load
initializeSupabase().catch(console.error);

export { initializeSupabase };