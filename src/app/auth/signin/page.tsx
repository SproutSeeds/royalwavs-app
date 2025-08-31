"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const getAuthProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    getAuthProviders()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-pink-50 to-amber-50">
      {/* Animated Dripping Paint Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Paint Drips */}
        <div className="absolute top-0 left-1/4 w-2 bg-gradient-to-b from-pink-400 to-transparent h-32 animate-drip opacity-70 rounded-full"></div>
        <div className="absolute top-0 left-1/2 w-3 bg-gradient-to-b from-amber-400 to-transparent h-48 animate-drip-slow opacity-60 rounded-full" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-0 right-1/3 w-1.5 bg-gradient-to-b from-rose-300 to-transparent h-40 animate-drip opacity-80 rounded-full" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 right-1/4 w-2.5 bg-gradient-to-b from-orange-400 to-transparent h-36 animate-drip-slow opacity-50 rounded-full" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-0 left-3/4 w-1 bg-gradient-to-b from-pink-500 to-transparent h-28 animate-drip opacity-70 rounded-full" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating Paint Drops */}
        <div className="absolute top-20 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-float-slow opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-24 left-2/3 w-2.5 h-2.5 bg-rose-300 rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-pink-500/30">
                <span className="text-white font-black text-2xl">🌊</span>
              </div>
              <span className="text-5xl font-black bg-gradient-to-r from-pink-500 via-amber-400 to-orange-500 bg-clip-text text-transparent tracking-tight">
                RoyalWavs
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Paradise
            </h1>
            <p className="text-lg text-gray-600">
              Sign in to invest in the future of music
            </p>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
            {/* Card Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-white/50 to-amber-100/50 animate-pulse opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Choose Your Gateway
              </h2>

              {providers && Object.values(providers).map((provider: any) => (
                <div key={provider.name} className="mb-4">
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-pink-300 rounded-2xl px-8 py-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/20"
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center justify-center space-x-4">
                      {provider.id === 'google' && (
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      <span className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                        Continue with {provider.name}
                      </span>
                      <div className="w-6 h-6 border-2 border-pink-400 rounded-full border-t-transparent animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </button>
                </div>
              ))}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  By signing in, you agree to experience the luxury of music investment
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Secure • Beautiful • Exclusive</span>
              <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS in globals.css will handle the drip animations */}
    </div>
  )
}