"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Plus, X } from "lucide-react"
import { getCocktails, upvoteCocktail, downvoteCocktail, addCocktail, type Cocktail } from "./actions"

export default function CocktailsPage() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    description: "",
    ingredients: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCocktails()
  }, [])

  const loadCocktails = async () => {
    setLoading(true)
    const data = await getCocktails()
    setCocktails(data)
    setLoading(false)
  }

  const handleUpvote = async (id: string) => {
    await upvoteCocktail(id)
    await loadCocktails()
  }

  const handleDownvote = async (id: string) => {
    await downvoteCocktail(id)
    await loadCocktails()
  }

  const handleAddCocktail = async () => {
    if (!newCocktail.name.trim()) return

    await addCocktail(newCocktail.name, newCocktail.description, newCocktail.ingredients)

    setNewCocktail({ name: "", description: "", ingredients: "" })
    setShowAddForm(false)
    await loadCocktails()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Cocktail Rankings</h1>
          <p className="text-muted-foreground">Vote for your favorite cocktails for the wedding reception!</p>
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

              <div>
                <label className="block text-sm font-medium mb-2">Ingredients</label>
                <Textarea
                  placeholder="List the main ingredients..."
                  value={newCocktail.ingredients}
                  onChange={(e) => setNewCocktail({ ...newCocktail, ingredients: e.target.value })}
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
        {loading && <div className="text-center py-12 text-muted-foreground">Loading cocktails...</div>}

        {/* Cocktails List */}
        {!loading && cocktails.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No cocktails yet. Be the first to suggest one!</div>
        )}

        <div className="space-y-4">
          {cocktails.map((cocktail, index) => (
            <Card key={cocktail.id} className="p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-lg text-primary">#{index + 1}</span>
                </div>

                {/* Cocktail Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{cocktail.name}</h3>
                  {cocktail.description && <p className="text-muted-foreground text-sm mb-2">{cocktail.description}</p>}
                  {cocktail.ingredients && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Ingredients:</span> {cocktail.ingredients}
                    </p>
                  )}
                </div>

                {/* Voting Controls */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpvote(cocktail.id)}
                    className="w-10 h-10 p-0"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>

                  <span className="font-bold text-lg text-foreground min-w-[2rem] text-center">{cocktail.votes}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownvote(cocktail.id)}
                    className="w-10 h-10 p-0"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
