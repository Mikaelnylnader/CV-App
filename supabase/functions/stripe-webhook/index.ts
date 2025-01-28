import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Use the webhook secret provided
const WEBHOOK_SECRET = 'we_1QjabxKhECC04tvoSmudIDuY'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET
    )

    console.log('Received event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { user_id, price_id } = session.metadata

        console.log('Processing checkout session:', {
          user_id,
          price_id,
          customer: session.customer,
          subscription: session.subscription
        })

        // Map price IDs to plan types
        const planMap = {
          'price_pro_monthly': 'pro',
          'price_pro_yearly': 'pro',
          'price_lifetime': 'lifetime'
        }

        const plan = planMap[price_id] || 'free'

        // Update subscription in database
        const { error } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id,
            plan,
            status: 'active',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            current_period_end: new Date(session.subscription_data?.trial_end ?? Date.now() + 30 * 24 * 60 * 60 * 1000)
          })

        if (error) {
          console.error('Error updating subscription:', error)
          throw error
        }

        console.log('Successfully updated subscription')
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const status = subscription.status
        const customerId = subscription.customer

        console.log('Processing subscription update:', {
          customerId,
          status,
          current_period_end: subscription.current_period_end
        })

        // Update subscription status
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({ 
            status,
            current_period_end: new Date(subscription.current_period_end * 1000)
          })
          .eq('stripe_customer_id', customerId)

        if (error) {
          console.error('Error updating subscription status:', error)
          throw error
        }

        console.log('Successfully updated subscription status')
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})