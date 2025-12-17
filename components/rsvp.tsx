"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart } from "lucide-react"

export function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendance: "",
    guests: "1",
    dietary: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("RSVP submitted:", formData)
    alert("Thank you for your RSVP! We can't wait to celebrate with you.")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-foreground mb-4 text-balance">RSVP</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"We can't wait to celebrate with you! Please let us know if you'll be joining us."}
          </p>
        </div>

        <Card className="p-8 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Will you be attending? *</Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) => handleChange("attendance", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">{"Yes, I'll be there!"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">{"Sorry, can't make it"}</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.attendance === "yes" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests (including yourself)</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="4"
                    value={formData.guests}
                    onChange={(e) => handleChange("guests", e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Restrictions or Allergies</Label>
                  <Input
                    id="dietary"
                    value={formData.dietary}
                    onChange={(e) => handleChange("dietary", e.target.value)}
                    placeholder="Please let us know of any dietary needs"
                    className="bg-background"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Special Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Share your excitement or well wishes!"
                className="bg-background min-h-[100px]"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Send RSVP
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}
