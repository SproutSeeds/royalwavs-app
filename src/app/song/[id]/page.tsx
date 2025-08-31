"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { InvestmentForm } from "@/components/InvestmentForm"

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

export default function SongPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSong()
  }, [params.id])

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSong(data)
      }
    } catch (error) {
      console.error("Failed to fetch song:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-white mb-4">Song not found</h1>
        <p className="text-white/60">The song you're looking for doesn't exist.</p>
      </div>
    )
  }

  const totalInvested = song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const availableToInvest = song.totalRoyaltyPool - totalInvested
  const monthlyAPY = song.totalRoyaltyPool > 0 ? (song.monthlyRevenue / song.totalRoyaltyPool) * 100 : 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left side - Song Info */}
        <div>
          {/* Album Art */}
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
            {song.albumArtUrl ? (
              <Image
                src={song.albumArtUrl}
                alt={`${song.title} album art`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <div className="text-white/60 text-6xl">🎵</div>
              </div>
            )}
          </div>

          {/* Song Details */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{song.title}</h1>
            <p className="text-xl text-white/80 mb-4">{song.artistName}</p>
            <p className="text-white/60 text-sm">
              Released {new Date(song.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right side - Investment Info */}
        <div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Investment Details</h2>
            
            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">Total Pool Size</span>
                <span className="text-white font-semibold text-lg">
                  ${song.totalRoyaltyPool.toFixed(0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">Monthly Revenue</span>
                <span className="text-green-400 font-semibold text-lg">
                  ${song.monthlyRevenue.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">Monthly Yield</span>
                <span className="text-purple-400 font-semibold text-lg">
                  {monthlyAPY.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white/70">Available to Invest</span>
                <span className="text-blue-400 font-semibold text-lg">
                  ${availableToInvest.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Investment Progress</span>
                <span>{((totalInvested / song.totalRoyaltyPool) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${song.totalRoyaltyPool > 0 ? (totalInvested / song.totalRoyaltyPool) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            {/* Investment Form */}
            {session ? (
              <InvestmentForm songId={song.id} availableAmount={availableToInvest} />
            ) : (
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-white/70 mb-4">Sign in to invest in this song</p>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                  Sign In to Invest
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}