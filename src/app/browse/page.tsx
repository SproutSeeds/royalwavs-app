"use client"

import { useEffect, useState } from "react"
import { SongCard } from "@/components/SongCard"

type Song = {
  id: string
  title: string
  artistName: string
  albumArtUrl?: string
  totalRoyaltyPool: number
  monthlyRevenue: number
  investments: Array<{
    amountInvested: number
    royaltyPercentage: number
  }>
}

export default function BrowsePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'newest' | 'revenue' | 'pool' | 'available'>('newest')

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const response = await fetch("/api/songs")
      if (response.ok) {
        const data = await response.json()
        setSongs(data)
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedSongs = songs
    .filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.monthlyRevenue - a.monthlyRevenue
        case 'pool':
          return b.totalRoyaltyPool - a.totalRoyaltyPool
        case 'available':
          const aInvested = a.investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
          const bInvested = b.investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
          const aAvailable = a.totalRoyaltyPool - aInvested
          const bAvailable = b.totalRoyaltyPool - bInvested
          return bAvailable - aAvailable
        default: // newest
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
    })

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

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-300 bg-clip-text text-transparent">
              Browse Songs
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Discover rising artists and invest in their journey to success
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/50 text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search songs or artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-800 text-white">Newest First</option>
                <option value="revenue" className="bg-slate-800 text-white">Highest Revenue</option>
                <option value="pool" className="bg-slate-800 text-white">Largest Pool</option>
                <option value="available" className="bg-slate-800 text-white">Most Available</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mt-4">
            <p className="text-white/60 text-sm">
              {filteredAndSortedSongs.length} song{filteredAndSortedSongs.length !== 1 ? 's' : ''} found
              {searchTerm && (
                <span> for "<span className="text-amber-300">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>

        {/* Songs Grid */}
        {filteredAndSortedSongs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredAndSortedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 sm:mt-16">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Start Your Investment Journey?
                </h3>
                <p className="text-white/70 mb-6 text-base sm:text-lg">
                  Join thousands of music investors supporting the next generation of artists
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/api/auth/signin'}
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                      <span className="text-xl sm:text-2xl group-hover:animate-bounce">💎</span>
                      <span>Start Investing</span>
                      <span className="text-xl sm:text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                    </div>
                  </button>
                  <button
                    onClick={() => window.location.href = '/upload'}
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-green-600/20 hover:from-emerald-600/40 hover:via-teal-600/40 hover:to-green-600/40 backdrop-blur-xl border-2 border-emerald-400/40 hover:border-emerald-300/60 text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 sm:space-x-3"
                  >
                    <span className="text-xl sm:text-2xl group-hover:animate-bounce">🎤</span>
                    <span>Upload Music</span>
                    <span className="text-xl sm:text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>🎵</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Results */
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <span className="text-3xl sm:text-4xl">🎵</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {searchTerm ? `No songs found for "${searchTerm}"` : 'No songs available'}
            </h3>
            <p className="text-white/60 mb-6 sm:mb-8 max-w-md mx-auto text-base sm:text-lg">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all available songs'
                : 'Be the first to upload your music and start receiving investments!'
              }
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/upload'}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                Upload First Song
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}