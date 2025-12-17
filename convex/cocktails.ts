import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getCocktails = query({
  handler: async (ctx) => {
    const cocktails = await ctx.db.query("cocktails").collect()

    // Sort by net score (upvotes - downvotes) descending, then by created_at
    return cocktails.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }
      return b.created_at - a.created_at
    })
  },
})

export const addCocktail = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    ingredients: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be signed in to suggest cocktails")
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]
    
    // Get the user document
    const user = await ctx.db.get(userId as any)

    if (!user) {
      throw new Error("User not found")
    }

    // Get user's name from identity or user document
    const userName = identity.name || (user as any).name || identity.email || "User"

    const cocktailId = await ctx.db.insert("cocktails", {
      name: args.name,
      description: args.description,
      ingredients: args.ingredients,
      suggested_by_user_id: user._id,
      suggested_by_name: userName,
      upvotes: 0,
      downvotes: 0,
      upvoted_by: [],
      downvoted_by: [],
      created_at: Date.now(),
    })

    return await ctx.db.get(cocktailId)
  },
})

export const upvoteCocktail = mutation({
  args: { cocktailId: v.id("cocktails") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be signed in to vote")
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]
    
    // Get the user document
    const user = await ctx.db.get(userId as any)

    if (!user) {
      throw new Error("User not found")
    }

    const cocktail = await ctx.db.get(args.cocktailId)
    if (!cocktail) {
      throw new Error("Cocktail not found")
    }

    // Remove from downvoted if previously downvoted
    const downvoted_by = cocktail.downvoted_by.filter((id) => id !== user._id)
    const removedDownvote = downvoted_by.length < cocktail.downvoted_by.length

    // Toggle upvote
    let upvoted_by = [...cocktail.upvoted_by]
    let upvotes = cocktail.upvotes
    
    if (upvoted_by.includes(user._id)) {
      // Remove upvote
      upvoted_by = upvoted_by.filter((id) => id !== user._id)
      upvotes = Math.max(0, upvotes - 1)
    } else {
      // Add upvote
      upvoted_by.push(user._id)
      upvotes = upvotes + 1
    }

    await ctx.db.patch(args.cocktailId, {
      upvotes,
      downvotes: removedDownvote ? Math.max(0, cocktail.downvotes - 1) : cocktail.downvotes,
      upvoted_by,
      downvoted_by,
    })
  },
})

export const downvoteCocktail = mutation({
  args: { cocktailId: v.id("cocktails") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be signed in to vote")
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]
    
    // Get the user document
    const user = await ctx.db.get(userId as any)

    if (!user) {
      throw new Error("User not found")
    }

    const cocktail = await ctx.db.get(args.cocktailId)
    if (!cocktail) {
      throw new Error("Cocktail not found")
    }

    // Remove from upvoted if previously upvoted
    const upvoted_by = cocktail.upvoted_by.filter((id) => id !== user._id)
    const removedUpvote = upvoted_by.length < cocktail.upvoted_by.length

    // Toggle downvote
    let downvoted_by = [...cocktail.downvoted_by]
    let downvotes = cocktail.downvotes
    
    if (downvoted_by.includes(user._id)) {
      // Remove downvote
      downvoted_by = downvoted_by.filter((id) => id !== user._id)
      downvotes = Math.max(0, downvotes - 1)
    } else {
      // Add downvote
      downvoted_by.push(user._id)
      downvotes = downvotes + 1
    }

    await ctx.db.patch(args.cocktailId, {
      upvotes: removedUpvote ? Math.max(0, cocktail.upvotes - 1) : cocktail.upvotes,
      downvotes,
      upvoted_by,
      downvoted_by,
    })
  },
})
