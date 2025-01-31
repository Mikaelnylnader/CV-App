import { serve } from 'std/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';

const MAKE_WEBHOOK_URL = Deno.env.get('MAKE_WEBHOOK_URL');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { record, type } = await req.json();

    // Get additional application details
    const { data: application, error: applicationError } = await supabaseAdmin
      .from('job_applications')
      .select(`
        *,
        application_documents (*),
        application_interviews (*),
        application_reminders (*)
      `)
      .eq('id', record.id)
      .single();

    if (applicationError) throw applicationError;

    // Send to Make.com webhook
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        application,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send to Make.com: ${response.statusText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
}); 