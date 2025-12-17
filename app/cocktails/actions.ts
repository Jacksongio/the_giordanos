"use server"

import { getConvexClient, api } from "@/lib/convex"
import { revalidatePath } from "next/cache"
import { Id } from "../convex/_generated/dataModel"

export interface Cocktail {
  id: string
  name: string
  description: string | null
  ingredients: string | null
  image_url: string | null
  suggested_by_user_id: string
  suggested_by_name: string
  upvotes: number
  downvotes: number
  score: number
  created_at: string
}

export async function getCocktails(): Promise<Cocktail[]> {
  try {
    const convex = getConvexClient()
    const cocktails = await convex.query(api.cocktails.getCocktails, {})
    
    // Convert Convex format to expected format
    return cocktails.map((cocktail) => ({
      id: cocktail._id,
      name: cocktail.name,
      description: cocktail.description ?? null,
      ingredients: cocktail.ingredients ?? null,
      image_url: cocktail.image_url ?? null,
      suggested_by_user_id: cocktail.suggested_by_user_id,
      suggested_by_name: cocktail.suggested_by_name,
      upvotes: cocktail.upvotes,
      downvotes: cocktail.downvotes,
      score: cocktail.upvotes - cocktail.downvotes,
      created_at: new Date(cocktail.created_at).toISOString(),
    })) as Cocktail[]
  } catch (error) {
    console.error("Error fetching cocktails:", error)
    return []
  }
}

export async function upvoteCocktail(id: string): Promise<void> {
  try {
    const convex = getConvexClient()
    await convex.mutation(api.cocktails.upvoteCocktail, {
      cocktailId: id as Id<"cocktails">,
    })
    revalidatePath("/cocktails")
  } catch (error) {
    console.error("Error upvoting cocktail:", error)
    throw new Error("Failed to upvote cocktail")
  }
}

export async function downvoteCocktail(id: string): Promise<void> {
  try {
    const convex = getConvexClient()
    await convex.mutation(api.cocktails.downvoteCocktail, {
      cocktailId: id as Id<"cocktails">,
    })
    revalidatePath("/cocktails")
  } catch (error) {
    console.error("Error downvoting cocktail:", error)
    throw new Error("Failed to downvote cocktail")
  }
}

export async function addCocktail(name: string, description: string, ingredients: string): Promise<void> {
  try {
    const convex = getConvexClient()
    await convex.mutation(api.cocktails.addCocktail, {
      name,
      description: description || undefined,
      ingredients: ingredients || undefined,
    })
    revalidatePath("/cocktails")
  } catch (error) {
    console.error("Error adding cocktail:", error)
    throw new Error("Failed to add cocktail")
  }
}
