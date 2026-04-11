"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InviteCardProps {
  guestName: string
  onContinueToRsvp: () => void
}

export function InviteCard({ guestName, onContinueToRsvp }: InviteCardProps) {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto px-4"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-secondary/50">
        {/* Top ornamental border */}
        <div className="h-2 bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />

        <div className="p-8 sm:p-12 text-center space-y-8">
          {/* Header ornament */}
          <div className="text-primary/30 text-3xl tracking-[1em] select-none">
            &#10045; &#10045; &#10045;
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
              Dear
            </p>
            <p className="font-serif text-2xl sm:text-3xl text-foreground">
              {guestName}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-primary/30" />
            <div className="w-2 h-2 rotate-45 bg-accent/60" />
            <div className="h-px w-16 bg-primary/30" />
          </div>

          {/* Invitation text */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
              Together with their families
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-foreground">
              Jackson & Audrey
            </h1>
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
              Request the pleasure of your company at their wedding
            </p>
          </div>

          {/* Date and venue */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-serif text-lg">Sunday, May 30, 2027</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm">Raspberry Manor &middot; Leesburg, Virginia</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-primary/30" />
            <div className="w-2 h-2 rotate-45 bg-accent/60" />
            <div className="h-px w-16 bg-primary/30" />
          </div>

          {/* RSVP Button */}
          <div className="pt-2">
            <Button
              onClick={onContinueToRsvp}
              size="lg"
              className="px-10 py-6 text-base tracking-wider rounded-full"
            >
              RSVP Now
            </Button>
            <p className="text-xs text-muted-foreground/60 mt-4">
              Kindly respond at your earliest convenience
            </p>
          </div>
        </div>

        {/* Bottom ornamental border */}
        <div className="h-2 bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40" />
      </div>
    </motion.div>
  )
}
