"use client"

import { useEffect, useState } from "react"
import { DemoFlowSection } from "@/components/DemoFlow"

export default function HomePage() {
  const [showMaya, setShowMaya] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [buttonPoofing, setButtonPoofing] = useState(false)

  useEffect(() => {
    // Check if we need to reset (from RoyalWavs click)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      setShowMaya(false)
      setShowDemo(false)
      setIsTransitioning(false)
      setButtonPoofing(false)
      // Clean up the URL
      window.history.replaceState({}, document.title, '/')
    }
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

  const resetToHero = () => {
    setShowMaya(false)
    setShowDemo(false)
    setIsTransitioning(false)
    setButtonPoofing(false)
  }


  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Hero Section with Action Buttons */}
      {!showMaya && !showDemo && (
        <div className={`min-h-screen flex items-center justify-center text-center relative transition-all duration-800 ${isTransitioning ? 'animate-fade-out' : ''}`}>
          {/* Floating golden elements */}
          <div className="absolute left-1/4 top-1/3 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute right-1/3 top-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-40"></div>
          <div className="absolute left-2/3 top-2/5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent text-shimmer">
                Build Artists
              </span>
              <br />
              <span className="text-white text-sparkle">
                Share Success
              </span>
            </h1>
            
            <div className="w-40 h-1.5 bg-gradient-to-r from-amber-400 to-cyan-400 mx-auto mb-10 rounded-full"></div>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 font-light leading-relaxed max-w-4xl mx-auto px-4">
              <span className="text-shimmer">Partner with rising stars by acquiring{" "}</span>
              <span className="text-amber-300 font-medium text-shimmer">royalty shares</span>
              <span className="text-shimmer">{" "}— when they succeed, you succeed together</span>
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-cyan-200/80 max-w-3xl mx-auto font-light mb-12 text-shimmer px-4">
              Be part of their journey from the beginning — Like owning stock in the next music legend
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              {/* Browse Songs Button - Primary */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button 
                  onClick={() => window.location.href = '/browse'}
                  className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold text-xl rounded-2xl leading-none flex items-center space-x-3 hover:scale-105 transition-all duration-300">
                  <span className="text-2xl">💎</span>
                  <span>Browse Songs</span>
                  <span className="text-2xl">🎵</span>
                </button>
              </div>

              {/* Upload Music Button - Secondary */}
              <button 
                onClick={() => window.location.href = '/upload'}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-green-600/20 hover:from-emerald-600/40 hover:via-teal-600/40 hover:to-green-600/40 backdrop-blur-xl border-2 border-emerald-400/40 hover:border-emerald-300/60 text-white rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
              >
                <span className="text-2xl group-hover:animate-bounce">🎤</span>
                <span>Upload Music</span>
                <span className="text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
              </button>
            </div>

            {/* Demo Link */}
            <button 
              onClick={handleHeroClick}
              className="text-amber-300/80 hover:text-amber-300 transition-colors text-sm font-medium underline underline-offset-4"
            >
              Or watch how it works with Sisy's story →
            </button>
          </div>
        </div>
      )}

      {/* Sisy Section */}
      {showMaya && !showDemo && (
        <div className={`min-h-screen flex items-center justify-center relative ${isTransitioning ? 'animate-fade-out' : 'animate-fadeIn'}`}>
          <div className="text-center w-full px-4">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8">
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Meet Sisy
                </span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto font-light">
                A talented bedroom producer about to change her life — and yours
              </p>
            </div>

            {/* Sparkling Watch Journey Button with Smoke Effect */}
            <div className="relative">
              <button
                onClick={handleWatchJourney}
                disabled={buttonPoofing}
                className={`group relative px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-3xl font-black text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden ${buttonPoofing ? 'animate-smoke-poof' : ''}`}
              >
                {/* Removed shimmer - no color flashing */}
                
                {/* Sparkles */}
                <div className="absolute top-2 left-8 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-3 right-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"></div>
                <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                
                <div className="relative flex items-center space-x-4">
                  <span className="text-4xl group-hover:animate-bounce">✨</span>
                  <span>Watch Sisy&apos;s Journey</span>
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

            <p className="text-lg text-white/60 mt-6 font-light">
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

    </div>
  )
}