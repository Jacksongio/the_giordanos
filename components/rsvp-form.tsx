"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Loader2, X, UserPlus, Minus, UtensilsCrossed } from "lucide-react"

const MEAL_CHOICES = ["Chicken", "Steak", "Vegetarian"] as const
type MealChoice = (typeof MEAL_CHOICES)[number]
import type { Doc } from "@/convex/_generated/dataModel"

type InviteDoc = Doc<"invites">
type RsvpDoc = Doc<"rsvps">

interface RsvpFormProps {
  invite: InviteDoc
  existingRsvp: RsvpDoc | null | undefined
  token: string
  onComplete: () => void
}

export function RsvpForm({ invite, existingRsvp, token, onComplete }: RsvpFormProps) {
  const isUpdate = !!existingRsvp

  const hasEmail = !!invite.email
  const [email, setEmail] = useState(existingRsvp?.email || invite.email || "")
  const [name, setName] = useState(existingRsvp?.name || invite.name)
  const [attending, setAttending] = useState<boolean | null>(
    existingRsvp?.attending ?? null
  )
  const [guestCount, setGuestCount] = useState(existingRsvp?.guestCount || 1)
  const [guestNames, setGuestNames] = useState<string[]>(
    existingRsvp?.guestNames || [invite.name]
  )
  const [mealChoices, setMealChoices] = useState<string[]>(
    existingRsvp?.mealChoices || [""]
  )
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    existingRsvp?.dietaryRestrictions || ""
  )
  const [message, setMessage] = useState(existingRsvp?.message || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const submitRsvp = useMutation(api.rsvps.submitRsvp)
  const updateRsvp = useMutation(api.rsvps.updateRsvp)

  const handleGuestCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > invite.maxGuests) return
    setGuestCount(newCount)

    const newNames = [...guestNames]
    const newMeals = [...mealChoices]
    if (newCount > guestNames.length) {
      while (newNames.length < newCount) {
        newNames.push("")
        newMeals.push("")
      }
    } else {
      newNames.splice(newCount)
      newMeals.splice(newCount)
    }
    setGuestNames(newNames)
    setMealChoices(newMeals)
  }

  const updateGuestName = (index: number, value: string) => {
    const newNames = [...guestNames]
    newNames[index] = value
    setGuestNames(newNames)
  }

  const updateMealChoice = (index: number, value: string) => {
    const newMeals = [...mealChoices]
    newMeals[index] = value
    setMealChoices(newMeals)
  }

  const handleSubmit = async () => {
    setError("")

    if (attending === null) {
      setError("Please select whether you will attend")
      return
    }

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!hasEmail && !email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (attending && guestNames.some((n) => !n.trim())) {
      setError("Please enter a name for each guest")
      return
    }

    if (attending && mealChoices.some((m) => !m)) {
      setError("Please select a meal choice for each guest")
      return
    }

    setIsSubmitting(true)
    try {
      const args = {
        token,
        name: name.trim(),
        email: !hasEmail ? email.trim() : undefined,
        attending,
        guestCount: attending ? guestCount : 0,
        guestNames: attending ? guestNames.map((n) => n.trim()) : [],
        mealChoices: attending ? mealChoices : [],
        dietaryRestrictions: dietaryRestrictions.trim() || undefined,
        message: message.trim() || undefined,
      }

      if (isUpdate) {
        await updateRsvp(args)
      } else {
        await submitRsvp(args)
      }

      onComplete()
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="w-full max-w-lg mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-secondary/50">
        <div className="h-2 bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />

        <div className="p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl text-foreground">
              {isUpdate ? "Update Your RSVP" : "RSVP"}
            </h2>
            {hasEmail && (
              <p className="text-sm text-muted-foreground">
                {invite.email}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="rsvp-name">Your Name</Label>
            <Input
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Email (only if invite was SMS-only) */}
          {!hasEmail && (
            <div className="space-y-2">
              <Label htmlFor="rsvp-email">Email Address</Label>
              <Input
                id="rsvp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Required to send your confirmation and set up your account
              </p>
            </div>
          )}

          {/* Attending toggle */}
          <div className="space-y-2">
            <Label>Will you be attending?</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  attending === true
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/40 text-muted-foreground"
                }`}
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">Accept</span>
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  attending === false
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-border hover:border-destructive/40 text-muted-foreground"
                }`}
              >
                <X className="h-5 w-5" />
                <span className="font-medium">Decline</span>
              </button>
            </div>
          </div>

          {/* Guest details (only if attending) */}
          {attending && (
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {/* Guest count */}
              <div className="space-y-2">
                <Label>Number of Guests (including yourself)</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestCountChange(guestCount - 1)}
                    disabled={guestCount <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-medium w-8 text-center">
                    {guestCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestCountChange(guestCount + 1)}
                    disabled={guestCount >= invite.maxGuests}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    (max {invite.maxGuests})
                  </span>
                </div>
              </div>

              {/* Guest names and meal choices */}
              <div className="space-y-4">
                <Label>Guests & Meal Choices</Label>
                {guestNames.map((gn, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      Guest {i + 1}
                    </div>
                    <Input
                      value={gn}
                      onChange={(e) => updateGuestName(i, e.target.value)}
                      placeholder={i === 0 ? "Your name" : `Guest ${i + 1} name`}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {MEAL_CHOICES.map((meal) => (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => updateMealChoice(i, meal)}
                          className={`px-3 py-2 rounded-md border text-sm transition-all ${
                            mealChoices[i] === meal
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dietary restrictions */}
              <div className="space-y-2">
                <Label htmlFor="dietary">Dietary Restrictions</Label>
                <Textarea
                  id="dietary"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="Any allergies or dietary needs..."
                  rows={2}
                />
              </div>
            </motion.div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message for the Couple (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your well wishes..."
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || attending === null}
            className="w-full py-6 text-base tracking-wider rounded-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isUpdate ? (
              "Update RSVP"
            ) : (
              "Submit RSVP"
            )}
          </Button>
        </div>

        <div className="h-2 bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />
      </div>
    </motion.div>
  )
}
