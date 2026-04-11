"use client"

import { Gift, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Registry() {
  return (
    <section id="registry" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-foreground">
            Registry
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
            Your presence is the greatest gift, but if you&apos;d like to celebrate with a present, we&apos;re registered at Amazon.
          </p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="px-10 py-6 text-base tracking-wider rounded-full" asChild>
            <a
              href="https://www.amazon.com/wedding/share/thegiordanos"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Our Amazon Registry
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
