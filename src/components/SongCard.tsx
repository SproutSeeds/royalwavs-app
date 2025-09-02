"use client"

import Image from "next/image"
import Link from "next/link"

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

interface SongCardProps {
  song: Song
}

export function SongCard({ song }: SongCardProps) {
  const totalInvested = song.investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
  const availableToInvest = song.totalRoyaltyPool - totalInvested
  const monthlyAPY = song.totalRoyaltyPool > 0 ? (song.monthlyRevenue / song.totalRoyaltyPool) * 100 : 0

  return (
    <Link href={`/song/${song.id}`} className="group block cursor-pointer">
      <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-400/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-amber-500/30 relative">
        
        {/* Golden corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-3xl"></div>
        
        {/* Album Art */}
        <div className="relative aspect-square overflow-hidden">
          {song.albumArtUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={song.albumArtUrl}
                alt={`${song.title} album art`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Tropical overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-transparent to-amber-400/20"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-600 via-cyan-500 to-emerald-500 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-amber-400/20"></div>
              <div className="text-white/80 text-5xl relative z-10">🎵</div>
            </div>
          )}
          
          {/* Floating stats overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-sm font-bold px-3 py-1 rounded-full mb-2 inline-block">
                ${song.monthlyRevenue.toFixed(0)} monthly royalties
              </div>
              <div className="text-cyan-300 text-xs font-medium">
                {monthlyAPY.toFixed(1)}% ownership yield
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Title & Artist */}
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg truncate group-hover:text-amber-300 transition-colors duration-300">
              {song.title}
            </h3>
            <p className="text-cyan-200/80 text-sm truncate font-medium">
              {song.artistName}
            </p>
          </div>

          {/* Partnership Stats */}
          <div className="space-y-3">
            {/* Total Value & Available */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-xl border border-amber-400/30">
                <div className="text-amber-300 text-lg font-bold">
                  ${song.totalRoyaltyPool.toFixed(0)}
                </div>
                <div className="text-white/60 text-xs">Total Value</div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl border border-emerald-400/30">
                <div className="text-emerald-300 text-lg font-bold">
                  ${availableToInvest.toFixed(0)}
                </div>
                <div className="text-white/60 text-xs">Available</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Partnership Sold</span>
                <span className="text-cyan-300 font-medium">
                  {song.totalRoyaltyPool > 0 ? ((totalInvested / song.totalRoyaltyPool) * 100).toFixed(1) : 0}%
                </span>
              </div>
              
              <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 transition-all duration-1000 rounded-full relative"
                  style={{ 
                    width: `${song.totalRoyaltyPool > 0 ? (totalInvested / song.totalRoyaltyPool) * 100 : 0}%` 
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-center space-x-2 text-center group-hover:scale-105 transition-transform duration-300">
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm tracking-wide">
                Partner & Build Together
              </span>
              <div className="text-amber-400 group-hover:translate-x-1 transition-transform duration-300">→</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}