"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null)
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: "#F59E0B", // amber-500
    secondary: "#06B6D4", // cyan-500
    accent: "#EC4899", // pink-500
    background: "#0F172A" // slate-900
  })
  const [previewMode, setPreviewMode] = useState(false)

  // Load saved theme colors from localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem('royalwavs-theme')
    if (savedColors) {
      setThemeColors(JSON.parse(savedColors))
    }
  }, [])

  // Apply theme colors to CSS variables
  useEffect(() => {
    if (previewMode) {
      const root = document.documentElement
      root.style.setProperty('--color-primary', themeColors.primary)
      root.style.setProperty('--color-secondary', themeColors.secondary)
      root.style.setProperty('--color-accent', themeColors.accent)
      root.style.setProperty('--color-background', themeColors.background)
    }
  }, [themeColors, previewMode])

  const handleColorChange = (colorType: keyof ThemeColors, color: string) => {
    setThemeColors(prev => ({
      ...prev,
      [colorType]: color
    }))
  }

  const saveTheme = () => {
    localStorage.setItem('royalwavs-theme', JSON.stringify(themeColors))
    // Apply the theme permanently
    const root = document.documentElement
    root.style.setProperty('--color-primary', themeColors.primary)
    root.style.setProperty('--color-secondary', themeColors.secondary)
    root.style.setProperty('--color-accent', themeColors.accent)
    root.style.setProperty('--color-background', themeColors.background)
    
    alert('Theme saved! Your custom colors will persist across sessions.')
  }

  const resetToDefault = () => {
    const defaultColors = {
      primary: "#F59E0B",
      secondary: "#06B6D4", 
      accent: "#EC4899",
      background: "#0F172A"
    }
    setThemeColors(defaultColors)
    localStorage.removeItem('royalwavs-theme')
    
    // Reset CSS variables
    const root = document.documentElement
    root.style.removeProperty('--color-primary')
    root.style.removeProperty('--color-secondary')
    root.style.removeProperty('--color-accent')
    root.style.removeProperty('--color-background')
  }

  const colorPresets = [
    { name: "Ocean Waves", primary: "#0EA5E9", secondary: "#06B6D4", accent: "#8B5CF6", background: "#0F172A" },
    { name: "Sunset Vibes", primary: "#F59E0B", secondary: "#EF4444", accent: "#EC4899", background: "#1E1B4B" },
    { name: "Forest Dreams", primary: "#10B981", secondary: "#059669", accent: "#F59E0B", background: "#064E3B" },
    { name: "Purple Haze", primary: "#8B5CF6", secondary: "#A855F7", accent: "#EC4899", background: "#1E1B4B" },
    { name: "Coral Reef", primary: "#FF6B6B", secondary: "#4ECDC4", accent: "#45B7D1", background: "#2C3E50" }
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
              Paradise Settings
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Customize your RoyalWavs experience with your own theme colors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Theme Customization */}
          <div className="bg-gradient-to-br from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-2xl mr-3">🎨</span>
              Theme Colors
            </h2>

            {/* Color Controls */}
            <div className="space-y-6">
              {Object.entries(themeColors).map(([colorType, color]) => (
                <div key={colorType}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium capitalize">
                      {colorType === 'primary' && '🌟 Primary'}
                      {colorType === 'secondary' && '🌊 Secondary'} 
                      {colorType === 'accent' && '💎 Accent'}
                      {colorType === 'background' && '🌙 Background'}
                    </label>
                    <div 
                      className="w-12 h-12 rounded-xl border-2 border-white/20 cursor-pointer shadow-lg"
                      style={{ backgroundColor: color }}
                      onClick={() => setActiveColorPicker(activeColorPicker === colorType ? null : colorType)}
                    />
                  </div>
                  
                  {activeColorPicker === colorType && (
                    <div className="mb-4">
                      <HexColorPicker 
                        color={color} 
                        onChange={(newColor) => handleColorChange(colorType as keyof ThemeColors, newColor)}
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(colorType as keyof ThemeColors, e.target.value)}
                        className="mt-3 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preset Themes */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
              <div className="grid grid-cols-1 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setThemeColors({
                      primary: preset.primary,
                      secondary: preset.secondary,
                      accent: preset.accent,
                      background: preset.background
                    })}
                    className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                  >
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-white group-hover:text-amber-300 transition-colors">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  previewMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                }`}
              >
                {previewMode ? '✅ Previewing' : '👁️ Preview Theme'}
              </button>
              
              <button
                onClick={saveTheme}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
              >
                💾 Save Theme
              </button>
              
              <button
                onClick={resetToDefault}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-slate-500/30 transition-all duration-300 hover:scale-105"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Theme Preview */}
          <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-2xl mr-3">👁️</span>
              Live Preview
            </h2>

            {/* Preview Components */}
            <div className="space-y-6">
              {/* Mock Navigation */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: `${themeColors.background}20` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      🌊
                    </div>
                    <span className="font-bold text-white">RoyalWavs</span>
                  </div>
                  <div 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: themeColors.accent }}
                  >
                    Your Theme
                  </div>
                </div>
              </div>

              {/* Mock Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                    borderColor: `${themeColors.primary}30`
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                    $5,000
                  </div>
                  <div className="text-white/70 text-sm">Primary Color</div>
                </div>
                
                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: `${themeColors.secondary}10`,
                    borderColor: `${themeColors.secondary}30`
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: themeColors.secondary }}>
                    🎵
                  </div>
                  <div className="text-white/70 text-sm">Secondary</div>
                </div>
              </div>

              {/* Mock Button */}
              <button 
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})`
                }}
              >
                Sample Button with Your Colors
              </button>

              {/* Color Values */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/60">Primary:</span>
                  <span className="text-white">{themeColors.primary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Secondary:</span>
                  <span className="text-white">{themeColors.secondary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Accent:</span>
                  <span className="text-white">{themeColors.accent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Background:</span>
                  <span className="text-white">{themeColors.background}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-8 bg-gradient-to-br from-slate-900/80 via-cyan-900/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
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