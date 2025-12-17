import { query } from "./_generated/server"

export const testAuth = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    console.log("Auth identity:", identity)
    return {
      isAuthenticated: !!identity,
      user: identity
        ? {
            name: identity.name,
            email: identity.email,
          }
        : null,
    }
  },
})

