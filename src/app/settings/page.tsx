"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

type ThemeMode = 'light' | 'medium' | 'dark'

interface ThemeConfig {
  mode: ThemeMode
  name: string
  description: string
  preview: {
    background: string
    cardBg: string
    textPrimary: string
    textSecondary: string
    accent: string
  }
}

const themeConfigs: Record<ThemeMode, ThemeConfig> = {
  light: {
    mode: 'light',
    name: '🌅 Light Paradise',
    description: 'Bright and airy tropical vibes',
    preview: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      cardBg: '#ffffff',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      accent: '#f59e0b'
    }
  },
  medium: {
    mode: 'medium',
    name: '🌇 Medium Paradise',  
    description: 'Balanced sunset atmosphere',
    preview: {
      background: 'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
      cardBg: '#374151',
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      accent: '#fbbf24'
    }
  },
  dark: {
    mode: 'dark',
    name: '🌙 Dark Paradise',
    description: 'Deep ocean night vibes',
    preview: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      cardBg: '#1e293b',
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      accent: '#06b6d4'
    }
  }
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark')
  const [previewTheme, setPreviewTheme] = useState<ThemeMode | null>(null)

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('royalwavs-theme-mode') as ThemeMode
    if (savedTheme && themeConfigs[savedTheme]) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-medium', 'theme-dark')
    
    // Add the new theme class
    root.classList.add(`theme-${theme}`)
    
    // Apply CSS variables for the theme
    const config = themeConfigs[theme]
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f8fafc')
      root.style.setProperty('--bg-secondary', '#ffffff')
      root.style.setProperty('--bg-card', '#ffffff')
      root.style.setProperty('--text-primary', '#1e293b')
      root.style.setProperty('--text-secondary', '#64748b')
      root.style.setProperty('--border-color', '#e2e8f0')
      root.style.setProperty('--accent-primary', '#f59e0b')
      root.style.setProperty('--accent-secondary', '#06b6d4')
    } else if (theme === 'medium') {
      root.style.setProperty('--bg-primary', '#374151')
      root.style.setProperty('--bg-secondary', '#4b5563')
      root.style.setProperty('--bg-card', '#374151')
      root.style.setProperty('--text-primary', '#f3f4f6')
      root.style.setProperty('--text-secondary', '#9ca3af')
      root.style.setProperty('--border-color', '#6b7280')
      root.style.setProperty('--accent-primary', '#fbbf24')
      root.style.setProperty('--accent-secondary', '#10b981')
    } else { // dark
      root.style.setProperty('--bg-primary', '#0f172a')
      root.style.setProperty('--bg-secondary', '#1e293b')
      root.style.setProperty('--bg-card', '#1e293b')
      root.style.setProperty('--text-primary', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#cbd5e1')
      root.style.setProperty('--border-color', '#475569')
      root.style.setProperty('--accent-primary', '#06b6d4')
      root.style.setProperty('--accent-secondary', '#f59e0b')
    }
  }

  const handleThemeChange = (theme: ThemeMode) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('royalwavs-theme-mode', theme)
  }

  const previewThemeMode = (theme: ThemeMode) => {
    setPreviewTheme(theme)
    applyTheme(theme)
  }

  const cancelPreview = () => {
    setPreviewTheme(null)
    applyTheme(currentTheme)
  }

  const confirmPreview = () => {
    if (previewTheme) {
      handleThemeChange(previewTheme)
      setPreviewTheme(null)
    }
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

  const activeConfig = previewTheme ? themeConfigs[previewTheme] : themeConfigs[currentTheme]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Paradise Settings
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Choose your perfect paradise atmosphere with light, medium, or dark mode
          </p>
        </div>

        {/* Theme Mode Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            <span className="text-2xl mr-3">🌈</span>
            Choose Your Paradise Vibe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(themeConfigs).map((config) => (
              <div
                key={config.mode}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                  currentTheme === config.mode
                    ? 'ring-4 ring-amber-400/60 shadow-2xl shadow-amber-500/30'
                    : previewTheme === config.mode
                    ? 'ring-4 ring-cyan-400/60 shadow-2xl shadow-cyan-500/30'
                    : 'hover:ring-2 hover:ring-white/30'
                }`}
                style={{ background: config.preview.background }}
                onClick={() => previewThemeMode(config.mode)}
              >
                {/* Theme Preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1" style={{ color: config.preview.textPrimary }}>
                      {config.name}
                    </h3>
                    <p className="text-sm" style={{ color: config.preview.textSecondary }}>
                      {config.description}
                    </p>
                  </div>

                  {/* Mock Card */}
                  <div 
                    className="p-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: config.preview.cardBg }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: config.preview.accent }}
                      >
                        🎵
                      </div>
                      <div className="text-sm font-medium" style={{ color: config.preview.textPrimary }}>
                        Sample Song
                      </div>
                    </div>
                    <div className="text-lg font-bold mb-1" style={{ color: config.preview.accent }}>
                      $2,500
                    </div>
                    <div className="text-xs" style={{ color: config.preview.textSecondary }}>
                      Available to invest
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    {currentTheme === config.mode && (
                      <div className="inline-flex items-center px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-medium">
                        ✓ Currently Active
                      </div>
                    )}
                    {previewTheme === config.mode && previewTheme !== currentTheme && (
                      <div className="inline-flex items-center px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-medium">
                        👁️ Previewing
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Controls */}
        {previewTheme && previewTheme !== currentTheme && (
          <div className="mb-8 p-6 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/40 rounded-2xl">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2">
                👁️ Previewing {themeConfigs[previewTheme].name}
              </h3>
              <p className="text-cyan-300 text-sm">
                This preview is applied to the entire website. Like what you see?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={confirmPreview}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
              >
                ✅ Apply This Theme
              </button>
              
              <button
                onClick={cancelPreview}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-slate-500/30 transition-all duration-300 hover:scale-105"
              >
                ❌ Cancel Preview
              </button>
            </div>
          </div>
        )}

        {/* Current Theme Info */}
        <div className="mb-8 bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🌟</span>
            Your Current Paradise
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-emerald-300 mb-1">
                {themeConfigs[currentTheme].name}
              </h3>
              <p className="text-white/70">
                {themeConfigs[currentTheme].description}
              </p>
              <p className="text-sm text-white/50 mt-2">
                Applied across all RoyalWavs pages
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl mb-2">
                {currentTheme === 'light' && '🌅'}
                {currentTheme === 'medium' && '🌇'}  
                {currentTheme === 'dark' && '🌙'}
              </div>
              <div className="text-xs text-emerald-300 font-medium">
                Active Theme
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-slate-900/80 via-cyan-900/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="text-2xl mr-3">👤</span>
            Profile Settings
          </h2>
          
          <div className="flex items-center space-x-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-16 h-16 rounded-full ring-4 ring-cyan-400/50"
              />
            )}
            <div>
              <div className="text-xl font-bold text-white">
                {session.user?.name}
              </div>
              <div className="text-cyan-300">
                {session.user?.email}
              </div>
              <div className="text-xs text-white/60 mt-1">
                Paradise Member since {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}