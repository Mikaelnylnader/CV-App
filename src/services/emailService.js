import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const emailService = {
  async sendWelcomeEmail(user) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Resume Pro <noreply@airesumepro.com>',
        to: user.email,
        subject: 'Welcome to AI Resume Pro!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Welcome to AI Resume Pro!</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for joining AI Resume Pro! We're excited to help you create professional resumes and cover letters that stand out.</p>
            <p>Here's what you can do now:</p>
            <ul>
              <li>Create your first resume</li>
              <li>Generate a matching cover letter</li>
              <li>Explore our AI-powered features</li>
            </ul>
            <p>If you have any questions, our support team is here to help!</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #F3F4F6; border-radius: 8px;">
              <p style="margin: 0;">Need help getting started?</p>
              <a href="https://airesumepro.com/help" style="color: #3B82F6; text-decoration: none;">Visit our Help Center</a>
            </div>
            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This email was sent by AI Resume Pro. Please do not reply to this email.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPasswordResetEmail(user, resetToken) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Resume Pro <noreply@airesumepro.com>',
        to: user.email,
        subject: 'Reset Your Password - AI Resume Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Reset Your Password</h1>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://airesumepro.com/reset-password?token=${resetToken}" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This is an automated email from AI Resume Pro. Please do not reply.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendSubscriptionConfirmation(user, plan) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Resume Pro <noreply@airesumepro.com>',
        to: user.email,
        subject: 'Subscription Confirmed - AI Resume Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Subscription Confirmed!</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for subscribing to AI Resume Pro ${plan.name}!</p>
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #3B82F6; margin-top: 0;">Plan Details:</h2>
              <ul style="list-style: none; padding: 0;">
                <li>Plan: ${plan.name}</li>
                <li>Price: ${plan.price}/month</li>
                <li>Billing Cycle: Monthly</li>
              </ul>
            </div>
            <p>You now have access to all ${plan.name} features:</p>
            <ul>
              ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <p>Need help getting started with your new features?</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://airesumepro.com/help" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Visit Help Center
              </a>
            </div>
            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This is an automated email from AI Resume Pro. Please do not reply.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending subscription confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  async sendPurchaseConfirmation(user, purchase) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Resume Pro <noreply@airesumepro.com>',
        to: user.email,
        subject: 'Thank You for Your Purchase - AI Resume Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Thank You for Your Purchase!</h1>
            <p>Hi ${user.name},</p>
            <p>Thank you for choosing AI Resume Pro! Your purchase has been confirmed and processed successfully.</p>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #3B82F6; margin-top: 0;">Order Details:</h2>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Order ID:</strong> ${purchase.orderId}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
                <li><strong>Amount:</strong> ${purchase.amount}</li>
                <li><strong>Plan:</strong> ${purchase.planName}</li>
              </ul>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #3B82F6;">What's Next?</h3>
              <ul>
                <li>Access all premium features</li>
                <li>Create unlimited resumes and cover letters</li>
                <li>Use our AI-powered optimization tools</li>
                <li>Get priority support</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://airesumepro.com/dashboard" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Go to Dashboard
              </a>
            </div>

            <div style="margin-top: 20px; padding: 15px; background-color: #F3F4F6; border-radius: 8px;">
              <p style="margin: 0;">Need help getting started?</p>
              <a href="https://airesumepro.com/help" style="color: #3B82F6; text-decoration: none;">Visit our Help Center</a>
            </div>

            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This is a confirmation of your purchase. Please keep this email for your records.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending purchase confirmation email:', error);
      return { success: false, error: error.message };
    }
  },

  async sendCVCompletionEmail(user, cvDetails) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'AI Resume Pro <noreply@airesumepro.com>',
        to: user.email,
        subject: 'Your Optimized CV is Ready!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Your CV is Ready!</h1>
            <p>Hi ${user.user_metadata?.name || 'there'},</p>
            <p>Great news! We've finished optimizing your CV (${cvDetails.originalFilename}) for the job position you're interested in.</p>
            
            <div style="margin: 20px 0; padding: 20px; background-color: #F3F4F6; border-radius: 8px;">
              <h2 style="color: #3B82F6; margin-top: 0;">Next Steps:</h2>
              <ol style="padding-left: 20px;">
                <li>Log in to your dashboard to view your optimized CV</li>
                <li>Review the changes and customizations</li>
                <li>Download your CV and start applying!</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://airesumepro.com/dashboard" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Your CV
              </a>
            </div>

            <div style="margin-top: 20px;">
              <p><strong>Job URL:</strong> <a href="${cvDetails.jobUrl}" style="color: #3B82F6; text-decoration: none;">${cvDetails.jobUrl}</a></p>
            </div>

            <p style="margin-top: 30px;">Need help or have questions? Our support team is here to help!</p>

            <div style="margin-top: 20px; padding: 15px; background-color: #F3F4F6; border-radius: 8px;">
              <p style="margin: 0;">Want to optimize your CV for another job?</p>
              <a href="https://airesumepro.com/dashboard/upload" style="color: #3B82F6; text-decoration: none;">Create Another CV</a>
            </div>

            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This email was sent by AI Resume Pro. Please do not reply to this email.
            </p>
          </div>
        `
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error sending CV completion email:', error);
      return { success: false, error: error.message };
    }
  }
}; 