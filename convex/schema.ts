import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  
  // User profiles with additional wedding-specific fields
  userProfiles: defineTable({
    userId: v.id("users"),
    additionalGuests: v.optional(v.array(v.string())),
    maxGuests: v.optional(v.number()),
  }).index("by_user", ["userId"]),
  
  songs: defineTable({
    song_name: v.string(),
    artist_name: v.string(),
    spotify_id: v.optional(v.string()),
    album_image: v.optional(v.string()),
    suggested_by_user_id: v.id("users"),
    suggested_by_name: v.string(),
    upvotes: v.number(),
    downvotes: v.number(),
    upvoted_by: v.array(v.id("users")),
    downvoted_by: v.array(v.id("users")),
    created_at: v.number(),
  })
    .index("by_score", ["upvotes", "downvotes"])
    .index("by_created_at", ["created_at"])
    .index("by_user", ["suggested_by_user_id"]),

  cocktails: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    image_url: v.optional(v.string()),
    suggested_by_user_id: v.id("users"),
    suggested_by_name: v.string(),
    upvotes: v.number(),
    downvotes: v.number(),
    upvoted_by: v.array(v.id("users")),
    downvoted_by: v.array(v.id("users")),
    created_at: v.number(),
  })
    .index("by_score", ["upvotes", "downvotes"])
    .index("by_created_at", ["created_at"])
    .index("by_user", ["suggested_by_user_id"]),

  triviaScores: defineTable({
    user_id: v.id("users"),
    score: v.number(),
    total_questions: v.number(),
    percentage: v.number(),
    completed_at: v.number(),
  })
    .index("by_user", ["user_id"])
    .index("by_percentage", ["percentage"]),
})

