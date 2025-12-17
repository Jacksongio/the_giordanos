import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getSongs = query({
  handler: async (ctx) => {
    const songs = await ctx.db
      .query("songs")
      .withIndex("by_votes")
      .order("desc")
      .collect()

    // Sort by created_at descending as secondary sort
    return songs.sort((a, b) => {
      if (a.votes !== b.votes) {
        return b.votes - a.votes
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
    suggested_by: v.string(),
  },
  handler: async (ctx, args) => {
    const songId = await ctx.db.insert("songs", {
      song_name: args.song_name,
      artist_name: args.artist_name,
      spotify_id: args.spotify_id,
      album_image: args.album_image,
      suggested_by: args.suggested_by,
      votes: 0,
      created_at: Date.now(),
    })

    return await ctx.db.get(songId)
  },
})

export const upvoteSong = mutation({
  args: { songId: v.id("songs") },
  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.songId)
    if (!song) {
      throw new Error("Song not found")
    }

    await ctx.db.patch(args.songId, {
      votes: song.votes + 1,
    })
  },
})

