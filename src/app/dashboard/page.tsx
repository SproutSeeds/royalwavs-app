"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

type Investment = {
  id: string
  amountInvested: number
  royaltyPercentage: number
  createdAt: string
  song: {
    id: string
    title: string
    artistName: string
    albumArtUrl?: string
    monthlyRevenue: number
  }
  payouts: Array<{
    id: string
    amount: number
    period: string
    paidAt: string
  }>
}

type ArtistSong = {
  id: string
  title: string
  artistName: string
  albumArtUrl?: string
  audioFileUrl?: string
  totalRoyaltyPool: number
  monthlyRevenue: number
  createdAt: string
  investments: Array<{
    amountInvested: number
    royaltyPercentage: number
  }>
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [artistSongs, setArtistSongs] = useState<ArtistSong[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'investments' | 'songs'>('investments')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // Fetch both investments and artist songs in parallel
      const [investmentsResponse, songsResponse] = await Promise.all([
        fetch("/api/investments"),
        fetch("/api/artist-songs")
      ])
      
      if (investmentsResponse.ok) {
        const investmentData = await investmentsResponse.json()
        setInvestments(investmentData)
      }
      
      if (songsResponse.ok) {
        const songsData = await songsResponse.json()
        setArtistSongs(songsData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSong = async (songId: string, songTitle: string) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${songTitle}"? This action cannot be undone.`
    )
    
    if (!confirmDelete) return

    setDeletingId(songId)

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the song from the local state
        setArtistSongs(prev => prev.filter(song => song.id !== songId))
        alert(`"${songTitle}" has been deleted successfully.`)
      } else {
        const error = await response.json()
        alert(`Failed to delete song: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error('Delete song error:', error)
      alert(`Error deleting song: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setDeletingId(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl text-white mb-4">Please sign in</h1>
        <p className="text-white/60">You need to be signed in to view your dashboard.</p>
      </div>
    )
  }

  // Investment calculations
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const totalEarnings = investments.reduce((sum, inv) => 
    sum + inv.payouts.reduce((payoutSum, payout) => payoutSum + payout.amount, 0), 0
  )
  const monthlyProjectedFromInvestments = investments.reduce((sum, inv) => 
    sum + (inv.song.monthlyRevenue * (inv.royaltyPercentage / 100)), 0
  )

  // Artist song calculations
  const totalSongValue = artistSongs.reduce((sum, song) => sum + song.totalRoyaltyPool, 0)
  const totalSongEarnings = artistSongs.reduce((sum, song) => sum + song.monthlyRevenue, 0)
  const totalInvestmentsReceived = artistSongs.reduce((sum, song) => 
    sum + song.investments.reduce((invSum, inv) => invSum + inv.amountInvested, 0), 0
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          My Portfolio
        </h1>
        <p className="text-white/70 text-sm sm:text-base">
          Manage your investments and uploaded songs
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-1">
        <button
          onClick={() => setActiveTab('investments')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'investments'
              ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>💎</span>
            <span>My Investments</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{investments.length}</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('songs')}
          className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'songs'
              ? 'bg-gradient-to-r from-emerald-600/50 to-teal-600/50 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>🎵</span>
            <span>My Songs</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{artistSongs.length}</span>
          </span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {activeTab === 'investments' ? (
          <>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Total Invested</h3>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ${totalInvested.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Total Earned</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Monthly Projected</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                ${monthlyProjectedFromInvestments.toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Total Song Value</h3>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                ${totalSongValue.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Monthly Revenue</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                ${totalSongEarnings.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h3 className="text-white/70 text-xs sm:text-sm mb-2">Investments Received</h3>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                ${totalInvestmentsReceived.toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'investments' ? (
        <div>
          {investments.length === 0 ? (
            <div className="text-center py-12 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30">
                <span className="text-4xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Start Your Investment Journey</h3>
              <p className="text-white/60 text-lg mb-6">
                Discover rising artists and buy royalty shares in their future success
              </p>
              <Link
                href="/browse"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                Browse Songs to Invest
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Album Art */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {investment.song.albumArtUrl ? (
                        <Image
                          src={investment.song.albumArtUrl}
                          alt={investment.song.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-lg">🎵</span>
                        </div>
                      )}
                    </div>

                    {/* Investment Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {investment.song.title}
                          </h3>
                          <p className="text-white/70">{investment.song.artistName}</p>
                        </div>
                        <Link
                          href={`/song/${investment.song.id}`}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View Song →
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-white/50">Invested</p>
                          <p className="text-white font-medium">
                            ${investment.amountInvested.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Ownership</p>
                          <p className="text-purple-400 font-medium">
                            {investment.royaltyPercentage.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Monthly Earnings</p>
                          <p className="text-green-400 font-medium">
                            ${(investment.song.monthlyRevenue * (investment.royaltyPercentage / 100)).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Total Earned</p>
                          <p className="text-green-400 font-medium">
                            ${investment.payouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {artistSongs.length === 0 ? (
            <div className="text-center py-12 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-400/30">
                <span className="text-4xl">🎵</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Share Your Music with the World</h3>
              <p className="text-white/60 text-lg mb-6">
                Upload your songs and let fans invest in your musical journey
              </p>
              <Link
                href="/upload"
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Upload Your First Song
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {artistSongs.map((song) => (
                <div
                  key={song.id}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Album Art */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {song.albumArtUrl ? (
                        <Image
                          src={song.albumArtUrl}
                          alt={song.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                          <span className="text-white text-lg">🎵</span>
                        </div>
                      )}
                    </div>

                    {/* Song Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {song.title}
                          </h3>
                          <p className="text-white/70">by {song.artistName}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/song/${song.id}/edit`}
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteSong(song.id, song.title)}
                            disabled={deletingId === song.id || song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0) > 0}
                            className="text-red-400 hover:text-red-300 disabled:text-red-400/50 disabled:cursor-not-allowed text-sm font-medium"
                            title={song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0) > 0 ? "Cannot delete song with active investments" : "Delete song"}
                          >
                            {deletingId === song.id ? 'Deleting...' : 'Delete'}
                          </button>
                          <Link
                            href={`/song/${song.id}`}
                            className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                          >
                            View →
                          </Link>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-white/50">Total Value</p>
                          <p className="text-white font-medium">
                            ${song.totalRoyaltyPool.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Monthly Revenue</p>
                          <p className="text-green-400 font-medium">
                            ${song.monthlyRevenue.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Investors</p>
                          <p className="text-emerald-400 font-medium">
                            {song.investments.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Investments Received</p>
                          <p className="text-emerald-400 font-medium">
                            ${song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}