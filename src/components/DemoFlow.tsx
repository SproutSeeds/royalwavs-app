"use client"

import { useState, useEffect } from "react"

const demoSteps = [
  {
    id: 1,
    title: "Artist Uploads Track",
    description: "Sisy releases her new single",
    actor: "artist",
    content: {
      songTitle: "Summer Nights",
      artist: "Sisy Rodriguez",
      totalValue: 50000,
      artistKeeps: 60,
      forSale: 40
    }
  },
  {
    id: 2,
    title: "Set Partnership Terms", 
    description: "Sisy decides how much to share",
    actor: "artist",
    content: {
      explanation: "Sisy keeps 60% of royalties and offers 40% to partners"
    }
  },
  {
    id: 3,
    title: "Fans Discover & Partner",
    description: "Music lovers find Sisy's track",
    actor: "fan",
    content: {
      availableShares: 40,
      fanInvestment: 2500,
      expectedReturns: 125
    }
  },
  {
    id: 4,
    title: "Success Shared Together",
    description: "When Sisy wins, everyone wins",
    actor: "both",
    content: {
      monthlyStreams: "2.5M",
      totalRevenue: 8750,
      sisyEarns: 5250,
      partnersEarn: 3500
    }
  },
  {
    id: 5,
    title: "Start Your Collection",
    description: "Begin building your royalty portfolio",
    actor: "call-to-action",
    content: {}
  }
]

interface DemoFlowSectionProps {
  showPhysics?: boolean
}

