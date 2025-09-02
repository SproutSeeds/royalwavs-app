"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

type Song = {
  id: string
  title: string
  artistName: string
  albumArtUrl?: string
  totalRoyaltyPool: number
  monthlyRevenue: number
  createdAt: string
  artist: {
    id: string
    name: string
  }
  investments: Array<{
    amountInvested: number
    royaltyPercentage: number
  }>
}

export default function EditSongPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const songId = params?.id as string

  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    artistName: "",
    albumArtUrl: "",
    totalRoyaltyPool: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    if (songId) {
      fetchSong()
    }
  }, [songId])

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs/${songId}`)
      if (response.ok) {
        const data = await response.json()
        setSong(data)
        setFormData({
          title: data.title,
          artistName: data.artistName,
          albumArtUrl: data.albumArtUrl || "",
          totalRoyaltyPool: data.totalRoyaltyPool,
          monthlyRevenue: data.monthlyRevenue,
        })
      } else {
        alert("Song not found")
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to fetch song:", error)
      alert("Failed to load song")
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert("You must be signed in to edit songs")
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Song updated successfully!")
        router.push("/dashboard")
      } else {
        const error = await response.json()
        alert(`Failed to update song: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Song update error:", error)
      alert(`Error during update: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-cyan-500/20 border-b-cyan-400 animate-spin animate-reverse"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-amber-400/30">
            <span className="text-3xl sm:text-4xl">🎵</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Sign In Required
            </span>
          </h1>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Please sign in to edit your songs
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl group-hover:animate-bounce">🌴</span>
              <span>Enter Paradise</span>
              <span className="text-xl sm:text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Song not found</h1>
          <p className="text-white/60 mb-6">The song you're trying to edit doesn't exist.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Check if current user owns this song
  const totalInvested = song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const hasInvestments = totalInvested > 0

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Edit Song
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Update your song information and settings
          </p>
        </div>

        {/* Warning if song has investments */}
        {hasInvestments && (
          <div className="mb-6 sm:mb-8 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="text-amber-400 text-xl">⚠️</div>
              <div>
                <h3 className="text-amber-300 font-semibold mb-2">Song Has Active Investments</h3>
                <p className="text-amber-200/80 text-sm">
                  This song has ${totalInvested.toFixed(0)} in active investments. Changes to revenue or pool size may affect investor returns.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-emerald-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-white/80 text-sm font-medium mb-2">
                Song Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="artistName" className="block text-white/80 text-sm font-medium mb-2">
                Artist Name
              </label>
              <input
                id="artistName"
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="albumArtUrl" className="block text-white/80 text-sm font-medium mb-2">
                Album Art URL (Optional)
              </label>
              <input
                id="albumArtUrl"
                type="url"
                name="albumArtUrl"
                value={formData.albumArtUrl}
                onChange={handleChange}
                placeholder="https://example.com/album-art.jpg"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300"
              />
              <p className="text-white/50 text-xs mt-1">
                Direct link to your album artwork
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalRoyaltyPool" className="block text-white/80 text-sm font-medium mb-2">
                  Total Royalty Pool ($)
                </label>
                <input
                  id="totalRoyaltyPool"
                  type="number"
                  name="totalRoyaltyPool"
                  value={formData.totalRoyaltyPool}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300"
                  required
                />
                {hasInvestments && (
                  <p className="text-amber-300/80 text-xs mt-1">
                    Current investments: ${totalInvested.toFixed(0)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="monthlyRevenue" className="block text-white/80 text-sm font-medium mb-2">
                  Monthly Revenue ($)
                </label>
                <input
                  id="monthlyRevenue"
                  type="number"
                  name="monthlyRevenue"
                  value={formData.monthlyRevenue}
                  onChange={handleChange}
                  min="0"
                  step="10"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="flex-1 group relative px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {saving ? (
                  <div className="relative flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl group-hover:animate-bounce">💾</span>
                    <span>Save Changes</span>
                    <span className="text-xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}