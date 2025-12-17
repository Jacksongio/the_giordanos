"use server"

import { getConvexClient, api } from "@/lib/convex"
import { revalidatePath } from "next/cache"
import { Id } from "../convex/_generated/dataModel"

export interface Song {
  id: string
  song_name: string
  artist_name: string
  spotify_id: string | null
  album_image: string | null
  suggested_by_user_id: string
  suggested_by_name: string
  upvotes: number
  downvotes: number
  upvoted_by: string[]
  downvoted_by: string[]
  created_at: string
}

export async function getSongs() {
  try {
    const convex = getConvexClient()
    const songs = await convex.query(api.songs.getSongs, {})
    
    // Convert Convex format to expected format
    return songs.map((song) => ({
      id: song._id,
      song_name: song.song_name,
      artist_name: song.artist_name,
      spotify_id: song.spotify_id ?? null,
      album_image: song.album_image ?? null,
      suggested_by_user_id: song.suggested_by_user_id,
      suggested_by_name: song.suggested_by_name,
      upvotes: song.upvotes,
      downvotes: song.downvotes,
      upvoted_by: song.upvoted_by,
      downvoted_by: song.downvoted_by,
      created_at: new Date(song.created_at).toISOString(),
    })) as Song[]
  } catch (error) {
    console.error("Error fetching songs:", error)
    return []
  }
}

export async function addSong(songData: {
  song_name: string
  artist_name: string
  spotify_id?: string
  album_image?: string
}) {
  try {
    const convex = getConvexClient()
    const song = await convex.mutation(api.songs.addSong, {
      song_name: songData.song_name,
      artist_name: songData.artist_name,
      spotify_id: songData.spotify_id,
      album_image: songData.album_image,
    })

    if (!song) {
      throw new Error("Failed to add song")
    }

    revalidatePath("/songs")
    
    return {
      id: song._id,
      song_name: song.song_name,
      artist_name: song.artist_name,
      spotify_id: song.spotify_id ?? null,
      album_image: song.album_image ?? null,
      suggested_by_user_id: song.suggested_by_user_id,
      suggested_by_name: song.suggested_by_name,
      upvotes: song.upvotes,
      downvotes: song.downvotes,
      upvoted_by: song.upvoted_by,
      downvoted_by: song.downvoted_by,
      created_at: new Date(song.created_at).toISOString(),
    } as Song
  } catch (error) {
    console.error("Error adding song:", error)
    throw new Error("Failed to add song")
  }
}

export async function upvoteSong(songId: string) {
  try {
    const convex = getConvexClient()
    await convex.mutation(api.songs.upvoteSong, {
      songId: songId as Id<"songs">,
    })
    revalidatePath("/songs")
  } catch (error) {
    console.error("Error updating votes:", error)
    throw new Error("Failed to update votes")
  }
}

export async function downvoteSong(songId: string) {
  try {
    const convex = getConvexClient()
    await convex.mutation(api.songs.downvoteSong, {
      songId: songId as Id<"songs">,
    })
    revalidatePath("/songs")
  } catch (error) {
    console.error("Error updating votes:", error)
    throw new Error("Failed to update votes")
  }
}
