"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ReactNode, useMemo } from "react"

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!url) {
      throw new Error(
        "Missing NEXT_PUBLIC_CONVEX_URL. See .env.local.example for setup instructions."
      )
    }
    return new ConvexReactClient(url)
  }, [])

  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
    </ConvexProvider>
  )
}

