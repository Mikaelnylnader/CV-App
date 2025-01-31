import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const {
      userId,
      applicationId,
      jobUrl,
      linkedinUrl,
      cvContent,
      prepDocument,
      makeWebhookUrl
    } = body;

    // Send data to Make.com webhook
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        applicationId,
        jobUrl,
        linkedinUrl,
        cvContent,
        prepDocument,
        timestamp: new Date().toISOString(),
        type: 'INTERVIEW_PREP_REQUEST'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to trigger Make.com webhook');
    }

    // Log the automation trigger
    await supabaseClient
      .from('automation_logs')
      .insert({
        user_id: userId,
        type: 'INTERVIEW_PREP_WEBHOOK',
        status: 'SUCCESS',
        metadata: {
          application_id: applicationId,
          job_url: jobUrl,
          linkedin_url: linkedinUrl
        }
      });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
}); 