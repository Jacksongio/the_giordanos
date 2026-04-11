"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, ArrowDown, Plus, X } from "lucide-react"
import { ProtectedPage } from "@/components/protected-page"
import type { Id } from "@/convex/_generated/dataModel"
import { motion, AnimatePresence } from "framer-motion"

export default function CocktailsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    description: "",
  })

  // Use Convex hooks directly
  const cocktails = useQuery(api.cocktails.getCocktails)
  const addCocktailMutation = useMutation(api.cocktails.addCocktail)
  const upvoteCocktailMutation = useMutation(api.cocktails.upvoteCocktail)
  const downvoteCocktailMutation = useMutation(api.cocktails.downvoteCocktail)

  const handleUpvote = async (id: string) => {
    await upvoteCocktailMutation({ cocktailId: id as Id<"cocktails"> })
  }

  const handleDownvote = async (id: string) => {
    await downvoteCocktailMutation({ cocktailId: id as Id<"cocktails"> })
  }

  const handleAddCocktail = async () => {
    if (!newCocktail.name.trim()) return

    try {
      await addCocktailMutation({
        name: newCocktail.name,
        description: newCocktail.description || undefined,
      })
      setNewCocktail({ name: "", description: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding cocktail:", error)
    }
  }

  const isLoading = cocktails === undefined

  return (
    <ProtectedPage title="Cocktail Suggestions">
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Cocktail Rankings</h1>
          <p className="text-muted-foreground">Vote for your favorite cocktails for the wedding reception! The top 3 rated drinks will be added to the bar named after whoever suggested them!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Cocktail Button */}
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="mb-6 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Suggest a Cocktail
          </Button>
        )}

        {/* Add Cocktail Form */}
        {showAddForm && (
          <Card className="p-6 mb-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Suggest a New Cocktail</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cocktail Name *</label>
                <Input
                  placeholder="e.g., Piña Colada"
                  value={newCocktail.name}
                  onChange={(e) => setNewCocktail({ ...newCocktail, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  placeholder="Brief description of the cocktail..."
                  value={newCocktail.description}
                  onChange={(e) => setNewCocktail({ ...newCocktail, description: e.target.value })}
                  rows={2}
                />
              </div>

              <Button onClick={handleAddCocktail} disabled={!newCocktail.name.trim()} className="w-full">
                Add Cocktail
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && <div className="text-center py-12 text-muted-foreground">Loading cocktails...</div>}

        {/* Cocktails List */}
        {!isLoading && cocktails && cocktails.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No cocktails yet. Be the first to suggest one!</div>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cocktails?.map((cocktail, index) => {
              const score = cocktail.upvotes - cocktail.downvotes
              return (
                <motion.div
                  key={cocktail._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="p-4 bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-xl text-primary">#{index + 1}</span>
                      </div>

                      {/* Cocktail Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-semibold text-foreground">{cocktail.name}</h3>
                        {cocktail.description && <p className="text-muted-foreground mt-1">{cocktail.description}</p>}
                        <p className="text-sm text-muted-foreground mt-1">
                          Suggested by <span className="font-medium">{cocktail.suggested_by_name}</span>
                        </p>
                      </div>

                      {/* Voting Controls */}
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpvote(cocktail._id)}
                          className="w-10 h-10 p-0"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </Button>

                        <span className="font-bold text-xl text-foreground min-w-[2rem] text-center">{score}</span>
                        <span className="text-sm text-muted-foreground text-center">
                          {cocktail.upvotes}↑ {cocktail.downvotes}↓
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownvote(cocktail._id)}
                          className="w-10 h-10 p-0"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </ProtectedPage>
  )
}
