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
              <meta name="color-scheme" content="light" />
              <meta name="supported-color-schemes" content="light" />
            </head>
            <body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #e8e4de;">
              <div style="max-width: 580px; margin: 0 auto; padding: 40px 20px;">

                <!-- Header -->
                <div style="background-color: #4e6343; text-align: center; padding: 52px 40px 44px; border-radius: 12px 12px 0 0;">
                  <p style="margin: 0 0 10px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #a8c498;">Jackson &amp; Audrey</p>
                  <div style="width: 40px; height: 1px; background-color: #7a9e6a; margin: 0 auto 18px;"></div>
                  <h1 style="margin: 0 0 18px; font-size: 36px; font-weight: 300; letter-spacing: 3px; color: #ffffff; font-style: italic;">You're Invited</h1>
                  <div style="width: 40px; height: 1px; background-color: #7a9e6a; margin: 0 auto 18px;"></div>
                  <p style="margin: 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #a8c498;">Request the pleasure of your company</p>
                </div>

                <!-- Body -->
                <div style="background-color: #fdfbf7; padding: 48px 48px 44px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #d4ccc2; border-top: none;">

                  <p style="font-size: 22px; color: #4e6343; margin: 0 0 10px; font-style: italic;">Dear ${args.name},</p>
                  <p style="font-size: 15px; color: #777777; margin: 0 0 32px; letter-spacing: 0.5px;">We joyfully invite you to celebrate our wedding</p>

                  <!-- Divider -->
                  <div style="width: 60px; height: 1px; background-color: #c8bfb4; margin: 0 auto 32px;"></div>

                  <!-- Date & Venue block -->
                  <div style="background-color: #f4f0ea; border-radius: 10px; padding: 28px 32px; margin: 0 auto 32px; display: inline-block; width: 100%; box-sizing: border-box;">
                    <p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #8a9e7a;">When</p>
                    <p style="margin: 0 0 20px; font-size: 18px; color: #333333; font-weight: normal;">Sunday, May 30, 2027</p>
                    <div style="width: 30px; height: 1px; background-color: #c8bfb4; margin: 0 auto 20px;"></div>
                    <p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #8a9e7a;">Where</p>
                    <p style="margin: 0 0 6px; font-size: 18px; color: #333333; font-weight: normal;">Raspberry Manor</p>
                    <p style="margin: 0; font-size: 14px; color: #888888;">16500 Agape Ln, Leesburg, VA 20176</p>
                  </div>

                  <!-- Divider -->
                  <div style="width: 60px; height: 1px; background-color: #c8bfb4; margin: 0 auto 32px;"></div>

                  <a href="${inviteUrl}" style="display: inline-block; background-color: #4e6343; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 40px; font-size: 15px; letter-spacing: 1.5px; font-family: Georgia, 'Times New Roman', serif;">Open Your Invitation &amp; RSVP</a>
                  <p style="color: #aaaaaa; font-size: 12px; margin: 20px 0 0; letter-spacing: 0.3px;">Click above to view your personalized invitation and RSVP.</p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; margin-top: 24px; color: #999999; font-size: 11px; letter-spacing: 0.5px;">
                  <p style="margin: 4px 0;">This email was sent from The Giordanos Wedding website.</p>
                  <p style="margin: 4px 0;">Please do not reply to this email.</p>
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
              <meta name="color-scheme" content="light" />
              <meta name="supported-color-schemes" content="light" />
            </head>
            <body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #eae6e0;">
              <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px;">
                <div style="background-color: #5a6e4d; color: #ffffff; padding: 36px 36px; text-align: center; border-radius: 10px 10px 0 0;">
                  <p style="margin: 0 0 6px; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #c8d8bc;">Jackson &amp; Audrey</p>
                  <h1 style="margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 2px; color: #ffffff;">Set Up Your Account</h1>
                </div>
                <div style="background-color: #fffdf9; padding: 44px 36px; border-radius: 0 0 10px 10px; text-align: center; border: 1px solid #d8d0c4; border-top: none;">
                  <p style="font-size: 21px; color: #5a6e4d; margin: 0 0 16px; font-style: italic;">Dear ${args.name},</p>
                  <p style="font-size: 16px; color: #555555; margin: 0 0 24px;">Thank you for your RSVP! Set up your account to access all the fun features on our wedding site:</p>
                  <div style="background-color: #f0ece5; border-radius: 8px; padding: 20px 28px; margin: 0 0 28px; text-align: left;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #444444; padding-left: 4px;">&#127925; Suggest songs for the DJ playlist</p>
                    <p style="margin: 0 0 8px; font-size: 15px; color: #444444; padding-left: 4px;">&#127378; Vote on signature cocktails for the bar</p>
                    <p style="margin: 0 0 8px; font-size: 15px; color: #444444; padding-left: 4px;">&#127381; Play wedding trivia</p>
                    <p style="margin: 0; font-size: 15px; color: #444444; padding-left: 4px;">&#128101; See the guest list</p>
                  </div>
                  <a href="${setupUrl}" style="display: inline-block; background-color: #5a6e4d; color: #ffffff; text-decoration: none; padding: 16px 44px; border-radius: 30px; font-size: 16px; letter-spacing: 1px; margin: 0 0 20px; font-family: Georgia, 'Times New Roman', serif;">Set Up Your Account</a>
                  <p style="color: #999999; font-size: 13px; margin: 8px 0 0;">Just choose a password and you're all set!</p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
                  <p style="margin: 4px 0;">This email was sent from The Giordanos Wedding website.</p>
                  <p style="margin: 4px 0;">Please do not reply to this email.</p>
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
      <p style="font-size: 21px; color: #5a6e4d; margin: 0 0 16px; font-style: italic;">Dear ${args.name},</p>
      <p style="font-size: 16px; color: #555555; margin: 0 0 24px;">We're thrilled that you'll be joining us on our special day!</p>
      <div style="background-color: #f0ece5; border-radius: 8px; padding: 20px 24px; margin: 0 0 24px; text-align: left;">
        <p style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: #5a6e4d;">Your RSVP Summary</p>
        <p style="margin: 4px 0; font-size: 15px; color: #444444;"><strong style="color: #333333;">Attending:</strong> Yes</p>
        <p style="margin: 4px 0; font-size: 15px; color: #444444;"><strong style="color: #333333;">Number of Guests:</strong> ${args.guestCount}</p>
      </div>
      <div style="background-color: #5a6e4d; color: #ffffff; border-radius: 8px; padding: 20px 24px; margin: 0 0 24px; text-align: left;">
        <p style="margin: 0 0 6px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; color: #c8d8bc;">Save the Date</p>
        <p style="margin: 0 0 4px; font-size: 16px; font-weight: bold; color: #ffffff;">Sunday, May 30, 2027</p>
        <p style="margin: 0 0 2px; font-size: 15px; color: #c8d8bc;">Raspberry Manor</p>
        <p style="margin: 0; font-size: 14px; color: #adc0a0;">16500 Agape Ln, Leesburg, VA 20176</p>
      </div>
      <p style="color: #999999; font-size: 14px; margin: 0;">We can't wait to celebrate with you!</p>
    `

    const declinedContent = `
      <p style="font-size: 21px; color: #5a6e4d; margin: 0 0 16px; font-style: italic;">Dear ${args.name},</p>
      <p style="font-size: 16px; color: #555555; margin: 0 0 24px;">We're sorry you won't be able to make it, but we completely understand.</p>
      <div style="background-color: #f0ece5; border-radius: 8px; padding: 20px 24px; margin: 0 0 24px; text-align: left;">
        <p style="margin: 0 0 6px; font-size: 15px; font-weight: bold; color: #5a6e4d;">Your RSVP Summary</p>
        <p style="margin: 4px 0; font-size: 15px; color: #444444;"><strong style="color: #333333;">Attending:</strong> No</p>
      </div>
      <p style="color: #999999; font-size: 14px; margin: 0;">We'll miss you! Thank you for letting us know.</p>
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
              <meta name="color-scheme" content="light" />
              <meta name="supported-color-schemes" content="light" />
            </head>
            <body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #eae6e0;">
              <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px;">
                <div style="background-color: #5a6e4d; color: #ffffff; padding: 36px 36px; text-align: center; border-radius: 10px 10px 0 0;">
                  <p style="margin: 0 0 6px; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #c8d8bc;">Jackson &amp; Audrey</p>
                  <h1 style="margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 2px; color: #ffffff;">${args.attending ? "We'll See You There!" : "RSVP Received"}</h1>
                </div>
                <div style="background-color: #fffdf9; padding: 44px 36px; border-radius: 0 0 10px 10px; text-align: center; border: 1px solid #d8d0c4; border-top: none;">
                  ${args.attending ? attendingContent : declinedContent}
                </div>
                <div style="text-align: center; margin-top: 20px; color: #888888; font-size: 12px;">
                  <p style="margin: 4px 0;">This email was sent from The Giordanos Wedding website.</p>
                  <p style="margin: 4px 0;">Please do not reply to this email.</p>
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
