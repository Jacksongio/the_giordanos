"use client"

import { ReactNode, useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { AuthDialog } from "./auth-dialog"

interface ProtectedPageProps {
  children: ReactNode
  title?: string
}

export function ProtectedPage({ children, title = "This Page" }: ProtectedPageProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const viewer = useQuery(api.users.getCurrentUser)
  
  const isLoading = viewer === undefined
  const isAuthenticated = viewer !== null

  // Automatically open the auth dialog when an unauthenticated user lands on the page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAuthDialogOpen(true)
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <LogIn className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground">
                You need to sign in to access {title}. Please sign in to continue.
              </p>
            </div>
            <Button size="lg" onClick={() => setAuthDialogOpen(true)}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </>
    )
  }

  return <>{children}</>
}

