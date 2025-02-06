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
  },
  // Add fetch configuration
  fetch: (url, options = {}) => {
    // Convert absolute URLs to relative for proxy
    const proxyUrl = new URL(url);
    const relativeUrl = proxyUrl.pathname + proxyUrl.search;

    const baseHeaders = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey
    };

    // Merge headers, allowing options.headers to override baseHeaders
    const headers = { ...baseHeaders, ...options.headers };

    return fetch(relativeUrl, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'same-origin', // Use same-origin for proxy
      signal: AbortSignal.timeout(30000)  // 30 second timeout
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }).catch(error => {
      // Log detailed error information
      console.error('Fetch error details:', {
        url: relativeUrl,
        error: error.message,
        type: error.name,
        code: error.code
      });
      throw error;
    });
  }
};

// Create client with direct connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Add connection status check with retry mechanism
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

// Function to check connection status with exponential backoff
const checkConnection = async (attempt = 0) => {
  try {
    if (attempt >= MAX_CONNECTION_ATTEMPTS) {
      console.error('Max connection attempts reached');
      return false;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    // Test database connection
    const { error: dbError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1)
      .single();
    
    if (dbError) throw dbError;

    isConnected = true;
    connectionAttempts = 0;
    return true;
  } catch (error) {
    console.error(`Connection attempt ${attempt + 1} failed:`, error);
    isConnected = false;
    connectionAttempts++;

    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return checkConnection(attempt + 1);
  }
};

// Initialize Supabase connection with improved error handling
const initializeSupabase = async (retryCount = 0, maxRetries = 3) => {
  try {
    if (isConnected) {
      console.log('Already connected to Supabase');
      return true;
    }

    console.log('Attempting to connect to Supabase...');
    const connected = await checkConnection();
    
    if (!connected) {
      throw new Error('Failed to establish connection after multiple attempts');
    }

    console.log('Supabase initialized successfully');
    return true;

  } catch (error) {
    console.error('Supabase initialization error:', error);
    
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`Retrying connection in ${delay}ms (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return initializeSupabase(retryCount + 1, maxRetries);
    }

    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 9999;';
    errorDiv.innerHTML = `
      <p><strong>Connection Error</strong></p>
      <p>${error.message}</p>
      <p>Please try the following:</p>
      <ul style="list-style-type: disc; margin-left: 20px;">
        <li>Check your internet connection</li>
        <li>Try using a private/incognito window</li>
        <li>Clear your browser cache and cookies</li>
        <li>Disable any ad blockers or VPN</li>
        <li>Try a different browser</li>
      </ul>
      <button onclick="window.location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 1rem;">
        Retry Connection
      </button>
    `;
    document.body.appendChild(errorDiv);

    return false;
  }
};

// Export connection status and check function
export { initializeSupabase, checkConnection, isConnected };