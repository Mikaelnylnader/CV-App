import { serve } from 'std/http/server.ts'
import { stripe } from '../_shared/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-admin.ts'
import { emailService } from '../_shared/email-service.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No stripe signature found')
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', session.client_reference_id)
          .single()

        if (userError) {
          throw userError
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)

        await emailService.sendPurchaseConfirmation(
          { 
            name: user.full_name, 
            email: user.email 
          },
          {
            orderId: session.id,
            amount: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: session.currency
            }).format(session.amount_total / 100),
            planName: price.nickname || 'Premium Plan'
          }
        )

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

        const { error } = await supabaseAdmin
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

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})