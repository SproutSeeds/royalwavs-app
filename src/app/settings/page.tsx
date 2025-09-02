"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

type ThemeMode = 'light' | 'medium' | 'dark'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark')

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('royalwavs-theme') as ThemeMode
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: ThemeMode) => {
    const body = document.body
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-medium', 'theme-dark')
    
    // Add the new theme class
    body.classList.add(`theme-${theme}`)
    
    // Simple approach: just change body background and some basic colors
    if (theme === 'light') {
      body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    } else if (theme === 'medium') {
      body.style.background = 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
    } else { // dark
      body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
    }
  }

  const handleThemeChange = (theme: ThemeMode) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('royalwavs-theme', theme)
  }

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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-lg text-white/70">
            Choose your paradise theme
          </p>
        </div>

        {/* Theme Selection - Simple Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Theme</h2>
          
          <div className="space-y-4">
            {/* Light Theme */}
            <button
              onClick={() => handleThemeChange('light')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                currentTheme === 'light'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🌅</div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">Light Paradise</div>
                  <div className="text-sm text-white/70">Bright and clean</div>
                </div>
                {currentTheme === 'light' && (
                  <div className="ml-auto text-amber-400">✓</div>
                )}
              </div>
            </button>

            {/* Medium Theme */}
            <button
              onClick={() => handleThemeChange('medium')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                currentTheme === 'medium'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🌇</div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">Medium Paradise</div>
                  <div className="text-sm text-white/70">Balanced vibes</div>
                </div>
                {currentTheme === 'medium' && (
                  <div className="ml-auto text-amber-400">✓</div>
                )}
              </div>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                currentTheme === 'dark'
                  ? 'border-amber-400 bg-white/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🌙</div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">Dark Paradise</div>
                  <div className="text-sm text-white/70">Deep and mysterious</div>
                </div>
                {currentTheme === 'dark' && (
                  <div className="ml-auto text-amber-400">✓</div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
          
          <div className="flex items-center space-x-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="font-bold text-white">
                {session.user?.name}
              </div>
              <div className="text-white/70 text-sm">
                {session.user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}