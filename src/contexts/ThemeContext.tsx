"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type ThemeMode = 'light' | 'medium' | 'dark'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark')

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('royalwavs-theme') as ThemeMode
    if (savedTheme && ['light', 'medium', 'dark'].includes(savedTheme)) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('dark') // default
    }
  }, [])

  const applyTheme = (newTheme: ThemeMode) => {
    const html = document.documentElement
    
    // Remove all theme classes
    html.classList.remove('theme-light', 'theme-medium', 'theme-dark')
    
    // Add new theme class
    html.classList.add(`theme-${newTheme}`)
  }

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('royalwavs-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}