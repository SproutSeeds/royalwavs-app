"use client"

import { useSession } from "next-auth/react"
import { useTheme } from "@/contexts/ThemeContext"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()

  if (status === "loading") {
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
        <p className="text-white/60">You need to be signed in to access settings.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent px-2">
            Settings
          </h1>
          <p className="text-base sm:text-lg text-white/70">
            Choose your paradise theme
          </p>
        </div>

        {/* Theme Selection - Simple Cards */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Theme</h2>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Light Theme */}
            <button
              onClick={() => setTheme('light')}
              className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                theme === 'light'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl">🌅</div>
                <div className="text-left flex-1">
                  <div className="text-base sm:text-lg font-bold text-white">Light Paradise</div>
                  <div className="text-xs sm:text-sm text-white/70">Bright and clean</div>
                </div>
                {theme === 'light' && (
                  <div className="text-amber-400 text-lg sm:text-xl">✓</div>
                )}
              </div>
            </button>

            {/* Medium Theme */}
            <button
              onClick={() => setTheme('medium')}
              className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                theme === 'medium'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl">🌇</div>
                <div className="text-left flex-1">
                  <div className="text-base sm:text-lg font-bold text-white">Medium Paradise</div>
                  <div className="text-xs sm:text-sm text-white/70">Balanced vibes</div>
                </div>
                {theme === 'medium' && (
                  <div className="text-amber-400 text-lg sm:text-xl">✓</div>
                )}
              </div>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => setTheme('dark')}
              className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl">🌙</div>
                <div className="text-left flex-1">
                  <div className="text-base sm:text-lg font-bold text-white">Dark Paradise</div>
                  <div className="text-xs sm:text-sm text-white/70">Deep and mysterious</div>
                </div>
                {theme === 'dark' && (
                  <div className="text-amber-400 text-lg sm:text-xl">✓</div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}