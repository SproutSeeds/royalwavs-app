import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RoyalWavs - Invest in Song Royalties",
  description: "Buy and trade royalty shares in your favorite songs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            {/* Fixed Background Layer */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
              {/* Starry Night Background Effects */}
              <div className="absolute inset-0">
                {/* Twinkling Stars */}
                <div className="absolute top-10 left-10 w-1 h-1 bg-white/80 rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-20 right-1/4 w-1.5 h-1.5 bg-blue-200/60 rounded-full animate-twinkle" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute top-32 left-1/3 w-1 h-1 bg-yellow-200/70 rounded-full animate-twinkle" style={{ animationDelay: '2.4s' }}></div>
                <div className="absolute top-40 right-1/3 w-2 h-2 bg-white/90 rounded-full animate-twinkle" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute top-52 left-1/2 w-1 h-1 bg-blue-300/50 rounded-full animate-twinkle" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-64 right-1/5 w-1.5 h-1.5 bg-white/60 rounded-full animate-twinkle" style={{ animationDelay: '1.6s' }}></div>
                
                <div className="absolute top-80 left-1/5 w-1 h-1 bg-yellow-300/80 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-96 right-2/5 w-2 h-2 bg-blue-100/70 rounded-full animate-twinkle" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute bottom-80 left-1/4 w-1 h-1 bg-white/75 rounded-full animate-twinkle" style={{ animationDelay: '2.8s' }}></div>
                <div className="absolute bottom-64 right-1/6 w-1.5 h-1.5 bg-blue-200/85 rounded-full animate-twinkle" style={{ animationDelay: '1.4s' }}></div>
                <div className="absolute bottom-48 left-1/3 w-1 h-1 bg-yellow-200/65 rounded-full animate-twinkle" style={{ animationDelay: '3.2s' }}></div>
                <div className="absolute bottom-32 right-1/2 w-1 h-1 bg-white/55 rounded-full animate-twinkle" style={{ animationDelay: '0.6s' }}></div>
                
                <div className="absolute bottom-16 left-2/5 w-2 h-2 bg-blue-300/60 rounded-full animate-twinkle" style={{ animationDelay: '2.2s' }}></div>
                <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-white/70 rounded-full animate-twinkle" style={{ animationDelay: '1.8s' }}></div>
                <div className="absolute top-1/3 right-1/8 w-1.5 h-1.5 bg-yellow-300/50 rounded-full animate-twinkle" style={{ animationDelay: '2.6s' }}></div>
                <div className="absolute bottom-1/4 left-1/8 w-1 h-1 bg-blue-200/75 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 right-1/7 w-1 h-1 bg-white/80 rounded-full animate-twinkle" style={{ animationDelay: '3.4s' }}></div>
                
                {/* Additional scattered stars */}
                <div className="absolute top-1/6 left-3/4 w-1 h-1 bg-blue-100/60 rounded-full animate-twinkle" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-2/3 left-1/7 w-1.5 h-1.5 bg-white/65 rounded-full animate-twinkle" style={{ animationDelay: '2.4s' }}></div>
                <div className="absolute top-3/4 right-3/4 w-1 h-1 bg-yellow-200/70 rounded-full animate-twinkle" style={{ animationDelay: '1.2s' }}></div>
                
                {/* Shooting Stars - Each traveling different paths */}
                <div className="absolute top-20 left-0 w-2 h-0.5 bg-gradient-to-r from-white to-transparent rounded-full animate-shooting-star-1" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-40 right-0 w-1.5 h-0.5 bg-gradient-to-l from-blue-200 to-transparent rounded-full animate-shooting-star-2" style={{ animationDelay: '7s' }}></div>
                <div className="absolute bottom-32 left-0 w-3 h-0.5 bg-gradient-to-r from-yellow-200 to-transparent rounded-full animate-shooting-star-3" style={{ animationDelay: '12s' }}></div>
                <div className="absolute top-60 left-0 w-2.5 h-0.5 bg-gradient-to-r from-purple-200 to-transparent rounded-full animate-shooting-star-1" style={{ animationDelay: '18s' }}></div>
                <div className="absolute top-80 right-0 w-2 h-0.5 bg-gradient-to-l from-cyan-200 to-transparent rounded-full animate-shooting-star-2" style={{ animationDelay: '25s' }}></div>
                
                {/* Subtle nebula effect */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/8 to-blue-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500/6 to-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
              
              {/* Golden Hour Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/8 via-transparent to-transparent"></div>
            </div>
            
            {/* Content Layer */}
            <div className="relative min-h-screen z-10">
              {/* Navigation floating over background */}
              <Navigation />
              
              {/* Content */}
              <main className="px-4 py-8">
                {children}
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}