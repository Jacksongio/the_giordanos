import { type NextRequest, NextResponse } from "next/server"

// Spotify API credentials (optional - will work without them)
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiry = 0

async function getAccessToken() {
  // Check if we have valid credentials
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return null
  }

  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000
    return accessToken
  } catch (error) {
    console.error("Failed to get Spotify access token:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter required" }, { status: 400 })
  }

  const token = await getAccessToken()

  if (!token) {
    return NextResponse.json(
      { error: "Spotify API not configured. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables." },
      { status: 503 },
    )
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Spotify API request failed")
    }

    const data = await response.json()
    return NextResponse.json({ tracks: data.tracks.items })
  } catch (error) {
    console.error("Spotify search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
