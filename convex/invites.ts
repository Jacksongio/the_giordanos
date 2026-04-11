import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { assertAdmin } from "./users"
import { internal } from "./_generated/api"

export const createInvite = mutation({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.string(),
    maxGuests: v.number(),
    sendEmail: v.optional(v.boolean()),
    sendSms: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    if (!args.email && !args.phone) {
      throw new Error("At least an email or phone number is required")
    }

    if (args.maxGuests < 1 || args.maxGuests > 4) {
      throw new Error("Max guests must be between 1 and 4")
    }

    const token = crypto.randomUUID()
    const inviteId = await ctx.db.insert("invites", {
      token,
      email: args.email?.toLowerCase().trim() || undefined,
      phone: args.phone?.trim() || undefined,
      name: args.name.trim(),
      maxGuests: args.maxGuests,
      used: false,
      createdAt: Date.now(),
    })

    if (args.sendEmail && args.email) {
      await ctx.scheduler.runAfter(0, internal.emails.sendInviteEmail, {
        email: args.email.toLowerCase().trim(),
        name: args.name.trim(),
        token,
      })
    }

    if (args.sendSms && args.phone) {
      await ctx.scheduler.runAfter(0, internal.emails.sendInviteSms, {
        phone: args.phone.trim(),
        name: args.name.trim(),
        token,
      })
    }

    return { inviteId, token }
  },
})

export const createBulkInvites = mutation({
  args: {
    invites: v.array(
      v.object({
        email: v.string(),
        name: v.string(),
        maxGuests: v.number(),
      })
    ),
    sendEmails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const results = []
    for (const invite of args.invites) {
      if (invite.maxGuests < 1 || invite.maxGuests > 4) {
        throw new Error(`Max guests must be between 1 and 4 for ${invite.email}`)
      }

      const token = crypto.randomUUID()
      const inviteId = await ctx.db.insert("invites", {
        token,
        email: invite.email.toLowerCase().trim(),
        name: invite.name.trim(),
        maxGuests: invite.maxGuests,
        used: false,
        createdAt: Date.now(),
      })

      if (args.sendEmails) {
        await ctx.scheduler.runAfter(0, internal.emails.sendInviteEmail, {
          email: invite.email.toLowerCase().trim(),
          name: invite.name.trim(),
          token,
        })
      }

      results.push({ inviteId, token, email: invite.email })
    }

    return results
  },
})

export const getInviteByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()

    if (!invite) return null

    // Check if there's an existing RSVP for this invite
    const existingRsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
      .unique()

    return { ...invite, existingRsvp }
  },
})

export const listInvites = query({
  handler: async (ctx) => {
    await assertAdmin(ctx)

    const invites = await ctx.db.query("invites").order("desc").collect()

    // Join with RSVPs
    const invitesWithRsvps = await Promise.all(
      invites.map(async (invite) => {
        const rsvp = await ctx.db
          .query("rsvps")
          .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
          .unique()
        return { ...invite, rsvp }
      })
    )

    return invitesWithRsvps
  },
})

export const deleteInvite = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const invite = await ctx.db.get(args.inviteId)
    if (!invite) throw new Error("Invite not found")
    if (invite.used) throw new Error("Cannot delete an invite that has been used")

    await ctx.db.delete(args.inviteId)
  },
})

export const resendInviteEmail = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const invite = await ctx.db.get(args.inviteId)
    if (!invite) throw new Error("Invite not found")
    if (!invite.email) throw new Error("No email on this invite")

    await ctx.scheduler.runAfter(0, internal.emails.sendInviteEmail, {
      email: invite.email,
      name: invite.name,
      token: invite.token,
    })
  },
})

export const resendInviteSms = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const invite = await ctx.db.get(args.inviteId)
    if (!invite) throw new Error("Invite not found")
    if (!invite.phone) throw new Error("No phone number on this invite")

    await ctx.scheduler.runAfter(0, internal.emails.sendInviteSms, {
      phone: invite.phone,
      name: invite.name,
      token: invite.token,
    })
  },
})
