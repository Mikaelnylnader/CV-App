import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const stripeService = {
  async createCheckoutSession(priceId, userId) {
    try {
      const { data: { sessionId }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, userId }
      });

      if (error) throw error;

      const stripe = await getStripe();
      if (!stripe) throw new Error('Failed to load Stripe');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId
      });

      if (stripeError) throw stripeError;

    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  async createPortalSession(customerId) {
    try {
      const { data: { url }, error } = await supabase.functions.invoke('create-portal-session', {
        body: { customerId }
      });

      if (error) throw error;
      window.location.href = url;

    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }
};