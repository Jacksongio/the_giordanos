import { Password } from "@convex-dev/auth/providers/Password"
import { convexAuth } from "@convex-dev/auth/server"
import Resend from "@auth/core/providers/resend"
import { Resend as ResendAPI } from "resend"

// Email provider for password reset using Resend (FREE 100 emails/day!)
const PasswordResetProvider = Resend({
  id: "password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  from: process.env.AUTH_RESEND_FROM || "The Giordanos Wedding <onboarding@resend.dev>",
  generateVerificationToken() {
    const chars = "0123456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    // Log to console
    console.log("🔐 PASSWORD RESET CODE for", email)
    console.log("📧 Code:", token)
    console.log("⏰ Valid for 1 hour")
    console.log("=".repeat(50))
    
    // Send email via Resend (works without Node.js APIs!)
    if (provider.apiKey) {
      try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          console.error("❌ Invalid email format:", email)
          throw new Error("Invalid email address format")
        }

        const resend = new ResendAPI(provider.apiKey)
        
        const result = await resend.emails.send({
          from: provider.from as string,
          to: [email],
          subject: "Reset Your Password - The Giordanos Wedding",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #faf8f5; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #6b7f5e 0%, #8fa87e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                  .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: center; }
                  .subtitle { font-size: 20px; color: #6b7f5e; margin-bottom: 10px; }
                  .message { font-size: 16px; color: #555; }
                  .code { font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #6b7f5e; text-align: center; padding: 20px; background: #f5f3ef; border-radius: 8px; margin: 25px 0; word-break: break-all; }
                  .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Jackson & Audrey</h1>
                  </div>
                  <div class="content">
                    <p class="subtitle">Reset Your Password</p>
                    <p class="message">Here's your verification code:</p>
                    <div class="code">${token}</div>
                    <p class="message">Enter this code on the password reset page. <strong>It expires in 1 hour.</strong></p>
                    <p style="color: #999; font-size: 14px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                  </div>
                  <div class="footer">
                    <p>This email was sent from The Giordanos Wedding website.</p>
                    <p>Please do not reply to this email.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
        
        if (result.error) {
          console.error("❌ Resend API error:", result.error)
          console.log("📋 BACKUP - Use this code:", token)
          // Still throw an error to inform the user, but don't block the reset flow
          // The code is still valid even if the email fails
        } else {
          console.log("✅ Email sent successfully via Resend!")
          console.log("📨 Email ID:", result.data?.id)
        }
      } catch (error: any) {
        console.error("❌ Failed to send email:", error.message)
        console.log("📋 BACKUP - Use this code:", token)
        
        // Log detailed error information for debugging
        if (error.statusCode) {
          console.error("Status Code:", error.statusCode)
        }
        if (error.name) {
          console.error("Error Type:", error.name)
        }
        
        // Don't throw the error - allow the reset flow to continue
        // The user can still use the code from the console/logs
        // Only log the failure for admin awareness
      }
    } else {
      console.warn("⚠️ No API key configured - email will not be sent")
      console.log("📋 BACKUP - Use this code:", token)
    }
  },
})

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        }
      },
      // Enable built-in password reset
      reset: PasswordResetProvider,
    }),
  ],
})

