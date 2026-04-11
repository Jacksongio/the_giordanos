"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card } from "@/components/ui/card"
import { Users, UserCheck, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function GuestListPage() {
  const guests = useQuery(api.rsvps.getAttendingGuests)

  const totalGuests = guests?.reduce((sum, g) => sum + g.guestCount, 0) ?? 0
  const totalParties = guests?.length ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background">
      {/* Hero header */}
      <div className="relative pt-28 pb-16 px-4 text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary/30" />
            <Heart className="h-5 w-5 text-accent fill-accent/30" />
            <div className="h-px w-12 bg-primary/30" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">
            Our Guest List
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-md mx-auto font-light">
            The wonderful people celebrating with us
          </p>

          {guests && guests.length > 0 && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-serif text-foreground">{totalParties}</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                  {totalParties === 1 ? "Party" : "Parties"}
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-serif text-foreground">{totalGuests}</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                  {totalGuests === 1 ? "Guest" : "Guests"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Guest list */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {guests === undefined ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : guests.length === 0 ? (
          <Card className="p-12 text-center bg-card">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No RSVPs yet. Be the first to respond!
            </p>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            {guests.map((guest, index) => (
              <motion.div
                key={guest.name + index}
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
                    {/* Avatar circle */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-serif text-lg text-primary">
                        {(guest.guestNames[0] || guest.name).charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Name and details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {guest.guestNames[0] || guest.name}
                      </h3>
                      {guest.guestCount > 1 && guest.guestNames.length > 1 && (
                        <p className="text-muted-foreground truncate">
                          {guest.guestNames.slice(1).join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Guest count badge */}
                    {guest.guestCount > 1 ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full shrink-0">
                        <Users className="h-3.5 w-3.5" />
                        Party of {guest.guestCount}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full shrink-0">
                        <UserCheck className="h-3.5 w-3.5" />
                        Attending
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
