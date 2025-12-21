import { Password } from "@convex-dev/auth/providers/Password"
import { convexAuth } from "@convex-dev/auth/server"
import Google from "@auth/core/providers/google"
import Resend from "@auth/core/providers/resend"
import { Resend as ResendAPI } from "resend"

// Email provider for password reset using Resend (FREE 100 emails/day!)
const PasswordResetProvider = Resend({
  id: "password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  from: process.env.AUTH_RESEND_FROM || "The Giordanos Wedding <onboarding@resend.dev>",
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
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 The Giordanos Wedding</h1>
                  </div>
                  <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>You requested to reset your password. Here's your verification code:</p>
                    <div class="code">${token}</div>
                    <p>Enter this code on the password reset page to continue.</p>
                    <p><strong>This code will expire in 1 hour.</strong></p>
                    <p>If you didn't request this password reset, you can safely ignore this email.</p>
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
    Google,
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

