"use client"

import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
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

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signIn("google")
    } catch (err: any) {
      console.error("Google sign in error:", err)
      
      const errorMessage = err.message?.toLowerCase() || ""
      
      if (errorMessage.includes("popup") || errorMessage.includes("window")) {
        setError("Popup was blocked. Please allow popups and try again.")
      } else if (errorMessage.includes("cancelled") || errorMessage.includes("closed")) {
        setError("Sign in was cancelled. Please try again.")
      } else {
        setError(err.message || "Unable to sign in with Google. Please try again.")
      }
      setIsLoading(false)
    }
  }

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
      
      // Handle specific error cases
      const errorMessage = err.message?.toLowerCase() || ""
      
      if (errorMessage.includes("invalid credentials") || errorMessage.includes("invalid password")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else if (errorMessage.includes("user not found") || errorMessage.includes("no account")) {
        setError("No account found with this email. Please sign up first.")
      } else if (errorMessage.includes("email")) {
        setError("Please enter a valid email address.")
      } else if (errorMessage.includes("password")) {
        setError("Please check your password and try again.")
      } else {
        setError(err.message || "Unable to sign in. Please check your credentials and try again.")
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

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("flow", "reset")

      await signIn("password", formData)
      
      // Move to code entry step
      setStep({ resetEmail: email })
      setError(null)
    } catch (err: any) {
      console.error("Reset request error:", err)
      
      // Handle specific error cases
      const errorMessage = err.message?.toLowerCase() || ""
      
      if (errorMessage.includes("user not found") || errorMessage.includes("no account")) {
        setError("No account found with this email. Please check your email or sign up.")
      } else if (errorMessage.includes("invalid email")) {
        setError("Please enter a valid email address.")
      } else if (errorMessage.includes("too many")) {
        setError("Too many reset requests. Please try again later.")
      } else {
        setError(err.message || "Failed to send reset code. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", typeof step === "object" ? step.resetEmail : email)
      formData.append("code", code)
      formData.append("newPassword", newPassword)
      formData.append("flow", "reset-verification")

      await signIn("password", formData)
      
      onOpenChange(false)
      resetForm()
      setStep("signIn")
    } catch (err: any) {
      console.error("Reset password error:", err)
      
      // Handle specific error cases
      const errorMessage = err.message?.toLowerCase() || ""
      
      if (errorMessage.includes("invalid code") || errorMessage.includes("wrong code")) {
        setError("Invalid reset code. Please check the code and try again.")
      } else if (errorMessage.includes("expired")) {
        setError("Reset code has expired. Please request a new one.")
      } else if (errorMessage.includes("password") && (errorMessage.includes("weak") || errorMessage.includes("short"))) {
        setError("Password must be at least 8 characters long.")
      } else if (errorMessage.includes("already used")) {
        setError("This reset code has already been used. Please request a new one.")
      } else {
        setError(err.message || "Unable to reset password. Please check your code and try again.")
      }
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
                📧 <strong>Check your email!</strong> We've sent a reset code to your inbox. Also check Convex terminal if configured.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Reset Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code from console"
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
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("forgotPassword")
                setError(null)
              }}
            >
              Back
            </Button>
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
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
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>
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
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
            <div className="text-center text-sm">
              <button type="button" onClick={() => { setStep("signUp"); setError(null); }} className="text-primary hover:underline">
                Don't have an account? Sign up
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
