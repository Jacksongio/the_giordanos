import { query, QueryCtx, MutationCtx } from "./_generated/server"

async function getUserProfile(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  const userId = identity.subject.split("|")[0]
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId as any))
    .unique()
  return profile
}

export async function assertAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Not authenticated")
  const profile = await getUserProfile(ctx)
  if (!profile?.isAdmin) {
    throw new Error("Not authorized")
  }
  return identity
}

export const isAdmin = query({
  handler: async (ctx) => {
    const profile = await getUserProfile(ctx)
    return profile?.isAdmin === true
  },
})

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]

    // Get the user document
    const user = await ctx.db.get(userId as any)

    if (!user) {
      console.log("User not found for ID:", userId)
      return null
    }

    // Return user identity information including the user ID
    return {
      _id: user._id,
      name: identity.name || user.name,
      email: identity.email || user.email,
      pictureUrl: identity.pictureUrl,
      tokenIdentifier: identity.tokenIdentifier,
      subject: identity.subject,
    }
  },
})

