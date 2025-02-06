import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhwmktvipzlverocznnt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod21rdHZpcHpsdmVyb2N6bm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNjQ1MjAsImV4cCI6MjA1MTc0MDUyMH0.RWgctzI4u0ZZFKh9EzBcn57GeNvEWRTnrfEvZtlXTUc';

// Debug environment variables (safely)
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0
});

// Create Supabase client with production-optimized settings
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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

  // Test 1: Health Check
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    if (response.ok) {
      results.healthCheck = true;
      console.log('Health check successful');
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Health check error:', error);
    results.healthCheckError = error.message;
  }

  // Test 2: Auth Check
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error) {
      results.authCheck = true;
      console.log('Auth check successful');
    } else {
      throw error;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    results.authCheckError = error.message;
  }

  // Test 3: Database Check
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('count')
      .maybeSingle();

    if (!error) {
      results.dbCheck = true;
      console.log('Database check successful');
    } else {
      throw error;
    }
  } catch (error) {
    console.error('Database check error:', error);
    results.dbCheckError = error.message;
  }

  return results;
};

export const initializeSupabase = async () => {
  try {
    console.log('Initializing Supabase connection...');
    const testResult = await testConnection();
    console.log('Connection test results:', testResult);

    if (!testResult.healthCheck && !testResult.authCheck) {
      throw new Error('Failed to establish critical connections to Supabase');
    }

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