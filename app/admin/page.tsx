"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Lock } from "lucide-react"

export default function AdminPage() {
  const isAdmin = useQuery(api.users.isAdmin)
  const currentUser = useQuery(api.users.getCurrentUser)

  // Loading
  if (isAdmin === undefined || currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated or not admin
  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h1 className="font-serif text-2xl text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
