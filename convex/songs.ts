import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db.query("songs").collect()

    // Sort by net score (upvotes - downvotes) descending, then by created_at
    return songs.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }
      return b.created_at - a.created_at
    })
  },
})

export const addSong = mutation({
  args: {
    song_name: v.string(),
    artist_name: v.string(),
    spotify_id: v.optional(v.string()),
    album_image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be signed in to suggest songs")
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

    const songId = await ctx.db.insert("songs", {
      song_name: args.song_name,
      artist_name: args.artist_name,
      spotify_id: args.spotify_id,
      album_image: args.album_image,
      suggested_by_user_id: user._id,
      suggested_by_name: userName,
      upvotes: 0,
      downvotes: 0,
      upvoted_by: [],
      downvoted_by: [],
      created_at: Date.now(),
    })

    return await ctx.db.get(songId)
  },
})

export const upvoteSong = mutation({
  args: { songId: v.id("songs") },
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

    const song = await ctx.db.get(args.songId)
    if (!song) {
      throw new Error("Song not found")
    }

    // Remove from downvoted if previously downvoted
    const downvoted_by = song.downvoted_by.filter((id) => id !== user._id)
    const removedDownvote = downvoted_by.length < song.downvoted_by.length

    // Toggle upvote
    let upvoted_by = [...song.upvoted_by]
    let upvotes = song.upvotes
    
    if (upvoted_by.includes(user._id)) {
      // Remove upvote
      upvoted_by = upvoted_by.filter((id) => id !== user._id)
      upvotes = Math.max(0, upvotes - 1)
    } else {
      // Add upvote
      upvoted_by.push(user._id)
      upvotes = upvotes + 1
    }

    await ctx.db.patch(args.songId, {
      upvotes,
      downvotes: removedDownvote ? Math.max(0, song.downvotes - 1) : song.downvotes,
      upvoted_by,
      downvoted_by,
    })
  },
})

export const downvoteSong = mutation({
  args: { songId: v.id("songs") },
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

    const song = await ctx.db.get(args.songId)
    if (!song) {
      throw new Error("Song not found")
    }

    // Remove from upvoted if previously upvoted
    const upvoted_by = song.upvoted_by.filter((id) => id !== user._id)
    const removedUpvote = upvoted_by.length < song.upvoted_by.length

    // Toggle downvote
    let downvoted_by = [...song.downvoted_by]
    let downvotes = song.downvotes
    
    if (downvoted_by.includes(user._id)) {
      // Remove downvote
      downvoted_by = downvoted_by.filter((id) => id !== user._id)
      downvotes = Math.max(0, downvotes - 1)
    } else {
      // Add downvote
      downvoted_by.push(user._id)
      downvotes = downvotes + 1
    }

    await ctx.db.patch(args.songId, {
      upvotes: removedUpvote ? Math.max(0, song.upvotes - 1) : song.upvotes,
      downvotes,
      upvoted_by,
      downvoted_by,
    })
  },
})

