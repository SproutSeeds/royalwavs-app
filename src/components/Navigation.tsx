"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export function Navigation() {
  const { data: session, status } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-gradient-to-r from-black/30 via-teal-900/20 to-black/30 backdrop-blur-xl border-b border-amber-500/20 relative z-50">
      <div className="w-full px-6 sm:px-8">
        <div className="flex items-center h-16 sm:h-20">
          
          {/* Left Side - Always Logo on Desktop / Mobile Hamburger */}
          <div className="flex items-center w-64 justify-start">
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </div>
              </button>
            </div>
            
            {/* Desktop Logo - Locked to Left */}
            <div className="hidden md:block">
              <Link href="/" className="flex items-center group">
                <span className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent tracking-tight hover:drop-shadow-lg transition-all duration-500 hover:scale-105">
                  RoyalWavs
                </span>
              </Link>
            </div>
            
            {/* Mobile Logo - Centered on small screens */}
            <div className="md:hidden flex-1 flex justify-center">
              <Link href="/" className="flex items-center group">
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent tracking-tight hover:drop-shadow-lg transition-all duration-500 hover:scale-105">
                  RoyalWavs
                </span>
              </Link>
            </div>
          </div>

          {/* Center - Navigation Links on Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8 lg:space-x-12">
              <Link href="/" className="text-white/90 hover:text-amber-300 transition-all duration-300 font-medium tracking-wide hover:scale-105 text-lg lg:text-xl">
                Discover
              </Link>
              {session && (
                <>
                  <Link href="/dashboard" className="text-white/90 hover:text-cyan-300 transition-all duration-300 font-medium tracking-wide hover:scale-105 text-lg lg:text-xl">
                    Portfolio
                  </Link>
                  <Link href="/upload" className="text-white/90 hover:text-emerald-300 transition-all duration-300 font-medium tracking-wide hover:scale-105 text-lg lg:text-xl">
                    Create
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Profile locked to right */}
          <div className="w-64 flex justify-end">
            {status === "loading" ? (
              <div className="w-24 h-10 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 rounded-xl animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                  {/* User Button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="group flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500/20 via-amber-400/20 to-orange-500/20 hover:from-pink-500/30 hover:via-amber-400/30 hover:to-orange-500/30 rounded-xl sm:rounded-2xl backdrop-blur-xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
                  >
                  {/* Profile Image */}
                  {session.user?.image && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-amber-400/50 group-hover:ring-amber-400/80 transition-all duration-300">
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* User Name - Hidden on very small screens */}
                  <div className="text-left hidden xs:block">
                    <div className="text-white font-bold text-sm sm:text-lg tracking-wide">
                      {session.user?.name?.split(' ')[0] || 'Paradise'}
                    </div>
                    <div className="text-amber-300 text-xs font-medium opacity-80 hidden sm:block">
                      Island Vibes ✨
                    </div>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 backdrop-blur-xl rounded-2xl shadow-2xl border py-1 z-[9999] animate-[fadeIn_0.2s_ease-out] overflow-hidden" style={{background: 'var(--bg-card)', borderColor: 'var(--border-primary)'}}>
                    
                    {/* User Info Header */}
                    <div className="px-6 py-4 border-b" style={{background: 'var(--bg-secondary)', borderColor: 'var(--border-secondary)'}}>
                      <div className="flex items-center space-x-4">
                        {session.user?.image && (
                          <div className="w-14 h-14 rounded-full overflow-hidden ring-3 ring-pink-400/40 shadow-lg">
                            <img 
                              src={session.user.image} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-lg" style={{color: 'var(--text-primary)'}}>
                            {session.user?.name || 'Music Partner'}
                          </div>
                          <div className="text-sm truncate max-w-[160px]" style={{color: 'var(--text-secondary)'}}>
                            {session.user?.email}
                          </div>
                          <div className="text-xs font-medium mt-1" style={{color: 'var(--text-accent)'}}>
                            ✨ Paradise Member
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* My Songs / Portfolio */}
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full group flex items-center space-x-4 px-6 py-4 hover:scale-[1.02] transform cursor-pointer transition-all duration-300"
                        style={{color: 'var(--text-primary)'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-pink-600">🎵</div>
                        </div>
                        <div>
                          <div className="font-semibold" style={{color: 'var(--text-primary)'}}>My Partnerships</div>
                          <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Songs & investments</div>
                        </div>
                        <div className="ml-auto text-pink-400 group-hover:translate-x-1 transition-all duration-300">→</div>
                      </Link>

                      {/* Settings */}
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full group flex items-center space-x-4 px-6 py-4 hover:scale-[1.02] transform cursor-pointer transition-all duration-300"
                        style={{color: 'var(--text-primary)'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-amber-600">⚙️</div>
                        </div>
                        <div>
                          <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Settings</div>
                          <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Account preferences</div>
                        </div>
                        <div className="ml-auto text-amber-400 group-hover:translate-x-1 transition-all duration-300">→</div>
                      </Link>

                      {/* Divider */}
                      <div className="mx-4 my-3 border-t" style={{borderColor: 'var(--border-secondary)'}}></div>

                      {/* Sign Out */}
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("LEAVE PARADISE CLICKED!")
                          setDropdownOpen(false)
                          setTimeout(() => {
                            signOut({ callbackUrl: '/' })
                          }, 100)
                        }}
                        className="group flex items-center space-x-4 px-6 py-4 hover:scale-[1.02] transform w-full text-left cursor-pointer transition-all duration-300"
                        style={{color: 'var(--text-primary)'}}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-red-600">🏝️</div>
                        </div>
                        <div>
                          <div className="font-semibold" style={{color: 'var(--text-primary)'}}>Leave Paradise</div>
                          <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Sign out safely</div>
                        </div>
                        <div className="ml-auto text-red-400 group-hover:translate-x-1 transition-all duration-300">↗</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="group flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 via-amber-400 to-orange-500 hover:from-pink-600 hover:via-amber-500 hover:to-orange-600 text-white rounded-lg sm:rounded-2xl transition-all duration-300 font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 border border-amber-400/50 relative overflow-hidden"
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                
                {/* Palm Tree Icon */}
                <div className="text-base sm:text-xl group-hover:animate-bounce">🌴</div>
                
                {/* Text */}
                <span className="relative z-10 hidden sm:inline">Enter Paradise</span>
                <span className="relative z-10 inline sm:hidden">Sign In</span>
                
                {/* Sparkle - Hidden on very small screens */}
                <div className="text-base sm:text-xl group-hover:animate-pulse hidden xs:block">✨</div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-black/40 via-teal-900/30 to-black/40 backdrop-blur-xl border-b border-amber-500/20">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
            >
              🏝️ Discover
            </Link>
            {session && (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-white/90 hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
                >
                  🎵 Portfolio
                </Link>
                <Link 
                  href="/upload" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-white/90 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
                >
                  🎤 Create
                </Link>
              </>
            )}
            {!session && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signIn()
                }}
                className="w-full text-left py-3 px-4 text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
              >
                🌴 Enter Paradise
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}