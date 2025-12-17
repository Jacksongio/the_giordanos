import { Heart, Instagram, Facebook, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <Heart className="h-8 w-8 mx-auto text-accent" />
          <h3 className="font-serif text-2xl font-light">Jackson & Audrey</h3>
          <p className="text-background/80 max-w-md mx-auto text-pretty">
            {"Thank you for being part of our story. We can't wait to celebrate with you!"}
          </p>
        </div>

        <div className="flex justify-center space-x-6">
          
          <a
            href="mailto:jacksonaudrey@giordano.us"
            className="text-background/80 hover:text-accent transition-colors"
            aria-label="Email"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>

        <div className="pt-8 border-t border-background/20">
          <p className="text-sm text-background/60">May 30, 2027 • Leesburg, Virginia</p>
        </div>
      </div>
    </footer>
  )
}
