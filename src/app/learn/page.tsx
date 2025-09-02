"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

const portfolioScenarios = [
  {
    investment: 500,
    songs: 3,
    avgRevenue: 400,
    monthlyReturn: 20,
    yearlyReturn: 240,
    roi: 48
  },
  {
    investment: 1500,
    songs: 6,
    avgRevenue: 600,
    monthlyReturn: 75,
    yearlyReturn: 900,
    roi: 60
  },
  {
    investment: 5000,
    songs: 10,
    avgRevenue: 850,
    monthlyReturn: 285,
    yearlyReturn: 3420,
    roi: 68.4
  }
]

const investmentStrategies = [
  {
    title: "🎯 Diversified Discovery",
    description: "Spread investments across different genres and artists",
    tips: ["Mix established and emerging artists", "Various music styles", "Different revenue streams"],
    riskLevel: "Medium",
    potential: "Steady Growth"
  },
  {
    title: "🚀 High-Potential Focus", 
    description: "Concentrate on artists showing strong early momentum",
    tips: ["Target viral potential", "Social media growth", "Industry connections"],
    riskLevel: "Higher",
    potential: "High Returns"
  },
  {
    title: "💎 Value Investment",
    description: "Find undervalued artists with strong fundamentals",
    tips: ["Quality over popularity", "Long-term vision", "Consistent output"],
    riskLevel: "Lower",
    potential: "Compound Growth"
  }
]

export default function LearnPage() {
  const { data: session } = useSession()
  const [selectedScenario, setSelectedScenario] = useState(1)
  const [activeStrategy, setActiveStrategy] = useState(0)

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent text-shimmer">
              How to Earn
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto font-light">
            Master the art of music investing — Build your artist portfolio like a pro
          </p>
          <p className="text-base sm:text-lg text-cyan-200/80 max-w-3xl mx-auto">
            From bedroom producers to chart-toppers, learn how to spot winners and maximize your returns
          </p>
        </div>

        {/* Portfolio Calculator */}
        <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            🧮 Portfolio Calculator
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {portfolioScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setSelectedScenario(index)}
                className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedScenario === index 
                    ? 'border-amber-400 bg-amber-400/10' 
                    : 'border-white/20 bg-white/5 hover:border-amber-400/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">
                    ${scenario.investment.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm mb-3">Initial Investment</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-white/60">Songs:</span>
                      <span className="text-white">{scenario.songs}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-white/60">Monthly:</span>
                      <span className="text-green-400">${scenario.monthlyReturn}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-white/60">Yearly ROI:</span>
                      <span className="text-purple-400">{scenario.roi}%</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Scenario Details */}
          <div className="bg-black/20 rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Your ${portfolioScenarios[selectedScenario].investment.toLocaleString()} Portfolio Breakdown
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-xl">
                <div className="text-lg sm:text-xl font-bold text-amber-400">
                  {portfolioScenarios[selectedScenario].songs}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">Songs</div>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl">
                <div className="text-lg sm:text-xl font-bold text-green-400">
                  ${portfolioScenarios[selectedScenario].monthlyReturn}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">Monthly</div>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl">
                <div className="text-lg sm:text-xl font-bold text-purple-400">
                  ${portfolioScenarios[selectedScenario].yearlyReturn}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">Yearly</div>
              </div>
              
              <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-xl">
                <div className="text-lg sm:text-xl font-bold text-cyan-400">
                  {portfolioScenarios[selectedScenario].roi}%
                </div>
                <div className="text-white/60 text-xs sm:text-sm">ROI</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-400/20">
              <p className="text-amber-200 text-sm sm:text-base text-center">
                💡 Based on average monthly revenue of ${portfolioScenarios[selectedScenario].avgRevenue} per song across your portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Investment Strategies */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            🎯 Investment Strategies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {investmentStrategies.map((strategy, index) => (
              <div
                key={index}
                className={`group cursor-pointer p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 ${
                  activeStrategy === index
                    ? 'border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-2xl shadow-amber-500/20'
                    : 'border-white/20 bg-gradient-to-br from-slate-900/80 to-purple-900/60 hover:border-amber-400/50 hover:shadow-xl'
                }`}
                onClick={() => setActiveStrategy(index)}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                  {strategy.title}
                </h3>
                <p className="text-white/80 mb-6 text-sm sm:text-base">
                  {strategy.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {strategy.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center text-white/70 text-sm">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 flex-shrink-0"></div>
                      {tip}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-xs text-white/50">Risk Level</div>
                    <div className="text-sm font-medium text-white">{strategy.riskLevel}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/50">Potential</div>
                    <div className="text-sm font-medium text-amber-400">{strategy.potential}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 sm:p-8 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            🚀 Getting Started Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "1", title: "Research Artists", desc: "Browse emerging talent with growth potential", icon: "🔍" },
              { step: "2", title: "Start Small", desc: "Begin with $100-500 across 2-3 songs", icon: "💰" },
              { step: "3", title: "Diversify", desc: "Spread risk across genres and artists", icon: "🎵" },
              { step: "4", title: "Track & Grow", desc: "Monitor performance and reinvest", icon: "📈" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 sm:p-6 bg-black/20 rounded-2xl border border-white/10">
                <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
                <div className="text-lg sm:text-xl font-bold text-white mb-2">
                  Step {item.step}
                </div>
                <div className="text-base sm:text-lg font-medium text-purple-300 mb-3">
                  {item.title}
                </div>
                <div className="text-sm text-white/70">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Ready to Build Your Music Empire?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/browse"
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative flex items-center space-x-3">
                <span className="text-2xl group-hover:animate-bounce">🎯</span>
                <span>Start Browsing Songs</span>
                <span className="text-2xl group-hover:animate-bounce" style={{ animationDelay: '0.2s' }}>💎</span>
              </div>
            </Link>
            
            {session && (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 hover:from-purple-600/40 hover:via-blue-600/40 hover:to-purple-600/40 backdrop-blur-xl border-2 border-purple-400/40 hover:border-purple-300/60 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-3 cursor-pointer"
              >
                <span className="text-2xl">📊</span>
                <span>View My Portfolio</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}