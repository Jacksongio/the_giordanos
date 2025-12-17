import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getUserTriviaScore = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]
    
    // Get the user's trivia score
    const score = await ctx.db
      .query("triviaScores")
      .withIndex("by_user", (q) => q.eq("user_id", userId as any))
      .first()

    return score
  },
})

export const saveTriviaScore = mutation({
  args: {
    score: v.number(),
    total_questions: v.number(),
    percentage: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be signed in to save trivia score")
    }

    // Extract the user ID from the subject (format: "userId|sessionId")
    const userId = identity.subject.split("|")[0]
    
    // Check if user already has a score
    const existingScore = await ctx.db
      .query("triviaScores")
      .withIndex("by_user", (q) => q.eq("user_id", userId as any))
      .first()

    if (existingScore) {
      // Update existing score
      await ctx.db.patch(existingScore._id, {
        score: args.score,
        total_questions: args.total_questions,
        percentage: args.percentage,
        completed_at: Date.now(),
      })
      return existingScore._id
    } else {
      // Create new score
      const scoreId = await ctx.db.insert("triviaScores", {
        user_id: userId as any,
        score: args.score,
        total_questions: args.total_questions,
        percentage: args.percentage,
        completed_at: Date.now(),
      })
      return scoreId
    }
  },
})

export const getLeaderboard = query({
  handler: async (ctx) => {
    // Get all trivia scores
    const scores = await ctx.db.query("triviaScores").collect()
    
    // Get user information for each score
    const leaderboard = await Promise.all(
      scores.map(async (score) => {
        try {
          const user = await ctx.db.get(score.user_id)
          if (!user) {
            return {
              ...score,
              userName: "Unknown User",
            }
          }
          
          // Get user name from user document or use email
          const userName = (user as any).name || (user as any).email || "User"
          
          return {
            ...score,
            userName,
          }
        } catch (error) {
          console.error("Error getting user for score:", error)
          return {
            ...score,
            userName: "Unknown User",
          }
        }
      })
    )
    
    // Sort by percentage (descending), then by score (descending), then by completed_at (ascending - earlier is better)
    return leaderboard.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage
      }
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return a.completed_at - b.completed_at
    })
  },
})

