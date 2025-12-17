"use client"

import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import { AuthDialog } from "./auth-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthButton() {
  const { signOut } = useAuthActions()
  const viewer = useQuery(api.users.getCurrentUser)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const isLoading = viewer === undefined
  const isAuthenticated = viewer !== null
  const user = viewer || undefined

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setAuthDialogOpen(true)}>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          {user?.name || user?.email || "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          <div className="font-medium">{user?.name || "User"}</div>
          <div className="text-xs">{user?.email}</div>
        </div>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

