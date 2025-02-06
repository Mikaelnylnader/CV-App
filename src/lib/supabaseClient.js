import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug environment variables (safely)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0
});

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase configuration. Check your environment variables.');
}

// Create Supabase client with production-optimized settings
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Function to check connection status
async function checkConnection(attempt = 1, maxAttempts = 3) {
  try {
    console.log(`Connection attempt ${attempt}/${maxAttempts}...`);
    
    // First test auth endpoint
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth endpoint test failed:', authError);
      throw authError;
    }
    console.log('Auth endpoint test successful');

    // Then test database connection
    const { data, error: dbError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
      
    if (dbError) {
      console.error('Database connection test failed:', dbError);
      throw dbError;
    }
    
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error(`Connection attempt ${attempt} failed:`, error);

    if (attempt < maxAttempts) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return checkConnection(attempt + 1, maxAttempts);
    }

    return false;
  }
}

// Initialize connection
async function initializeSupabase() {
  try {
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      throw new Error('Failed to establish connection after multiple attempts');
    }

    console.log('Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}

// Export initialized client
export { supabase, initializeSupabase };