import { Resend } from 'resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

export const emailService = {
  async sendPurchaseConfirmation(user: { name: string; email: string }, purchase: { orderId: string; amount: string; planName: string }) {
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
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending purchase confirmation email:', error)
      return { success: false, error: error.message }
    }
  }
} 