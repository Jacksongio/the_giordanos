import { query } from "./_generated/server"

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    // Return user identity information
    return {
      name: identity.name,
      email: identity.email,
      pictureUrl: identity.pictureUrl,
      tokenIdentifier: identity.tokenIdentifier,
    }
  },
})

