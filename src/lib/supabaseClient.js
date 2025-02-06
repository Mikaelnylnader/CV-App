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
    flowType: 'implicit'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Test connection function with improved error handling
export const testConnection = async () => {
  const results = {
    healthCheck: false,
    authCheck: false,
    dbCheck: false,
    healthCheckError: null,
    authCheckError: null,
    dbCheckError: null
  };

  // Test 1: Health Check with retry
  try {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (!success && attempt < maxRetries) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          results.healthCheck = true;
          success = true;
        } else {
          throw new Error(`API returned status ${response.status}`);
        }
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          results.healthCheckError = error.message;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  } catch (error) {
    console.error('Health check error:', error);
    results.healthCheckError = error.message || 'Failed to connect to Supabase API';
  }

  // Test 2: Auth Check with retry
  try {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (!success && attempt < maxRetries) {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
          results.authCheck = true;
          success = true;
        } else {
          throw error;
        }
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          results.authCheckError = error.message;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
    results.authCheckError = error.message || 'Failed to check authentication status';
  }

  // Test 3: Database Check with retry
  try {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (!success && attempt < maxRetries) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('count')
          .limit(1);
        
        if (!error) {
          results.dbCheck = true;
          success = true;
        } else {
          throw error;
        }
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          results.dbCheckError = error.message;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  } catch (error) {
    console.error('Database check error:', error);
    results.dbCheckError = error.message || 'Failed to query database';
  }

  return results;
};

// Initialize connection with retry mechanism
export const initializeSupabase = async () => {
  try {
    // Test the connection
    const testResult = await testConnection();
    
    if (!testResult.healthCheck || !testResult.authCheck || !testResult.dbCheck) {
      console.error('Connection test failed:', testResult);
      throw new Error('Failed to establish connection to Supabase');
    }

    // Initialize auth listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
    });

    console.log('Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
};

export default supabase;