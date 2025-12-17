import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  songs: defineTable({
    song_name: v.string(),
    artist_name: v.string(),
    spotify_id: v.optional(v.string()),
    album_image: v.optional(v.string()),
    suggested_by: v.string(),
    votes: v.number(),
    created_at: v.number(),
  })
    .index("by_votes", ["votes"])
    .index("by_created_at", ["created_at"]),

  cocktails: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ingredients: v.optional(v.string()),
    image_url: v.optional(v.string()),
    votes: v.number(),
    created_at: v.number(),
  })
    .index("by_votes", ["votes"])
    .index("by_created_at", ["created_at"]),
})

