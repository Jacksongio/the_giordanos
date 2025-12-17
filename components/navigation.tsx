"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            J & A
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("story")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection("details")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Details
            </button>
            <Link href="/songs" className="text-foreground hover:text-primary transition-colors">
              Song Suggestions
            </Link>
            <Link href="/flappy-audrey" className="text-foreground hover:text-primary transition-colors">
              FlappyAudrey
            </Link>
            <Link href="/cocktails" className="text-foreground hover:text-primary transition-colors">
              Cocktail Suggestions
            </Link>
            <Link href="/trivia" className="text-foreground hover:text-primary transition-colors">
              Trivia
            </Link>
            <AuthButton />
          </div>

          {/* Mobile menu button and auth */}
          <div className="flex items-center gap-2 md:hidden">
            <AuthButton />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection("home")}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("story")}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection("details")}
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
              >
                Details
              </button>
              <Link
                href="/songs"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                Song Suggestions
              </Link>
              <Link
                href="/flappy-audrey"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                FlappyAudrey
              </Link>
              <Link
                href="/cocktails"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                Cocktails
              </Link>
              <Link
                href="/trivia"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors w-full text-left"
                onClick={() => setIsOpen(false)}
              >
                Trivia
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
