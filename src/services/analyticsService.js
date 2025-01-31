import { supabase } from '../lib/supabaseClient';

export const analyticsService = {
  async getWeeklyAnalytics(userId, startDate, endDate) {
    try {
      // Get all applications for the week
      const { data: applications, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          application_interviews (*),
          application_reminders (*)
        `)
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Calculate key metrics
      const metrics = {
        totalApplications: applications.length,
        newApplications: applications.filter(app => 
          new Date(app.created_at) >= new Date(startDate)
        ).length,
        
        // Status breakdown
        statusBreakdown: applications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {}),

        // Response rate
        responseRate: (applications.filter(app => 
          ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'OFFER_RECEIVED', 'ACCEPTED'].includes(app.status)
        ).length / applications.length * 100).toFixed(1),

        // Interview metrics
        upcomingInterviews: applications.reduce((acc, app) => {
          const interviews = app.application_interviews.filter(interview =>
            new Date(interview.scheduled_date) > new Date() &&
            interview.status === 'SCHEDULED'
          );
          return [...acc, ...interviews.map(interview => ({
            company: app.company_name,
            position: app.job_title,
            date: interview.scheduled_date,
            type: interview.interview_type
          }))];
        }, []),

        // Pending actions
        pendingActions: applications.reduce((acc, app) => {
          const reminders = app.application_reminders.filter(reminder =>
            !reminder.is_completed &&
            new Date(reminder.due_date) <= new Date(endDate)
          );
          return [...acc, ...reminders.map(reminder => ({
            company: app.company_name,
            action: reminder.description,
            dueDate: reminder.due_date
          }))];
        }, []),

        // Application sources
        applicationsBySource: applications.reduce((acc, app) => {
          const source = new URL(app.job_url || 'https://direct.com').hostname;
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {}),

        // Salary ranges
        salaryData: applications.reduce((acc, app) => {
          if (app.salary_range) {
            const [min, max] = app.salary_range.split('-')
              .map(s => parseInt(s.replace(/[^0-9]/g, '')));
            acc.ranges.push({ min, max });
            acc.average = acc.ranges.reduce((sum, range) => 
              sum + (range.min + range.max) / 2, 0) / acc.ranges.length;
          }
          return acc;
        }, { ranges: [], average: 0 }),

        // Location analysis
        locationBreakdown: applications.reduce((acc, app) => {
          if (app.location) {
            acc[app.location] = (acc[app.location] || 0) + 1;
          }
          return acc;
        }, {}),

        // Time to response
        timeToResponse: applications.reduce((acc, app) => {
          if (app.application_interviews.length > 0) {
            const applicationDate = new Date(app.application_date);
            const firstInterviewDate = new Date(app.application_interviews[0].scheduled_date);
            const days = Math.floor((firstInterviewDate - applicationDate) / (1000 * 60 * 60 * 24));
            acc.push(days);
          }
          return acc;
        }, []).reduce((acc, days, i, arr) => acc + days / arr.length, 0),

        // Weekly progress
        weeklyProgress: {
          applied: applications.filter(app => 
            app.status === 'APPLIED' && 
            new Date(app.application_date) >= new Date(startDate)
          ).length,
          interviews: applications.reduce((acc, app) => 
            acc + app.application_interviews.filter(interview =>
              new Date(interview.scheduled_date) >= new Date(startDate)
            ).length
          , 0),
          offers: applications.filter(app =>
            app.status === 'OFFER_RECEIVED' &&
            new Date(app.updated_at) >= new Date(startDate)
          ).length
        }
      };

      return metrics;
    } catch (error) {
      console.error('Error getting weekly analytics:', error);
      throw error;
    }
  },

  generateWeeklyReport(metrics) {
    return {
      subject: `Weekly Job Search Report - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Weekly Job Search Report</h1>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937;">Weekly Overview</h2>
            <ul style="list-style: none; padding: 0;">
              <li>📝 New Applications: ${metrics.newApplications}</li>
              <li>📊 Total Active Applications: ${metrics.totalApplications}</li>
              <li>📈 Response Rate: ${metrics.responseRate}%</li>
              <li>⏱️ Average Time to Response: ${Math.round(metrics.timeToResponse)} days</li>
            </ul>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937;">This Week's Progress</h2>
            <ul style="list-style: none; padding: 0;">
              <li>✉️ Applications Submitted: ${metrics.weeklyProgress.applied}</li>
              <li>🤝 Interviews Scheduled: ${metrics.weeklyProgress.interviews}</li>
              <li>🎯 Offers Received: ${metrics.weeklyProgress.offers}</li>
            </ul>
          </div>

          ${metrics.upcomingInterviews.length > 0 ? `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937;">Upcoming Interviews</h2>
              <ul style="list-style: none; padding: 0;">
                ${metrics.upcomingInterviews.map(interview => `
                  <li style="margin-bottom: 10px;">
                    🗓️ ${new Date(interview.date).toLocaleDateString()} - 
                    ${interview.company} (${interview.type})
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${metrics.pendingActions.length > 0 ? `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937;">Action Items</h2>
              <ul style="list-style: none; padding: 0;">
                ${metrics.pendingActions.map(action => `
                  <li style="margin-bottom: 10px;">
                    ⚡ ${action.action} - ${action.company}
                    (Due: ${new Date(action.dueDate).toLocaleDateString()})
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937;">Application Status Breakdown</h2>
            <ul style="list-style: none; padding: 0;">
              ${Object.entries(metrics.statusBreakdown).map(([status, count]) => `
                <li>${status}: ${count}</li>
              `).join('')}
            </ul>
          </div>

          ${metrics.salaryData.average ? `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937;">Salary Insights</h2>
              <p>Average Salary Range: $${Math.round(metrics.salaryData.average).toLocaleString()}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #6b7280;">
              Generated by AI Resume Pro - Your Job Search Assistant
            </p>
          </div>
        </div>
      `
    };
  }
}; 