"use client"

import { useEffect, useState, useRef } from "react"
import { SongCard } from "@/components/SongCard"
import { DemoFlowSection } from "@/components/DemoFlow"

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

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [showMaya, setShowMaya] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [buttonPoofing, setButtonPoofing] = useState(false)

  useEffect(() => {
    fetchSongs()
  }, [])

  const handleHeroClick = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    
    // Fade to Maya section
    setTimeout(() => {
      setShowMaya(true)
      setIsTransitioning(false)
    }, 800)
  }

  const handleWatchJourney = () => {
    setIsTransitioning(true)
    setButtonPoofing(true)
    
    // Show demo with falling animations after smoke poof
    setTimeout(() => {
      setShowDemo(true)
      setIsTransitioning(false)
    }, 1200) // Wait for smoke animation to complete
  }

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
    <div className="max-w-7xl mx-auto relative">
      {/* Hero Section - Clickable with shimmer effects */}
      {!showMaya && !showDemo && (
        <div 
          onClick={handleHeroClick}
          className={`min-h-screen flex items-center justify-center text-center relative cursor-pointer transition-all duration-800 ${isTransitioning ? 'animate-fade-out' : ''}`}
        >
          {/* Floating golden elements */}
          <div className="absolute left-1/4 top-1/3 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute right-1/3 top-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-40"></div>
          <div className="absolute left-2/3 top-2/5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-8xl md:text-9xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent text-shimmer">
                Build Artists
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent text-shimmer">
                Share Success
              </span>
            </h1>
            
            <div className="w-40 h-1.5 bg-gradient-to-r from-amber-400 to-cyan-400 mx-auto mb-10 rounded-full"></div>
            
            <p className="text-3xl text-white/90 mb-8 font-light leading-relaxed max-w-4xl mx-auto">
              <span className="text-shimmer">Partner with rising stars by acquiring{" "}</span>
              <span className="text-amber-300 font-medium text-shimmer">royalty shares</span>
              <span className="text-shimmer">{" "}— when they succeed, you succeed together</span>
            </p>
            
            <p className="text-xl text-cyan-200/80 max-w-3xl mx-auto font-light mb-20 text-shimmer">
              Be part of their journey from the beginning — Like owning stock in the next music legend
            </p>

            {/* Click indicator */}
            <div className="flex flex-col items-center space-y-2 text-amber-300/80 animate-bounce">
              <span className="text-sm font-medium text-shimmer">Click anywhere to continue</span>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Sisy Section */}
      {showMaya && !showDemo && (
        <div className={`min-h-screen flex items-center justify-center relative ${isTransitioning ? 'animate-fade-out' : 'animate-fadeIn'}`}>
          <div className="text-center">
            <div className="mb-16">
              <h2 className="text-6xl font-black mb-8">
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Meet Sisy
                </span>
              </h2>
              <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-light">
                A talented bedroom producer about to change her life — and yours
              </p>
            </div>

            {/* Sparkling Watch Journey Button with Smoke Effect */}
            <div className="relative">
              <button
                onClick={handleWatchJourney}
                disabled={buttonPoofing}
                className={`group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden ${buttonPoofing ? 'animate-smoke-poof' : ''}`}
              >
                {/* Sparkle Animation Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                {/* Sparkles */}
                <div className="absolute top-2 left-8 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-3 right-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"></div>
                <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                
                <div className="relative flex items-center space-x-4">
                  <span className="text-4xl group-hover:animate-bounce">✨</span>
                  <span>Watch Sisy's Journey</span>
                  <span className="text-4xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>🎵</span>
                </div>
              </button>
              
              {/* Smoke Particles */}
              {buttonPoofing && (
                <>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/60 rounded-full animate-smoke-particle" style={{ animationDelay: '0ms' }}></div>
                  <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-300/50 rounded-full animate-smoke-particle" style={{ animationDelay: '100ms' }}></div>
                  <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white/40 rounded-full animate-smoke-particle" style={{ animationDelay: '200ms' }}></div>
                  <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400/60 rounded-full animate-smoke-particle" style={{ animationDelay: '50ms' }}></div>
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/30 rounded-full animate-smoke-particle" style={{ animationDelay: '150ms' }}></div>
                </>
              )}
            </div>

            <p className="text-lg text-white/60 mt-8 font-light">
              From bedroom beats to chart success — see how partnerships work
            </p>
          </div>
        </div>
      )}

      {/* Demo Section with Physics */}
      {showDemo && (
        <div className="min-h-screen">
          <DemoFlowSection showPhysics={true} />
        </div>
      )}

      {/* Songs Grid */}
      {songs.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-400/30">
              <span className="text-4xl">👑</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">The Next Legends Await</h2>
            <p className="text-xl text-white/70 mb-8">
              Partner with tomorrow's superstars before the world discovers them
            </p>
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-amber-400/30">
              <span className="text-amber-300 font-medium">Early Access: Rising Artists</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Partner With Rising Stars
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}