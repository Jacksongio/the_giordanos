"use client"

import { Calendar, MapPin } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/soft-romantic-white-and-blush-pink-flowers-wedding.jpg"
          alt="Wedding flowers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-foreground text-balance drop-shadow-lg">
              Jackson & Audrey
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light drop-shadow-md">
              {"Together with our families, we invite you to celebrate our love"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg text-muted-foreground drop-shadow-md">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>May 2027</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Leesburg, Virginia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
