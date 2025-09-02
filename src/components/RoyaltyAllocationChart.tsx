"use client"

import { useState, useEffect } from "react"

interface RoyaltyAllocationChartProps {
  onAllocationChange?: (artistPercentage: number, publicPercentage: number) => void
}

export function RoyaltyAllocationChart({ onAllocationChange }: RoyaltyAllocationChartProps) {
  const [artistPercentage, setArtistPercentage] = useState(60)
  const [isDragging, setIsDragging] = useState(false)

  const publicPercentage = 100 - artistPercentage

  useEffect(() => {
    onAllocationChange?.(artistPercentage, publicPercentage)
  }, [artistPercentage, publicPercentage, onAllocationChange])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistPercentage(parseInt(e.target.value))
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  // Calculate angles for the pie chart
  const artistAngle = (artistPercentage / 100) * 360
  const publicAngle = (publicPercentage / 100) * 360

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400/60 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
          <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
            Set Royalty Split
          </span>
        </h3>

        {/* Interactive Pie Chart */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative">
            {/* Mobile SVG (240px) */}
            <svg 
              width="240" 
              height="240" 
              className={`sm:hidden transition-transform duration-500 ${isDragging ? 'scale-105' : 'scale-100'}`}
            >
              {/* Background circle */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              
              {/* Artist slice */}
              <path
                d={`M 120 120 L 120 20 A 100 100 0 ${artistAngle > 180 ? 1 : 0} 1 ${
                  120 + 100 * Math.sin((artistAngle * Math.PI) / 180)
                } ${
                  120 - 100 * Math.cos((artistAngle * Math.PI) / 180)
                } Z`}
                fill="url(#artistGradient)"
                className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 10px rgba(251, 191, 36, ${artistPercentage / 200}))`
                }}
              />
              
              {/* Public slice */}
              <path
                d={`M 120 120 L ${
                  120 + 100 * Math.sin((artistAngle * Math.PI) / 180)
                } ${
                  120 - 100 * Math.cos((artistAngle * Math.PI) / 180)
                } A 100 100 0 ${publicAngle > 180 ? 1 : 0} 1 120 20 Z`}
                fill="url(#publicGradient)"
                className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 10px rgba(6, 182, 212, ${publicPercentage / 200}))`
                }}
              />
              
              {/* Center circle */}
              <circle
                cx="120"
                cy="120"
                r="35"
                fill="rgba(15, 23, 42, 0.9)"
                stroke="rgba(251, 191, 36, 0.5)"
                strokeWidth="2"
              />
              
              {/* Center text */}
              <text
                x="120"
                y="115"
                textAnchor="middle"
                className="fill-amber-300 text-xs font-semibold"
              >
                Royalty
              </text>
              <text
                x="120"
                y="130"
                textAnchor="middle"
                className="fill-cyan-300 text-xs font-semibold"
              >
                Split
              </text>

              {/* Gradients */}
              <defs>
                <linearGradient id="artistGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="publicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Desktop SVG (280px) */}
            <svg 
              width="280" 
              height="280" 
              className={`hidden sm:block transition-transform duration-500 ${isDragging ? 'scale-105' : 'scale-100'}`}
            >
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
              
              {/* Artist slice */}
              <path
                d={`M 140 140 L 140 20 A 120 120 0 ${artistAngle > 180 ? 1 : 0} 1 ${
                  140 + 120 * Math.sin((artistAngle * Math.PI) / 180)
                } ${
                  140 - 120 * Math.cos((artistAngle * Math.PI) / 180)
                } Z`}
                fill="url(#artistGradientDesktop)"
                className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 10px rgba(251, 191, 36, ${artistPercentage / 200}))`
                }}
              />
              
              {/* Public slice */}
              <path
                d={`M 140 140 L ${
                  140 + 120 * Math.sin((artistAngle * Math.PI) / 180)
                } ${
                  140 - 120 * Math.cos((artistAngle * Math.PI) / 180)
                } A 120 120 0 ${publicAngle > 180 ? 1 : 0} 1 140 20 Z`}
                fill="url(#publicGradientDesktop)"
                className="transition-all duration-500 hover:opacity-90 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 10px rgba(6, 182, 212, ${publicPercentage / 200}))`
                }}
              />
              
              {/* Center circle */}
              <circle
                cx="140"
                cy="140"
                r="40"
                fill="rgba(15, 23, 42, 0.9)"
                stroke="rgba(251, 191, 36, 0.5)"
                strokeWidth="2"
              />
              
              {/* Center text */}
              <text
                x="140"
                y="135"
                textAnchor="middle"
                className="fill-amber-300 text-xs font-semibold"
              >
                Royalty
              </text>
              <text
                x="140"
                y="150"
                textAnchor="middle"
                className="fill-cyan-300 text-xs font-semibold"
              >
                Split
              </text>

              {/* Gradients */}
              <defs>
                <linearGradient id="artistGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
                <linearGradient id="publicGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating percentage labels */}
            <div className={`absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isDragging ? 'scale-110' : 'scale-100'}`}>
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg">
                <span className="text-amber-300 font-bold text-base sm:text-lg">{artistPercentage}%</span>
                <span className="text-white/70 text-xs sm:text-sm ml-1 sm:ml-2">Artist</span>
              </div>
            </div>

            <div className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isDragging ? 'scale-110' : 'scale-100'}`}>
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg">
                <span className="text-cyan-300 font-bold text-base sm:text-lg">{publicPercentage}%</span>
                <span className="text-white/70 text-xs sm:text-sm ml-1 sm:ml-2">Public</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-white/70 text-sm">Drag to adjust split</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="20"
              max="80"
              value={artistPercentage}
              onChange={handleSliderChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="w-full h-3 bg-gradient-to-r from-cyan-500/30 via-amber-500/30 to-cyan-500/30 rounded-full appearance-none cursor-pointer transition-all duration-300 hover:scale-y-125"
              style={{
                background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${artistPercentage}%, #06B6D4 ${artistPercentage}%, #06B6D4 100%)`
              }}
            />
            
            {/* Slider thumb styling */}
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #F59E0B, #EF4444);
                border: 2px solid rgba(255, 255, 255, 0.8);
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
                transition: all 0.2s ease;
              }
              
              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 6px 20px rgba(251, 191, 36, 0.6);
              }
              
              input[type="range"]::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: linear-gradient(135deg, #F59E0B, #EF4444);
                border: 2px solid rgba(255, 255, 255, 0.8);
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
              }
            `}</style>
          </div>
        </div>

        {/* Split Preview Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Artist Card */}
          <div className={`bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/40 rounded-xl p-3 sm:p-4 transition-all duration-500 ${isDragging ? 'scale-105 shadow-xl shadow-amber-500/30' : 'shadow-lg'}`}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎤</div>
              <div className="text-amber-300 font-bold text-xl sm:text-2xl mb-1">{artistPercentage}%</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">You Keep</div>
              <div className="text-white/60 text-xs mt-1">Artist Royalties</div>
            </div>
          </div>

          {/* Public Card */}
          <div className={`bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-xl p-3 sm:p-4 transition-all duration-500 ${isDragging ? 'scale-105 shadow-xl shadow-cyan-500/30' : 'shadow-lg'}`}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💎</div>
              <div className="text-cyan-300 font-bold text-xl sm:text-2xl mb-1">{publicPercentage}%</div>
              <div className="text-white/80 text-xs sm:text-sm font-medium">For Partners</div>
              <div className="text-white/60 text-xs mt-1">Available to Buy</div>
            </div>
          </div>
        </div>

        {/* Recommended Split Badges */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 mb-8 sm:mb-12">
          {[
            { artist: 70, label: "Conservative" },
            { artist: 60, label: "Balanced" },
            { artist: 50, label: "Aggressive" }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setArtistPercentage(preset.artist)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                artistPercentage === preset.artist
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50 scale-105'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:scale-105'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* X-Factor Projections */}
        <div className="space-y-4 sm:space-y-6">
          <h4 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Potential Outcomes
            </span>
          </h4>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { scenario: "Moderate Success", fans: 100, avgInvestment: 50, monthlyStreaming: 2500 },
              { scenario: "Viral Hit", fans: 500, avgInvestment: 75, monthlyStreaming: 15000 },
              { scenario: "Chart Topper", fans: 1000, avgInvestment: 100, monthlyStreaming: 35000 },
              { scenario: "Superstar Status", fans: 2500, avgInvestment: 150, monthlyStreaming: 75000 }
            ].map((scenario, index) => {
              const totalPartnerInvestment = scenario.fans * scenario.avgInvestment
              const partnerRoyaltyShare = (publicPercentage / 100) * scenario.monthlyStreaming
              const monthlyReturnPerDollar = partnerRoyaltyShare / totalPartnerInvestment
              const individualMonthlyReturn = monthlyReturnPerDollar * scenario.avgInvestment
              const annualReturn = individualMonthlyReturn * 12
              const roiPercentage = ((annualReturn / scenario.avgInvestment) * 100)

              return (
                <div
                  key={scenario.scenario}
                  className={`bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-all duration-500 hover:scale-105 ${
                    index === 0 ? 'border-emerald-400/40 hover:shadow-emerald-500/20' :
                    index === 1 ? 'border-cyan-400/40 hover:shadow-cyan-500/20' :
                    index === 2 ? 'border-amber-400/40 hover:shadow-amber-500/20' :
                    'border-pink-400/40 hover:shadow-pink-500/20'
                  } hover:shadow-xl`}
                >
                  <div className="text-center">
                    <h5 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${
                      index === 0 ? 'text-emerald-300' :
                      index === 1 ? 'text-cyan-300' :
                      index === 2 ? 'text-amber-300' :
                      'text-pink-300'
                    }`}>
                      {scenario.scenario}
                    </h5>
                    
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="text-white/70 text-xs sm:text-sm">
                        {scenario.fans} fans invest ${scenario.avgInvestment} each
                      </div>
                      <div className="text-white/70 text-xs sm:text-sm">
                        ${scenario.monthlyStreaming}/month streaming revenue
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                        <div className="text-lg sm:text-2xl font-bold text-white">
                          ${individualMonthlyReturn.toFixed(2)}
                        </div>
                        <div className="text-white/60 text-xs">Monthly return per fan</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                          <div className="text-sm sm:text-lg font-bold text-emerald-300">
                            ${annualReturn.toFixed(0)}
                          </div>
                          <div className="text-white/60 text-xs">Annual return</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-center">
                          <div className={`text-sm sm:text-lg font-bold ${roiPercentage > 100 ? 'text-emerald-300' : roiPercentage > 50 ? 'text-amber-300' : 'text-cyan-300'}`}>
                            {roiPercentage.toFixed(0)}%
                          </div>
                          <div className="text-white/60 text-xs">ROI</div>
                        </div>
                      </div>

                      <div className="text-white/50 text-xs pt-1 sm:pt-2 border-t border-white/10">
                        Based on {publicPercentage}% fan share
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Impact */}
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 backdrop-blur-sm border border-purple-400/40 rounded-xl p-4 sm:p-6 text-center">
            <h5 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Your Partnership Impact</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-300">{publicPercentage}%</div>
                <div className="text-white/60 text-xs sm:text-sm">Revenue shared with fans</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-pink-300">{artistPercentage}%</div>
                <div className="text-white/60 text-xs sm:text-sm">You keep</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300">∞</div>
                <div className="text-white/60 text-xs sm:text-sm">Partnership potential</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}