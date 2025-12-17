"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Countdown() {
  const weddingDate = new Date("2027-05-30T00:00:00")

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="countdown" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-foreground mb-4 text-balance">
            Countdown to Our Big Day
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">May 30th, 2027</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-6 bg-card border-border text-center">
            <div className="text-4xl sm:text-5xl font-serif font-light text-primary mb-2">{timeLeft.days}</div>
            <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Days</div>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <div className="text-4xl sm:text-5xl font-serif font-light text-primary mb-2">{timeLeft.hours}</div>
            <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Hours</div>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <div className="text-4xl sm:text-5xl font-serif font-light text-primary mb-2">{timeLeft.minutes}</div>
            <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Minutes</div>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <div className="text-4xl sm:text-5xl font-serif font-light text-primary mb-2">{timeLeft.seconds}</div>
            <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Seconds</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
