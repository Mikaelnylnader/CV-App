import { analyticsService } from './analyticsService';
import { supabase } from '../lib/supabaseClient';

export const automationService = {
  async generateAndSendWeeklyReport(userId) {
    try {
      // Calculate date range for the past week
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // Get analytics data
      const metrics = await analyticsService.getWeeklyAnalytics(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Generate report
      const report = analyticsService.generateWeeklyReport(metrics);

      // Get user's email
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('email, notification_preferences')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Check if user wants weekly reports
      if (!user.notification_preferences?.weekly_report) {
        console.log('User has disabled weekly reports');
        return;
      }

      // Send email using Supabase Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: report.subject,
          html: report.html
        }
      });

      if (emailError) throw emailError;

      // Log report generation
      await supabase
        .from('automation_logs')
        .insert({
          user_id: userId,
          type: 'WEEKLY_REPORT',
          status: 'SUCCESS',
          metadata: {
            metrics: {
              totalApplications: metrics.totalApplications,
              newApplications: metrics.newApplications,
              responseRate: metrics.responseRate,
              interviews: metrics.weeklyProgress.interviews,
              offers: metrics.weeklyProgress.offers
            }
          }
        });

      // Update user's analytics summary
      await supabase
        .from('user_analytics')
        .upsert({
          user_id: userId,
          last_report_date: new Date().toISOString(),
          total_applications: metrics.totalApplications,
          response_rate: metrics.responseRate,
          average_response_time: metrics.timeToResponse,
          total_interviews: metrics.weeklyProgress.interviews,
          total_offers: metrics.weeklyProgress.offers
        });

      return {
        success: true,
        message: 'Weekly report generated and sent successfully'
      };

    } catch (error) {
      console.error('Error generating weekly report:', error);

      // Log error
      await supabase
        .from('automation_logs')
        .insert({
          user_id: userId,
          type: 'WEEKLY_REPORT',
          status: 'ERROR',
          error_message: error.message
        });

      throw error;
    }
  }
}; 