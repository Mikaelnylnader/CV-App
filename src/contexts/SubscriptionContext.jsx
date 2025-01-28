import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const SubscriptionContext = createContext({});

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  LIFETIME: 'lifetime',
  ADMIN: 'admin'
};

// Make all features available in FREE plan for now
export const PLAN_LIMITS = {
  [PLANS.FREE]: {
    resumeCustomizations: Infinity,
    features: ['advanced_ai', 'all_exports', 'priority_support', 'premium_templates', 'linkedin', 'cover_letter', 'job_matching', 'custom_branding', 'api_access', 'success_manager', 'analytics']
  },
  [PLANS.PRO]: {
    resumeCustomizations: Infinity,
    features: ['advanced_ai', 'all_exports', 'priority_support', 'premium_templates', 'linkedin', 'cover_letter', 'job_matching', 'custom_branding', 'api_access', 'success_manager', 'analytics']
  },
  [PLANS.LIFETIME]: {
    resumeCustomizations: Infinity,
    features: ['advanced_ai', 'all_exports', 'vip_support', 'premium_templates', 'linkedin', 'cover_letter', 'job_matching', 'custom_branding', 'api_access', 'success_manager', 'analytics']
  },
  [PLANS.ADMIN]: {
    resumeCustomizations: Infinity,
    features: ['advanced_ai', 'all_exports', 'vip_support', 'premium_templates', 'linkedin', 'cover_letter', 'job_matching', 'custom_branding', 'api_access', 'success_manager', 'analytics', 'admin_panel']
  }
};

// List of admin emails
const ADMIN_EMAILS = [
  'mikael.nylander84@gmail.com'  // Your admin email
];

// List of beta tester emails that get free pro access
const BETA_TESTER_EMAILS = [
  // Add your 10 beta tester emails here
  'tester1@example.com',
  'tester2@example.com',
  'tester3@example.com',
  'tester4@example.com',
  'tester5@example.com',
  'tester6@example.com',
  'tester7@example.com',
  'tester8@example.com',
  'tester9@example.com',
  'tester10@example.com'
];

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState({ plan: PLANS.FREE });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      subscribeToChanges();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      // Check if user is admin
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setSubscription({ plan: PLANS.ADMIN });
        return;
      }

      // Check if user is a beta tester
      if (user && BETA_TESTER_EMAILS.includes(user.email)) {
        setSubscription({ plan: PLANS.PRO });
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data || { plan: PLANS.FREE });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ plan: PLANS.FREE });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    // Don't subscribe to changes for admin users
    if (user && ADMIN_EMAILS.includes(user.email)) {
      return;
    }

    const subscription = supabase
      .channel('subscription_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const checkPermission = (feature) => {
    // Always return true for now to make all features free
    return true;
  };

  const getRemainingCustomizations = async () => {
    // Return Infinity to allow unlimited customizations
    return Infinity;
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      checkPermission,
      getRemainingCustomizations,
      planLimits: PLAN_LIMITS,
      isAdmin: true // Make everyone admin for now
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};