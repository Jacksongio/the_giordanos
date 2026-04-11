"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { EnvelopeAnimation } from "@/components/envelope-animation"
import { InviteCard } from "@/components/invite-card"
import { RsvpForm } from "@/components/rsvp-form"
import { motion } from "framer-motion"
import { Check, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Stage = "envelope" | "card" | "form" | "confirmed"

function InviteContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [stage, setStage] = useState<Stage>("envelope")

  const inviteData = useQuery(
    api.invites.getInviteByToken,
    token ? { token } : "skip"
  )

  // Loading state
  if (inviteData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-serif">Loading your invitation...</p>
        </div>
      </div>
    )
  }

  // Invalid token
  if (!token || inviteData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background px-4">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h1 className="font-serif text-2xl text-foreground">
            Invalid Invitation
          </h1>
          <p className="text-muted-foreground">
            This invite link is invalid or has expired. Please check the link in
            your email and try again.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Visit Our Wedding Site
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // If there's an existing RSVP, skip envelope and show form/confirmed
  const hasExistingRsvp = !!inviteData.existingRsvp

  // Check deadline
  const deadlineStr = typeof window !== "undefined" ? "" : "" // deadline checked server-side

  // Envelope stage
  if (stage === "envelope" && !hasExistingRsvp) {
    return (
      <EnvelopeAnimation
        guestName={inviteData.name}
        onOpen={() => setStage("card")}
      />
    )
  }

  // Card stage
  if (stage === "card" && !hasExistingRsvp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background py-12">
        <InviteCard
          guestName={inviteData.name}
          onContinueToRsvp={() => setStage("form")}
        />
      </div>
    )
  }

  // Confirmed stage
  if (stage === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background px-4">
        <motion.div
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Check className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="font-serif text-3xl text-foreground">
            Thank You!
          </h1>
          <p className="text-muted-foreground">
            Your RSVP has been received. We&apos;ve sent a confirmation to{" "}
            <span className="text-foreground font-medium">{inviteData.email}</span>.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Visit Our Wedding Site
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  // Form stage (or returning visitor with existing RSVP)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background py-12">
      <RsvpForm
        invite={inviteData}
        existingRsvp={inviteData.existingRsvp}
        token={token}
        onComplete={() => setStage("confirmed")}
      />
    </div>
  )
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/30 to-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  )
}
