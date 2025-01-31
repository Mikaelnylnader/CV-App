import { supabase } from '../lib/supabaseClient';

export const jobApplicationService = {
  // Job Applications
  async createApplication(applicationData) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApplication(id, updates) {
    const { data, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApplications(userId, filters = {}) {
    let query = supabase
      .from('job_applications')
      .select(`
        *,
        application_documents (*),
        application_interviews (*),
        application_reminders (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.dateRange) {
      query = query.gte('created_at', filters.dateRange.start)
                  .lte('created_at', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getApplicationById(id) {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        application_documents (*),
        application_interviews (*),
        application_reminders (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Documents
  async addDocument(documentData) {
    const { data, error } = await supabase
      .from('application_documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDocument(id, updates) {
    const { data, error } = await supabase
      .from('application_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Interviews
  async scheduleInterview(interviewData) {
    const { data, error } = await supabase
      .from('application_interviews')
      .insert([interviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateInterview(id, updates) {
    const { data, error } = await supabase
      .from('application_interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reminders
  async createReminder(reminderData) {
    const { data, error } = await supabase
      .from('application_reminders')
      .insert([reminderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateReminder(id, updates) {
    const { data, error } = await supabase
      .from('application_reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Analytics
  async getAnalytics(userId, dateRange = {}) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dateRange.start || new Date(new Date().setMonth(new Date().getMonth() - 1)))
      .lte('created_at', dateRange.end || new Date());

    if (error) throw error;

    // Calculate analytics
    const analytics = {
      totalApplications: data.length,
      statusBreakdown: data.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      applicationsByDay: data.reduce((acc, app) => {
        const date = new Date(app.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}),
      responseRate: data.filter(app => 
        ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'OFFER_RECEIVED', 'ACCEPTED'].includes(app.status)
      ).length / data.length * 100
    };

    return analytics;
  }
}; 