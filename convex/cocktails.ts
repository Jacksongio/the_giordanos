import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getCocktails = query({
  handler: async (ctx) => {
    const cocktails = await ctx.db
      .query("cocktails")
      .withIndex("by_votes")
      .order("desc")
      .collect()

    return cocktails
  },
})

export const upvoteCocktail = mutation({
  args: { cocktailId: v.id("cocktails") },
  handler: async (ctx, args) => {
    const cocktail = await ctx.db.get(args.cocktailId)
    if (!cocktail) {
      throw new Error("Cocktail not found")
    }

    await ctx.db.patch(args.cocktailId, {
      votes: cocktail.votes + 1,
    })
  },
})

export const downvoteCocktail = mutation({
  args: { cocktailId: v.id("cocktails") },
  handler: async (ctx, args) => {
    const cocktail = await ctx.db.get(args.cocktailId)
    if (!cocktail) {
      throw new Error("Cocktail not found")
    }

    await ctx.db.patch(args.cocktailId, {
      votes: Math.max(0, cocktail.votes - 1),
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
    await ctx.db.insert("cocktails", {
      name: args.name,
      description: args.description,
      ingredients: args.ingredients,
      votes: 0,
      created_at: Date.now(),
    })
  },
})