export function DemoFlowSection({ showPhysics = false }: DemoFlowSectionProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [physicsStarted, setPhysicsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentStep = demoSteps.find(step => step.id === activeStep) || demoSteps[0]

  // Trigger physics animations when showPhysics becomes true
  useEffect(() => {
    if (showPhysics && !physicsStarted) {
      setPhysicsStarted(true)
      // Auto-start the demo after elements have fallen
      setTimeout(() => {
        setIsPlaying(true)
      }, 4000) // Wait for all elements to finish falling
    }
  }, [showPhysics, physicsStarted])

  // Auto-advance through steps
  useEffect(() => {
    if (!showPhysics || !isPlaying || isPaused) return

    const interval = setInterval(() => {
      setActiveStep(prev => prev >= 5 ? 1 : prev + 1)
    }, 5000) // 5 seconds per step

    return () => clearInterval(interval)
  }, [showPhysics, isPlaying, isPaused])

  // Handle manual step clicks with pause
  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId)
    setIsPaused(true)
    
    // Resume auto-advance after 15 seconds
    setTimeout(() => {
      setIsPaused(false)
    }, 15000)
  }

  // Mouse wheel support for step navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!showPhysics) return // Only allow wheel navigation when demo is active
      
      e.preventDefault()
      
      const nextStep = e.deltaY > 0 
        ? (activeStep < 5 ? activeStep + 1 : 1)
        : (activeStep > 1 ? activeStep - 1 : 5)
      
      handleStepClick(nextStep)
    }

    if (showPhysics) {
      window.addEventListener('wheel', handleWheel, { passive: false })
      return () => window.removeEventListener('wheel', handleWheel)
    }
  }, [showPhysics, activeStep])

  const playDemo = () => {
    setIsPlaying(true)
    setActiveStep(1)
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 4) {
          setIsPlaying(false)
          clearInterval(interval)
          return 1
        }
        return prev + 1
      })
    }, 8000) // 8 seconds per step
  }

  return (
    <div className="mb-20">
      {/* Section Header */}
      <div className={`text-center mb-16 ${showPhysics && physicsStarted ? 'animate-fall-bounce' : showPhysics ? 'opacity-0' : ''}`}>
        <h2 className="text-5xl font-black mb-6">
          <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
            Sisy's Journey
          </span>
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Follow Sisy's journey from bedroom producer to chart success — and see how her partners win together
        </p>
        
      </div>

      {/* Demo Flow */}
      <div className={`relative ${showPhysics && physicsStarted ? 'animate-fall-bounce-delay-2' : showPhysics ? 'opacity-0' : ''}`}>

        {/* Step Navigation */}
        <div className={`flex justify-center items-center space-x-8 md:space-x-16 mb-12 ${showPhysics && physicsStarted ? 'animate-fall-bounce-delay-3' : showPhysics ? 'opacity-0' : ''}`}>
          {demoSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className="group relative transition-all duration-500 cursor-pointer"
            >
              {/* Step Circle */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                activeStep >= step.id 
                  ? step.id === 5 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50 scale-110'
                    : 'bg-gradient-to-br from-pink-500 to-amber-500 shadow-lg shadow-pink-500/50 scale-110'
                  : 'bg-gray-600/40 hover:bg-gray-500/60'
              }`}>
                <span className="text-2xl font-bold text-white">
                  {step.id === 5 ? '🎴' : step.id}
                </span>
              </div>
              
              {/* Step Label */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center w-32">
                <div className={`font-semibold text-sm transition-colors duration-300 ${
                  activeStep >= step.id ? 'text-amber-300' : 'text-white/60'
                }`}>
                  {step.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area - Single Step Display */}
        <div className="max-w-4xl mx-auto mt-16">
          
          {/* Step 1: Artist Upload */}
          {activeStep === 1 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-pink-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                <span className="text-3xl relative z-10">🎤</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{currentStep.title}</h3>
              <p className="text-xl text-cyan-200/90 mb-8 drop-shadow-md">{currentStep.description}</p>
              
              {/* Mock Song Upload */}
              <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/20 max-w-md mx-auto hover:shadow-amber-500/40 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{currentStep.content.songTitle}</div>
                    <div className="text-sm text-cyan-300/80">{currentStep.content.artist}</div>
                  </div>
                </div>
                <div className="text-center relative z-10">
                  <div className="text-2xl font-bold text-amber-300 mb-1">
                    ${currentStep.content.totalValue?.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60">Projected Value</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Partnership Terms */}
          {activeStep === 2 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                <span className="text-3xl relative z-10">⚖️</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{currentStep.title}</h3>
              <p className="text-xl text-cyan-200/90 mb-8 drop-shadow-md">{currentStep.description}</p>
              
              {/* Pie Chart Representation */}
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                    <div className="text-white font-bold text-xl relative z-10">60%</div>
                  </div>
                  <div className="font-semibold text-white drop-shadow-md">Sisy Keeps</div>
                  <div className="text-sm text-cyan-300/80">Artist's Share</div>
                </div>
                
                <div className="text-4xl text-amber-300">+</div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                    <div className="text-white font-bold text-xl relative z-10">40%</div>
                  </div>
                  <div className="font-semibold text-white drop-shadow-md">For Partners</div>
                  <div className="text-sm text-cyan-300/80">Available to Buy</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fan Investment */}
          {activeStep === 3 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                <span className="text-3xl relative z-10">💎</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{currentStep.title}</h3>
              <p className="text-xl text-cyan-200/90 mb-8 drop-shadow-md">{currentStep.description}</p>
              
              {/* Investment Card */}
              <div className="bg-gradient-to-br from-slate-900/80 via-cyan-900/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 max-w-md mx-auto hover:shadow-cyan-500/40 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <div className="mb-6 relative z-10">
                  <div className="text-sm text-cyan-300/80 mb-2">Alex's Investment</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${currentStep.content.fanInvestment?.toLocaleString()}
                  </div>
                  <div className="text-sm text-amber-400">
                    = 5% of total royalties
                  </div>
                </div>
                
                <div className="border-t border-cyan-500/30 pt-4 relative z-10">
                  <div className="text-sm text-cyan-300/80 mb-2">Expected Monthly Returns</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${currentStep.content.expectedReturns}/month
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Shared Success */}
          {activeStep === 4 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                <span className="text-3xl relative z-10">🎉</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{currentStep.title}</h3>
              <p className="text-xl text-cyan-200/90 mb-8 drop-shadow-md">Sisy's song goes viral! {currentStep.content.monthlyStreams} streams per month</p>
              
              {/* Success Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="text-2xl font-bold text-emerald-300 mb-2 relative z-10">
                    ${currentStep.content.totalRevenue?.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70 relative z-10">Monthly Revenue</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-900/80 via-pink-900/60 to-slate-900/80 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="text-2xl font-bold text-pink-400 mb-2 relative z-10">
                    ${currentStep.content.sisyEarns?.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70 relative z-10">Sisy Earns (60%)</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-900/80 via-cyan-900/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="text-2xl font-bold text-cyan-400 mb-2 relative z-10">
                    ${currentStep.content.partnersEarn?.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/70 relative z-10">Partners Earn (40%)</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Call to Action */}
          {activeStep === 5 && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-full"></div>
                <span className="text-3xl relative z-10">🎴</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{currentStep.title}</h3>
              <p className="text-xl text-cyan-200/90 mb-8 drop-shadow-md">{currentStep.description}</p>
              
              {/* Pokemon Card Style CTA */}
              <div className="max-w-md mx-auto">
                <button className="group relative w-full px-8 py-6 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 backdrop-blur-xl border-2 border-blue-400/40 hover:border-blue-300/60 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Holographic shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  
                  {/* Corner accents like Pokemon cards */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400/60"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-cyan-400/60"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-cyan-400/60"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400/60"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl group-hover:animate-bounce">✨</span>
                    <div className="text-center">
                      <div className="font-bold">Collect Your Song Card Today</div>
                      <div className="text-sm text-cyan-300/90 font-medium">Earn Royalties Tomorrow</div>
                    </div>
                    <span className="text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>🎴</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}