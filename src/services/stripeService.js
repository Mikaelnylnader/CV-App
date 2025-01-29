import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import { emailService } from './emailService';

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
  },

  async handleSuccessfulPayment(session) {
    try {
      // Get user details from Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.customer)
        .single();

      if (userError) throw userError;

      // Get plan details
      const planDetails = {
        orderId: session.id,
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: session.currency
        }).format(session.amount_total / 100),
        planName: session.metadata.planName || 'Pro Plan'
      };

      // Send purchase confirmation email
      await emailService.sendPurchaseConfirmation({
        name: userData.full_name,
        email: userData.email
      }, planDetails);

      return { success: true };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      return { success: false, error: error.message };
    }
  }
};