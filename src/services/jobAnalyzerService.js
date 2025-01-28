import { supabase } from '../lib/supabaseClient';

export class JobAnalyzerService {
  async getJobText(jobUrl) {
    try {
      // Get webhook URL from environment variables
      const webhookUrl = import.meta.env.VITE_MAKE_JOB_WEBHOOK;
      if (!webhookUrl) {
        throw new Error('Job webhook URL not configured');
      }
      
      // Make request to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          data: {
            jobUrl,
            supabase: {
              url: import.meta.env.VITE_SUPABASE_URL,
              key: import.meta.env.VITE_SUPABASE_ANON_KEY
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job text');
      }

      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error getting job text:', error);
      throw error;
    }
  }
}

export const jobAnalyzer = new JobAnalyzerService();