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

// Create Supabase client with simplified configuration
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: { 'x-application-name': 'ai-resume-pro' }
  },
  // Remove CORS credentials that might be causing issues
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      mode: 'cors',
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
      },
    }).catch(error => {
      console.error('Fetch error:', error);
      // Add more detailed error logging
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Network connection error. Please check your internet connection and try again.');
      }
      throw error;
    });
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Initialize Supabase connection with improved error handling
const initializeSupabase = async (retryCount = 0, maxRetries = 3) => {
  try {
    // Test auth endpoint with timeout
    const authPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth timeout')), 5000)
    );
    
    const { data: authData, error: authError } = await Promise.race([
      authPromise,
      timeoutPromise
    ]);

    if (authError) {
      console.error('Auth initialization error:', authError);
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying connection in ${delay}ms (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return initializeSupabase(retryCount + 1, maxRetries);
      }
      return false;
    }

    console.log('Auth endpoint accessible:', !!authData);

    // Test database connection with timeout
    const dbPromise = supabase
      .from('subscriptions')
      .select('count')
      .limit(1)
      .single();
    
    const { error: dbError } = await Promise.race([
      dbPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);

    if (dbError) {
      console.error('Database connection error:', dbError);
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying connection in ${delay}ms (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return initializeSupabase(retryCount + 1, maxRetries);
      }
      return false;
    }

    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    if (error.message === 'Auth timeout' || error.message === 'Database timeout') {
      console.error('Connection timed out. Please check your network connection.');
    }
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Retrying connection in ${delay}ms (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return initializeSupabase(retryCount + 1, maxRetries);
    }
    return false;
  }
};

// Initialize on load
initializeSupabase().catch(error => {
  console.error('Failed to initialize Supabase:', error);
  // Add user-friendly error message to the page
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
  errorDiv.innerHTML = `
    <p><strong>Connection Error</strong></p>
    <p>Unable to connect to the server. Please check your internet connection and try again.</p>
  `;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
});

export { initializeSupabase };