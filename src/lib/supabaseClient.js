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
      'x-application-name': 'ai-resume-pro',
      'X-Client-Info': 'supabase-js-web'
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
async function checkConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Test database connection
    const { data, error } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
      
    if (error) throw error;
    
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
}

// Initialize connection with retry logic
async function initializeSupabase(maxRetries = 3, retryDelay = 1000) {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    const isConnected = await checkConnection();
    
    if (isConnected) {
      console.log('Supabase initialized successfully');
      return supabase;
    }
    
    retryCount++;
    if (retryCount < maxRetries) {
      console.log(`Retrying connection in ${retryDelay}ms (${retryCount}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 2; // Exponential backoff
    }
  }
  
  throw new Error('Failed to establish connection after multiple attempts');
}

// Export initialized client
export { supabase, initializeSupabase };