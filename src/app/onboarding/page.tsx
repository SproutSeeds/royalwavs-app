"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user?.name || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      // Update user name in database
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() })
      })

      if (response.ok) {
        // Update the session
        await update({ name: name.trim() })
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-pink-50 to-amber-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-2 bg-gradient-to-b from-pink-400 to-transparent h-40 animate-drip opacity-60 rounded-full"></div>
        <div className="absolute top-0 right-1/3 w-1.5 bg-gradient-to-b from-amber-400 to-transparent h-32 animate-drip-slow opacity-50 rounded-full" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/30">
              <span className="text-white font-black text-3xl">🎵</span>
            </div>
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Welcome to Paradise!
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Let's get to know you better
            </p>
          </div>

          {/* Onboarding Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-white/50 to-amber-100/50 animate-pulse opacity-30"></div>
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-pink-400/20 focus:ring-4 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This is how you'll appear to other investors and artists
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || loading}
                  className="w-full bg-gradient-to-r from-pink-500 via-amber-400 to-orange-500 hover:from-pink-600 hover:via-amber-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/30 disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Setting up your paradise...</span>
                    </div>
                  ) : (
                    "Enter Paradise"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Almost ready to invest in music</span>
              <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}