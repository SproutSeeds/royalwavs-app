"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export function Navigation() {
  const { data: session, status } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
    <nav className="bg-gradient-to-r from-black/30 via-teal-900/20 to-black/30 backdrop-blur-xl border-b border-amber-500/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-slate-900 font-black text-lg">🌊</span>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent tracking-tight">
              RoyalWavs
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-white/90 hover:text-amber-300 transition-all duration-300 font-medium tracking-wide hover:scale-105">
              Discover
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-white/90 hover:text-cyan-300 transition-all duration-300 font-medium tracking-wide hover:scale-105">
                  Portfolio
                </Link>
                <Link href="/upload" className="text-white/90 hover:text-emerald-300 transition-all duration-300 font-medium tracking-wide hover:scale-105">
                  Create
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div>
            {status === "loading" ? (
              <div className="w-24 h-10 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 rounded-xl animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                  {/* User Button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-pink-500/20 via-amber-400/20 to-orange-500/20 hover:from-pink-500/30 hover:via-amber-400/30 hover:to-orange-500/30 rounded-2xl backdrop-blur-xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
                  >
                  {/* Profile Image */}
                  {session.user?.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-400/50 group-hover:ring-amber-400/80 transition-all duration-300">
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* User Name */}
                  <div className="text-left">
                    <div className="text-white font-bold text-lg tracking-wide">
                      {session.user?.name?.split(' ')[0] || 'Paradise'}
                    </div>
                    <div className="text-amber-300 text-xs font-medium opacity-80">
                      Island Vibes ✨
                    </div>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 py-1 z-[999] animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                    
                    {/* User Info Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-pink-50/80 to-amber-50/80 border-b border-amber-200/30">
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
                          <div className="font-bold text-gray-800 text-lg">
                            {session.user?.name || 'Music Partner'}
                          </div>
                          <div className="text-sm text-gray-600 truncate max-w-[160px]">
                            {session.user?.email}
                          </div>
                          <div className="text-xs text-pink-600 font-medium mt-1">
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
                        className="block w-full group flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-amber-100 transition-all duration-300 hover:scale-[1.02] transform cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-pink-600">🎵</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">My Partnerships</div>
                          <div className="text-xs text-gray-500">Songs & investments</div>
                        </div>
                        <div className="ml-auto text-pink-400 group-hover:translate-x-1 transition-all duration-300">→</div>
                      </Link>

                      {/* Settings */}
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full group flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-amber-100 transition-all duration-300 hover:scale-[1.02] transform cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-amber-600">⚙️</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Settings</div>
                          <div className="text-xs text-gray-500">Account preferences</div>
                        </div>
                        <div className="ml-auto text-amber-400 group-hover:translate-x-1 transition-all duration-300">→</div>
                      </Link>

                      {/* Divider */}
                      <div className="mx-4 my-3 border-t border-gray-200/60"></div>

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
                        className="group flex items-center space-x-4 px-6 py-4 text-gray-700 hover:bg-amber-100/80 transition-all duration-300 hover:scale-[1.02] transform w-full text-left cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center transition-all duration-300">
                          <div className="text-lg text-red-600">🏝️</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Leave Paradise</div>
                          <div className="text-xs text-gray-500">Sign out safely</div>
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
                className="group flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gradient-to-r from-pink-500 via-amber-400 to-orange-500 hover:from-pink-600 hover:via-amber-500 hover:to-orange-600 text-white rounded-xl sm:rounded-2xl transition-all duration-300 font-bold text-sm sm:text-base md:text-lg tracking-wide shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 border border-amber-400/50 relative overflow-hidden"
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                
                {/* Palm Tree Icon */}
                <div className="text-lg sm:text-xl md:text-2xl group-hover:animate-bounce">🌴</div>
                
                {/* Text */}
                <span className="relative z-10 hidden sm:inline">Enter Paradise</span>
                <span className="relative z-10 inline sm:hidden">Sign In</span>
                
                {/* Sparkle */}
                <div className="text-lg sm:text-xl group-hover:animate-pulse">✨</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}