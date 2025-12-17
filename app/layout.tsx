import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { ConvexClientProvider } from "@/components/convex-provider"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Jackson & Audrey - Our Wedding",
  description: "Join us as we celebrate our love story",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.className} ${GeistMono.className} ${playfair.variable}`}>
        <ConvexClientProvider>
          <Navigation />
          <div className="pt-16">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
