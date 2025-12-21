"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Camera, Music, Utensils, Lock } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function WeddingDetails() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const isAuthenticated = currentUser !== null && currentUser !== undefined

  return (
    <section id="details" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-foreground mb-4 text-balance">
            Wedding Details
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            All the important information for our special day
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-medium text-foreground flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                Ceremony
              </h3>
              {isAuthenticated ? (
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Please arrive by 5:00 PM</p>
                      <p>Sunday May 30, 2027</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Raspberry Manor</p>
                      <p>16500 Agape Ln</p>
                      <p>Leesburg, VA 20176</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Sign in to view ceremony details</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-medium text-foreground flex items-center gap-3">
                <Utensils className="h-6 w-6 text-primary" />
                Reception
              </h3>
              {isAuthenticated ? (
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">6:00 PM - 11:00 PM</p>
                      <p>Cocktails, Dinner & Dancing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">The Grand Ballroom</p>
                      <p>Same venue as ceremony</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Sign in to view reception details</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border text-center">
            <Camera className="h-8 w-8 text-primary mx-auto mb-4" />
            <h4 className="font-serif text-lg font-medium text-foreground mb-2">Photography</h4>
            <p className="text-sm text-muted-foreground">{"Please share your photos using #TheGiordanos2027"}</p>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <Music className="h-8 w-8 text-primary mx-auto mb-4" />
            <h4 className="font-serif text-lg font-medium text-foreground mb-2">Music</h4>
            <p className="text-sm text-muted-foreground">{"Live DJ for reception dancing"}</p>
          </Card>

          <Card className="p-6 bg-card border-border text-center sm:col-span-2 lg:col-span-1">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
            <h4 className="font-serif text-lg font-medium text-foreground mb-2">Parking</h4>
            <p className="text-sm text-muted-foreground">{"Parking available at Venue"}</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
