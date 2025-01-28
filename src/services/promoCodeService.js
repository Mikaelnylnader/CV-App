import { supabase } from '../lib/supabaseClient';

export const promoCodeService = {
  async redeemCode(code) {
    try {
      // Start a transaction
      const { data: promoCode, error: fetchError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_used', false)
        .single();

      if (fetchError) throw new Error('Invalid or expired promo code');
      if (!promoCode) throw new Error('Promo code not found');

      const user = supabase.auth.user();
      if (!user) throw new Error('You must be logged in to redeem a promo code');

      // Mark code as used
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({
          is_used: true,
          used_by: user.id,
          used_at: new Date().toISOString()
        })
        .eq('id', promoCode.id);

      if (updateError) throw updateError;

      // Update user's subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: promoCode.plan,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + promoCode.duration_months * 30 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (subscriptionError) throw subscriptionError;

      return {
        success: true,
        message: `Successfully activated ${promoCode.plan} plan for ${promoCode.duration_months} months!`
      };
    } catch (error) {
      console.error('Error redeeming promo code:', error);
      throw error;
    }
  },

  async listAvailableCodes() {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('code, plan, duration_months')
        .eq('is_used', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing promo codes:', error);
      throw error;
    }
  }
}; 