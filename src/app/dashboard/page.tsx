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

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchInvestments()
    }
  }, [session])

  const fetchInvestments = async () => {
    try {
      const response = await fetch("/api/investments")
      if (response.ok) {
        const data = await response.json()
        setInvestments(data)
      }
    } catch (error) {
      console.error("Failed to fetch investments:", error)
    } finally {
      setLoading(false)
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

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const totalEarnings = investments.reduce((sum, inv) => 
    sum + inv.payouts.reduce((payoutSum, payout) => payoutSum + payout.amount, 0), 0
  )
  const monthlyProjected = investments.reduce((sum, inv) => 
    sum + (inv.song.monthlyRevenue * (inv.royaltyPercentage / 100)), 0
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          My Investments
        </h1>
        <p className="text-white/70">
          Track your royalty investments and earnings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Invested</h3>
          <p className="text-3xl font-bold text-white">
            ${totalInvested.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-green-400">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white/70 text-sm mb-2">Monthly Projected</h3>
          <p className="text-3xl font-bold text-purple-400">
            ${monthlyProjected.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Investments List */}
      {investments.length === 0 ? (
        <div className="text-center py-12 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl">
          <p className="text-white/60 text-lg mb-4">
            You haven't made any investments yet.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Browse Songs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Your Investments</h2>
          
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

                  {investment.payouts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-white/50 text-xs mb-2">Recent Payouts</p>
                      <div className="flex gap-4 text-xs">
                        {investment.payouts.slice(0, 3).map((payout) => (
                          <span key={payout.id} className="text-green-400">
                            {payout.period}: ${payout.amount.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}