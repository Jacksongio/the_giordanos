"use node"

import { internalAction } from "./_generated/server"
import { v } from "convex/values"
import { Resend } from "resend"
import twilio from "twilio"

export const sendInviteEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.AUTH_RESEND_KEY
    const from =
      process.env.AUTH_RESEND_FROM ||
      "The Giordanos Wedding <onboarding@resend.dev>"
    const siteUrl = process.env.SITE_URL || "https://thegiordanos.net"
    const inviteUrl = `${siteUrl}/invite?token=${args.token}`

    console.log("💌 SENDING INVITE EMAIL to", args.email)
    console.log("🔗 Invite URL:", inviteUrl)

    if (!apiKey) {
      console.warn("⚠️ No API key configured - email will not be sent")
      return
    }

    try {
      const resend = new Resend(apiKey)
      const result = await resend.emails.send({
        from,
        to: [args.email],
        subject: "You're Invited! - The Giordanos Wedding",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #faf8f5; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #6b7f5e 0%, #8fa87e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
                .header p { margin: 10px 0 0; font-size: 14px; opacity: 0.9; letter-spacing: 1px; }
                .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; text-align: center; }
                .greeting { font-size: 20px; color: #6b7f5e; margin-bottom: 20px; }
                .details { font-size: 16px; color: #555; margin: 20px 0; }
                .details strong { color: #333; }
                .cta-button { display: inline-block; background: linear-gradient(135deg, #6b7f5e 0%, #8fa87e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 16px; letter-spacing: 1px; margin: 30px 0; }
                .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Jackson & Audrey</h1>
                  <p>REQUEST THE PLEASURE OF YOUR COMPANY</p>
                </div>
                <div class="content">
                  <p class="greeting">Dear ${args.name},</p>
                  <p class="details">
                    We joyfully invite you to celebrate our wedding on<br/>
                    <strong>Sunday, May 30, 2027</strong><br/>
                    at <strong>Raspberry Manor</strong><br/>
                    16500 Agape Ln, Leesburg, VA 20176
                  </p>
                  <a href="${inviteUrl}" class="cta-button">Open Your Invitation</a>
                  <p style="color: #999; font-size: 14px; margin-top: 20px;">
                    Click the button above to view your personalized invitation and RSVP.
                  </p>
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
      } else {
        console.log("✅ Invite email sent successfully!")
        console.log("📨 Email ID:", result.data?.id)
      }
    } catch (error: any) {
      console.error("❌ Failed to send invite email:", error.message)
    }
  },
})

export const sendInviteSms = internalAction({
  args: {
    phone: v.string(),
    name: v.string(),
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromPhone = process.env.TWILIO_PHONE_NUMBER
    const siteUrl = process.env.SITE_URL || "https://thegiordanos.net"
    const inviteUrl = `${siteUrl}/invite?token=${args.token}`

    console.log("📱 SENDING INVITE SMS to", args.phone)

    if (!accountSid || !authToken || !fromPhone) {
      console.warn("⚠️ Twilio not configured - SMS will not be sent")
      return
    }

    try {
      const client = twilio(accountSid, authToken)
      const message = await client.messages.create({
        body: `${args.name}, you're invited to Jackson & Audrey's wedding! Open your invitation and RSVP here: ${inviteUrl}`,
        from: fromPhone,
        to: args.phone,
      })

      console.log("✅ SMS sent! SID:", message.sid)
    } catch (error: any) {
      console.error("❌ Failed to send SMS:", error.message)
    }
  },
})

export const sendAccountSetupEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.AUTH_RESEND_KEY
    const from =
      process.env.AUTH_RESEND_FROM ||
      "The Giordanos Wedding <onboarding@resend.dev>"
    const siteUrl = process.env.SITE_URL || "https://thegiordanos.net"
    const setupUrl = `${siteUrl}/setup-account?email=${encodeURIComponent(args.email)}&name=${encodeURIComponent(args.name)}`

    console.log("🔑 SENDING ACCOUNT SETUP EMAIL to", args.email)

    if (!apiKey) {
      console.warn("⚠️ No API key configured - email will not be sent")
      return
    }

    try {
      const resend = new Resend(apiKey)
      const result = await resend.emails.send({
        from,
        to: [args.email],
        subject: "Set Up Your Account - The Giordanos Wedding",
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
                .greeting { font-size: 20px; color: #6b7f5e; margin-bottom: 20px; }
                .message { font-size: 16px; color: #555; margin: 15px 0; }
                .features { background: #f5f3ef; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; }
                .features ul { margin: 10px 0; padding-left: 20px; }
                .features li { margin: 8px 0; color: #555; }
                .cta-button { display: inline-block; background: linear-gradient(135deg, #6b7f5e 0%, #8fa87e 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 16px; letter-spacing: 1px; margin: 25px 0; }
                .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Jackson & Audrey</h1>
                </div>
                <div class="content">
                  <p class="greeting">Dear ${args.name},</p>
                  <p class="message">Thank you for your RSVP! Set up your account to access all the fun features on our wedding site:</p>
                  <div class="features">
                    <ul>
                      <li>Suggest songs for the DJ playlist</li>
                      <li>Vote on signature cocktails for the bar</li>
                      <li>Play wedding trivia</li>
                      <li>See the guest list</li>
                    </ul>
                  </div>
                  <a href="${setupUrl}" class="cta-button">Set Up Your Account</a>
                  <p style="color: #999; font-size: 14px; margin-top: 20px;">
                    Just choose a password and you're all set!
                  </p>
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
      } else {
        console.log("✅ Account setup email sent!")
        console.log("📨 Email ID:", result.data?.id)
      }
    } catch (error: any) {
      console.error("❌ Failed to send account setup email:", error.message)
    }
  },
})

export const sendRsvpConfirmation = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    attending: v.boolean(),
    guestCount: v.number(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.AUTH_RESEND_KEY
    const from =
      process.env.AUTH_RESEND_FROM ||
      "The Giordanos Wedding <onboarding@resend.dev>"

    console.log("📧 SENDING RSVP CONFIRMATION to", args.email)

    if (!apiKey) {
      console.warn("⚠️ No API key configured - email will not be sent")
      return
    }

    const attendingContent = `
      <p class="greeting">Dear ${args.name},</p>
      <p class="message">We're thrilled that you'll be joining us on our special day!</p>
      <div class="summary">
        <h3>Your RSVP Summary</h3>
        <p><strong>Attending:</strong> Yes</p>
        <p><strong>Number of Guests:</strong> ${args.guestCount}</p>
      </div>
      <p class="details">
        <strong>Sunday, May 30, 2027</strong><br/>
        Raspberry Manor<br/>
        16500 Agape Ln, Leesburg, VA 20176
      </p>
      <p style="color: #999; font-size: 14px;">We can't wait to celebrate with you!</p>
    `

    const declinedContent = `
      <p class="greeting">Dear ${args.name},</p>
      <p class="message">We're sorry you won't be able to make it, but we completely understand.</p>
      <div class="summary">
        <h3>Your RSVP Summary</h3>
        <p><strong>Attending:</strong> No</p>
      </div>
      <p style="color: #999; font-size: 14px;">We'll miss you! Thank you for letting us know.</p>
    `

    try {
      const resend = new Resend(apiKey)
      const result = await resend.emails.send({
        from,
        to: [args.email],
        subject: args.attending
          ? "RSVP Confirmed! - The Giordanos Wedding"
          : "RSVP Received - The Giordanos Wedding",
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
                .greeting { font-size: 20px; color: #6b7f5e; margin-bottom: 10px; }
                .message { font-size: 16px; color: #555; }
                .summary { background: #f5f3ef; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; }
                .summary h3 { margin: 0 0 10px; color: #6b7f5e; }
                .summary p { margin: 5px 0; }
                .details { font-size: 16px; color: #555; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Jackson & Audrey</h1>
                </div>
                <div class="content">
                  ${args.attending ? attendingContent : declinedContent}
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
      } else {
        console.log("✅ RSVP confirmation email sent!")
        console.log("📨 Email ID:", result.data?.id)
      }
    } catch (error: any) {
      console.error("❌ Failed to send confirmation email:", error.message)
    }
  },
})
