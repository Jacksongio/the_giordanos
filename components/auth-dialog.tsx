"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AuthStep = "signIn" | "signUp" | "forgotPassword" | { resetEmail: string }

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn } = useAuthActions()
  const [step, setStep] = useState<AuthStep>("signIn")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkRsvpEmail, setCheckRsvpEmail] = useState("")

  const currentUser = useQuery(api.users.getCurrentUser)
  const linkRsvp = useMutation(api.rsvps.linkRsvpToCurrentUser)
  const hasRsvp = useQuery(
    api.rsvps.checkEmailHasRsvp,
    checkRsvpEmail ? { email: checkRsvpEmail } : "skip"
  )

  // Auto-link RSVP when user signs in/up
  useEffect(() => {
    if (currentUser) {
      linkRsvp().catch(() => {})
    }
  }, [currentUser, linkRsvp])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("flow", "signIn")

      await signIn("password", formData)
      
      onOpenChange(false)
      resetForm()
    } catch (err: any) {
      console.error("Sign in error:", err)
      console.log("Error message:", JSON.stringify(err.message))

      // Handle specific error cases - check message and full error string
      const errorMessage = (err.message?.toLowerCase() || "") + " " + (String(err).toLowerCase())

      if (errorMessage.includes("invalid credentials") || errorMessage.includes("invalid password")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else {
        // For any other error (InvalidAccountId, user not found, etc.)
        // check if they have an unlinked RSVP
        setCheckRsvpEmail(email.toLowerCase().trim())
        setError("No account found with this email. Please sign up to create one.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("name", name)
      formData.append("flow", "signUp")

      await signIn("password", formData)
      
      onOpenChange(false)
      resetForm()
    } catch (err: any) {
      console.error("Sign up error:", err)
      
      // Handle specific error cases
      const errorMessage = err.message?.toLowerCase() || ""
      
      if (errorMessage.includes("already exists") || errorMessage.includes("already registered")) {
        setError("An account with this email already exists. Please sign in instead.")
      } else if (errorMessage.includes("invalid email")) {
        setError("Please enter a valid email address.")
      } else if (errorMessage.includes("password") && errorMessage.includes("weak")) {
        setError("Password is too weak. Please use at least 8 characters.")
      } else if (errorMessage.includes("password") && errorMessage.includes("short")) {
        setError("Password must be at least 8 characters long.")
      } else if (errorMessage.includes("name")) {
        setError("Please enter your name.")
      } else {
        setError(err.message || "Unable to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Client-side validation
    if (!email || email.trim() === "") {
      setError("Please enter your email address.")
      setIsLoading(false)
      return
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("email", email.trim())
      formData.append("flow", "reset")

      await signIn("password", formData)
      
      // Move to code entry step
      setStep({ resetEmail: email })
      setError(null)
    } catch (err: any) {
      console.error("Reset request error:", err)
      
      // For ANY error, show a user-friendly message
      // We don't want to expose technical details to users
      setError("Sorry, we had trouble sending the reset email. Please try again in a few minutes or contact support if the problem persists.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Client-side validation
    if (!code || code.trim() === "") {
      setError("Please enter the reset code.")
      setIsLoading(false)
      return
    }

    if (!newPassword || newPassword.trim() === "") {
      setError("Please enter a new password.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      setIsLoading(false)
      return
    }

    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number.")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("email", typeof step === "object" ? step.resetEmail : email)
      formData.append("code", code.trim())
      formData.append("newPassword", newPassword)
      formData.append("flow", "reset-verification")

      await signIn("password", formData)
      
      onOpenChange(false)
      resetForm()
      setStep("signIn")
    } catch (err: any) {
      console.error("Reset password error:", err)
      
      // For ANY error, show a user-friendly message
      // The most common issues are invalid or expired codes
      setError("Sorry, we had trouble resetting your password. The code may be invalid or expired. Please request a new reset code and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setCode("")
    setNewPassword("")
    setError(null)
    setCheckRsvpEmail("")
  }

  const renderContent = () => {
    // Password Reset - Step 2: Enter Code
    if (typeof step === "object" && "resetEmail" in step) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Enter Reset Code</DialogTitle>
            <DialogDescription>
              Check your email for the reset code we just sent you
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                A reset code has been sent to your email. Check your spam folder if you don&apos;t see it. The code expires in 1 hour.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Reset Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code from email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep("forgotPassword")
                  setCode("")
                  setNewPassword("")
                  setError(null)
                }}
              >
                Request New Code
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setStep("signIn")
                  setError(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </>
      )
    }

    // Password Reset - Step 1: Request Code
    if (step === "forgotPassword") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email to receive a reset code
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("signIn")
                setError(null)
                resetForm()
              }}
            >
              Back to Sign In
            </Button>
          </form>
        </>
      )
    }

    // Sign Up
    if (step === "signUp") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Create an account to save your preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating..." : "Sign Up"}</Button>
              <div className="text-center text-sm">
                <button type="button" onClick={() => { setStep("signIn"); setError(null); resetForm(); }} className="text-primary hover:underline">
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          </div>
        </>
      )
    }

    // Sign In (default)
    return (
      <>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Sign in to your account to continue</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div className="text-right">
              <button type="button" onClick={() => { setStep("forgotPassword"); setError(null); }} className="text-xs text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            {checkRsvpEmail && hasRsvp === true && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2 text-center">
                <p className="text-sm text-foreground font-medium">Already RSVP&apos;d?</p>
                <p className="text-xs text-muted-foreground">
                  We found your RSVP! Sign up with this email to link it to your account.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => { setStep("signUp"); setError(null); setCheckRsvpEmail(""); }}
                >
                  Create Account
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
            <div className="text-center text-sm">
              <button type="button" onClick={() => { setStep("signUp"); setError(null); setCheckRsvpEmail(""); }} className="text-primary hover:underline">
                Don&apos;t have an account? Sign up
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen)
      if (!newOpen) {
        setStep("signIn")
        resetForm()
      }
    }}>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
