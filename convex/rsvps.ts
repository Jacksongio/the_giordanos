import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { assertAdmin } from "./users"
import { internal } from "./_generated/api"

export const submitRsvp = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    attending: v.boolean(),
    guestCount: v.number(),
    guestNames: v.array(v.string()),
    mealChoices: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check deadline
    const deadline = process.env.RSVP_DEADLINE
    if (deadline && Date.now() > new Date(deadline).getTime()) {
      throw new Error("RSVP deadline has passed")
    }

    // Validate invite token
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()

    if (!invite) throw new Error("Invalid invite token")

    // Check if already RSVP'd
    const existingRsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
      .unique()

    if (existingRsvp) {
      throw new Error("You have already RSVP'd. Use update instead.")
    }

    // Validate guest count
    if (args.attending) {
      if (args.guestCount < 1 || args.guestCount > invite.maxGuests) {
        throw new Error(`Guest count must be between 1 and ${invite.maxGuests}`)
      }
      if (args.guestNames.length !== args.guestCount) {
        throw new Error("Please provide a name for each guest")
      }
    }

    // Get userId if authenticated
    let userId = undefined
    const identity = await ctx.auth.getUserIdentity()
    if (identity) {
      const userIdStr = identity.subject.split("|")[0]
      const user = await ctx.db.get(userIdStr as any)
      if (user) userId = user._id
    }

    // Resolve email: use invite email if available, otherwise require from form
    const rsvpEmail = invite.email || args.email?.toLowerCase().trim()
    if (!rsvpEmail) {
      throw new Error("Please provide your email address")
    }

    // If invite didn't have an email, save it on the invite for future reference
    if (!invite.email && rsvpEmail) {
      await ctx.db.patch(invite._id, { email: rsvpEmail })
    }

    const now = Date.now()
    const rsvpId = await ctx.db.insert("rsvps", {
      inviteId: invite._id,
      userId,
      email: rsvpEmail,
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
      guestNames: args.attending ? args.guestNames.map((n) => n.trim()) : [],
      mealChoices: args.attending ? args.mealChoices : [],
      dietaryRestrictions: args.dietaryRestrictions?.trim() || undefined,
      message: args.message?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    })

    // Mark invite as used
    await ctx.db.patch(invite._id, { used: true })

    // Send confirmation email
    await ctx.scheduler.runAfter(0, internal.emails.sendRsvpConfirmation, {
      email: rsvpEmail,
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
    })

    // Send account setup email (delayed slightly so confirmation arrives first)
    if (!userId) {
      await ctx.scheduler.runAfter(2000, internal.emails.sendAccountSetupEmail, {
        email: rsvpEmail,
        name: args.name.trim(),
      })
    }

    return rsvpId
  },
})

export const updateRsvp = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    attending: v.boolean(),
    guestCount: v.number(),
    guestNames: v.array(v.string()),
    mealChoices: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check deadline
    const deadline = process.env.RSVP_DEADLINE
    if (deadline && Date.now() > new Date(deadline).getTime()) {
      throw new Error("RSVP deadline has passed")
    }

    // Validate invite token
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()

    if (!invite) throw new Error("Invalid invite token")

    const existingRsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
      .unique()

    if (!existingRsvp) {
      throw new Error("No existing RSVP found to update")
    }

    // Validate guest count
    if (args.attending) {
      if (args.guestCount < 1 || args.guestCount > invite.maxGuests) {
        throw new Error(`Guest count must be between 1 and ${invite.maxGuests}`)
      }
      if (args.guestNames.length !== args.guestCount) {
        throw new Error("Please provide a name for each guest")
      }
    }

    await ctx.db.patch(existingRsvp._id, {
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
      guestNames: args.attending ? args.guestNames.map((n) => n.trim()) : [],
      mealChoices: args.attending ? args.mealChoices : [],
      dietaryRestrictions: args.dietaryRestrictions?.trim() || undefined,
      message: args.message?.trim() || undefined,
      updatedAt: Date.now(),
    })

    // Send updated confirmation email
    await ctx.scheduler.runAfter(0, internal.emails.sendRsvpConfirmation, {
      email: invite.email,
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
    })

    return existingRsvp._id
  },
})

