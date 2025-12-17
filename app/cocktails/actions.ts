"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Cocktail {
  id: string
  name: string
  description: string | null
  ingredients: string | null
  image_url: string | null
  votes: number
  created_at: string
}

export async function getCocktails(): Promise<Cocktail[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("cocktails").select("*").order("votes", { ascending: false })

  if (error) {
    console.error("Error fetching cocktails:", error)
    return []
  }

  return data || []
}

export async function upvoteCocktail(id: string): Promise<void> {
  const supabase = await createServerClient()

  // Get current votes
  const { data: cocktail } = await supabase.from("cocktails").select("votes").eq("id", id).single()

  if (cocktail) {
    // Increment votes
    await supabase
      .from("cocktails")
      .update({ votes: cocktail.votes + 1 })
      .eq("id", id)
  }

  revalidatePath("/cocktails")
}

export async function downvoteCocktail(id: string): Promise<void> {
  const supabase = await createServerClient()

  // Get current votes
  const { data: cocktail } = await supabase.from("cocktails").select("votes").eq("id", id).single()

  if (cocktail) {
    // Decrement votes (but don't go below 0)
    await supabase
      .from("cocktails")
      .update({ votes: Math.max(0, cocktail.votes - 1) })
      .eq("id", id)
  }

  revalidatePath("/cocktails")
}

export async function addCocktail(name: string, description: string, ingredients: string): Promise<void> {
  const supabase = await createServerClient()

  await supabase.from("cocktails").insert({
    name,
    description,
    ingredients,
    votes: 0,
  })

  revalidatePath("/cocktails")
}
