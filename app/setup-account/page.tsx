"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Check, Heart, Loader2, PartyPopper } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

function SetupAccountContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { signIn } = useAuthActions()
  const currentUser = useQuery(api.users.getCurrentUser)
  const linkRsvp = useMutation(api.rsvps.linkRsvpToCurrentUser)

  // Auto-link RSVP when user signs up
  useEffect(() => {
    if (currentUser) {
      linkRsvp().catch(() => {})
    }
  }, [currentUser, linkRsvp])

  const email = searchParams.get("email") || ""
  const name = searchParams.get("name") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Already logged in
  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/20 to-background px-4">
        <motion.div
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">You&apos;re All Set!</h1>
          <p className="text-muted-foreground">
            You&apos;re already signed in as{" "}
            <span className="font-medium text-foreground">{currentUser.email}</span>.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Explore the Wedding Site</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/20 to-background px-4">
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
            <PartyPopper className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="font-serif text-3xl text-foreground">Account Created!</h1>
          <p className="text-muted-foreground">
            Welcome, {name}! You can now suggest songs, vote on cocktails, and play trivia.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Explore the Wedding Site</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/20 to-background px-4">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h1 className="font-serif text-2xl text-foreground">Invalid Link</h1>
          <p className="text-muted-foreground">
            This setup link is invalid. Please use the link from your email.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">Visit Our Wedding Site</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("name", name)
      formData.append("flow", "signUp")

      await signIn("password", formData)
      setSuccess(true)
    } catch (err: any) {
      const errorMessage = err.message?.toLowerCase() || ""

      if (errorMessage.includes("already exists") || errorMessage.includes("already registered")) {
        setError("An account with this email already exists. Try signing in instead.")
      } else {
        setError(err.message || "Unable to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/20 to-background px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 bg-card">
          <div className="text-center mb-6">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="font-serif text-2xl text-foreground">Set Up Your Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Choose a password to access all the wedding site features
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup-name">Name</Label>
              <Input
                id="setup-name"
                type="text"
                value={name}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-email">Email</Label>
              <Input
                id="setup-email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-password">Password</Label>
              <Input
                id="setup-password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-confirm">Confirm Password</Label>
              <Input
                id="setup-confirm"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/" className="text-primary hover:underline">
                Sign in on the main site
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SetupAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetupAccountContent />
    </Suspense>
  )
}