export const getRsvpByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique()

    if (!invite) return null

    return await ctx.db
      .query("rsvps")
      .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
      .unique()
  },
})

export const listRsvps = query({
  handler: async (ctx) => {
    await assertAdmin(ctx)
    return await ctx.db.query("rsvps").order("desc").collect()
  },
})

export const adminUpdateRsvp = mutation({
  args: {
    rsvpId: v.id("rsvps"),
    name: v.string(),
    attending: v.boolean(),
    guestCount: v.number(),
    guestNames: v.array(v.string()),
    mealChoices: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const rsvp = await ctx.db.get(args.rsvpId)
    if (!rsvp) throw new Error("RSVP not found")

    await ctx.db.patch(args.rsvpId, {
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
      guestNames: args.attending ? args.guestNames.map((n) => n.trim()) : [],
      mealChoices: args.attending ? args.mealChoices : [],
      dietaryRestrictions: args.dietaryRestrictions?.trim() || undefined,
      message: args.message?.trim() || undefined,
      updatedAt: Date.now(),
    })
  },
})

export const adminDeleteRsvp = mutation({
  args: { rsvpId: v.id("rsvps") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    const rsvp = await ctx.db.get(args.rsvpId)
    if (!rsvp) throw new Error("RSVP not found")

    // Unmark the invite as used so it can be re-used
    const invite = await ctx.db.get(rsvp.inviteId)
    if (invite) {
      await ctx.db.patch(invite._id, { used: false })
    }

    await ctx.db.delete(args.rsvpId)
  },
})

export const adminCreateRsvp = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    attending: v.boolean(),
    guestCount: v.number(),
    guestNames: v.array(v.string()),
    mealChoices: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx)

    // Find invite by email
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first()

    if (!invite) throw new Error("No invite found for this email. Create an invite first.")

    // Check if RSVP already exists
    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_invite", (q) => q.eq("inviteId", invite._id))
      .unique()

    if (existing) throw new Error("An RSVP already exists for this invite.")

    const now = Date.now()
    await ctx.db.insert("rsvps", {
      inviteId: invite._id,
      email: args.email.toLowerCase().trim(),
      name: args.name.trim(),
      attending: args.attending,
      guestCount: args.attending ? args.guestCount : 0,
      guestNames: args.attending ? args.guestNames.map((n) => n.trim()) : [],
      mealChoices: args.attending ? args.mealChoices : [],
      dietaryRestrictions: args.dietaryRestrictions?.trim() || undefined,
      message: args.message?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.patch(invite._id, { used: true })
  },
})

export const getAttendingGuests = query({
  handler: async (ctx) => {
    const rsvps = await ctx.db.query("rsvps").collect()
    return rsvps
      .filter((r) => r.attending)
      .map((r) => ({
        name: r.name,
        guestCount: r.guestCount,
        guestNames: r.guestNames,
      }))
  },
})

export const checkEmailHasRsvp = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first()
    return !!rsvp
  },
})

export const linkRsvpToCurrentUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity?.email) return null

    const userIdStr = identity.subject.split("|")[0]
    const user = await ctx.db.get(userIdStr as any)
    if (!user) return null

    // Find unlinked RSVPs matching this email
    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_email", (q) => q.eq("email", identity.email!.toLowerCase()))
      .collect()

    let linked = 0
    for (const rsvp of rsvps) {
      if (!rsvp.userId) {
        await ctx.db.patch(rsvp._id, { userId: user._id })
        linked++
      }
    }

    return linked
  },
})

export const getRsvpStats = query({
  handler: async (ctx) => {
    await assertAdmin(ctx)

    const allInvites = await ctx.db.query("invites").collect()
    const allRsvps = await ctx.db.query("rsvps").collect()

    const attending = allRsvps.filter((r) => r.attending)
    const declined = allRsvps.filter((r) => !r.attending)
    const totalGuests = attending.reduce((sum, r) => sum + r.guestCount, 0)

    return {
      totalInvited: allInvites.length,
      responded: allRsvps.length,
      pending: allInvites.length - allRsvps.length,
      attending: attending.length,
      declined: declined.length,
      totalGuests,
    }
  },
})
