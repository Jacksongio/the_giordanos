"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Song {
  id: string
  song_name: string
  artist_name: string
  spotify_id: string | null
  album_image: string | null
  suggested_by: string
  votes: number
  created_at: string
}

export async function getSongs() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("votes", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching songs:", error)
    return []
  }

  return data as Song[]
}

export async function addSong(songData: {
  song_name: string
  artist_name: string
  spotify_id?: string
  album_image?: string
  suggested_by: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("songs").insert([songData]).select().single()

  if (error) {
    console.error("Error adding song:", error)
    throw new Error("Failed to add song")
  }

  revalidatePath("/songs")
  return data as Song
}

export async function upvoteSong(songId: string) {
  const supabase = await getSupabaseServerClient()

  // Get current votes
  const { data: song, error: fetchError } = await supabase.from("songs").select("votes").eq("id", songId).single()

  if (fetchError) {
    console.error("Error fetching song:", fetchError)
    throw new Error("Failed to fetch song")
  }

  // Increment votes
  const { error: updateError } = await supabase
    .from("songs")
    .update({ votes: song.votes + 1 })
    .eq("id", songId)

  if (updateError) {
    console.error("Error updating votes:", updateError)
    throw new Error("Failed to update votes")
  }

  revalidatePath("/songs")
}
