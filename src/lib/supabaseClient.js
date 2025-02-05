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

// Create Supabase client with enhanced configuration
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'x-application-name': 'ai-resume-pro'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Add fetch configuration to handle connection issues
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
      },
      timeout: 30000, // 30 second timeout
    }).catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Initialize Supabase connection with retry logic
const initializeSupabase = async (retryCount = 0, maxRetries = 3) => {
  try {
    // Test auth endpoint
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth initialization error:', authError);
      if (retryCount < maxRetries) {
        console.log(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return initializeSupabase(retryCount + 1, maxRetries);
      }
      return false;
    }
    console.log('Auth endpoint accessible:', !!authData);

    // Test database connection
    const { data, error: dbError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1)
      .single();

    if (dbError) {
      console.error('Database connection error:', dbError);
      if (retryCount < maxRetries) {
        console.log(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return initializeSupabase(retryCount + 1, maxRetries);
      }
      return false;
    }

    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    if (retryCount < maxRetries) {
      console.log(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return initializeSupabase(retryCount + 1, maxRetries);
    }
    return false;
  }
};

// Initialize on load
initializeSupabase().catch(console.error);

export { initializeSupabase };