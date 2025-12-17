import { query } from "./_generated/server"

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

