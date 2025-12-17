"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Music, ThumbsUp, Plus } from "lucide-react"
import { getSongs, addSong, upvoteSong, type Song } from "./actions"

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
}

export default function SongSuggestionsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [nameConfirmed, setNameConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim() || !showSearch) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      searchSpotify(searchQuery)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, showSearch])

  const loadSongs = async () => {
    setIsLoading(true)
    try {
      const data = await getSongs()
      setSongs(data)
    } catch (error) {
      console.error("Error loading songs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchSpotify = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.tracks || [])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddSong = async (track: SpotifyTrack) => {
    try {
      await addSong({
        song_name: track.name,
        artist_name: track.artists.map((a) => a.name).join(", "),
        spotify_id: track.id,
        album_image: track.album.images[0]?.url,
        suggested_by: guestName || "Anonymous",
      })

      await loadSongs()
      setSearchQuery("")
      setSearchResults([])
      setShowSearch(false)
    } catch (error) {
      console.error("Error adding song:", error)
      alert("Failed to add song. Please try again.")
    }
  }

  const addManualSong = async () => {
    if (!searchQuery.trim()) return

    try {
      await addSong({
        song_name: searchQuery,
        artist_name: "Unknown Artist",
        suggested_by: guestName || "Anonymous",
      })

      await loadSongs()
      setSearchQuery("")
      setSearchResults([])
      setShowSearch(false)
    } catch (error) {
      console.error("Error adding song:", error)
      alert("Failed to add song. Please try again.")
    }
  }

  const handleUpvote = async (songId: string) => {
    try {
      await upvoteSong(songId)
      await loadSongs()
    } catch (error) {
      console.error("Error upvoting song:", error)
      alert("Failed to upvote. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">Song Suggestions</h1>
          <p className="text-muted-foreground">Help us create the perfect playlist for our special day!</p>
        </div>

        {/* Guest Name Input */}
        {!nameConfirmed && (
          <Card className="p-6 mb-6 bg-card">
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && guestName.trim()) {
                    setNameConfirmed(true)
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  setNameConfirmed(true)
                }}
                disabled={!guestName.trim()}
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Add Song Button - Only enabled after name is confirmed */}
        {!showSearch && (
          <Button onClick={() => setShowSearch(true)} className="w-full mb-6" size="lg" disabled={!nameConfirmed}>
            <Plus className="w-5 h-5 mr-2" />
            Suggest a Song
          </Button>
        )}

        {/* Search Interface */}
        {showSearch && (
          <Card className="p-6 mb-6 bg-card">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for a song..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                Cancel
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleAddSong(track)}
                  >
                    {track.album.images[0] ? (
                      <img
                        src={track.album.images[0].url || "/placeholder.svg"}
                        alt={track.album.name}
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}

            {/* Manual Entry Option */}
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">No results found. Add it manually?</p>
                <Button onClick={addManualSong} variant="outline">
                  Add "{searchQuery}"
                </Button>
              </div>
            )}

            {isSearching && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            )}
          </Card>
        )}

        {/* Song List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="p-12 text-center bg-card">
              <p className="text-muted-foreground">Loading songs...</p>
            </Card>
          ) : songs.length === 0 ? (
            <Card className="p-12 text-center bg-card">
              <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No songs suggested yet. Be the first!</p>
            </Card>
          ) : (
            songs.map((song) => (
              <Card key={song.id} className="p-4 bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {song.album_image ? (
                    <img src={song.album_image || "/placeholder.svg"} alt="Album" className="w-16 h-16 rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{song.song_name}</h3>
                    <p className="text-muted-foreground truncate">{song.artist_name}</p>
                    <p className="text-sm text-muted-foreground">Suggested by {song.suggested_by}</p>
                  </div>
                  <Button
                    onClick={() => handleUpvote(song.id)}
                    variant="outline"
                    size="lg"
                    className="flex-col h-auto py-2 px-4"
                  >
                    <ThumbsUp className="w-5 h-5 mb-1" />
                    <span className="text-lg font-bold">{song.votes}</span>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
