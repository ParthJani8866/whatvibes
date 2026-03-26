// lib/email.ts
import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

// The email address that will appear as the sender
const FROM_EMAIL = process.env.EMAIL_FROM || 'Bio For IG <noreply@bioforig.com>'

export async function sendVerificationEmail(to: string, verificationUrl: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY environment variable')
    throw new Error('Email service not configured')
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your email subscription</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 560px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #6366f1, #ec4899);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: white;
            font-size: 28px;
            margin: 0;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content p {
            color: #333;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 24px;
          }
          .button {
            display: inline-block;
            background: #6366f1;
            color: white;
            text-decoration: none;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 8px;
            margin-top: 12px;
            margin-bottom: 20px;
          }
          .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bio For IG</h1>
          </div>
          <div class="content">
            <p>Thanks for subscribing! Please verify your email address to start receiving updates.</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Bio For IG — Link‑in‑bio platform for creators</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Verify your email subscription',
      html,
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

// Optional: function to send a welcome email after verification
export async function sendWelcomeEmail(to: string, name?: string): Promise<void> {
  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2>Welcome to Bio For IG!</h2>
      <p>You're now subscribed to updates from ${name || 'the creator'}.</p>
      <p>We'll notify you when new links or important updates are added.</p>
      <p>— The Bio For IG Team</p>
    </div>
  `

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'You’re subscribed!',
    html,
  })
}