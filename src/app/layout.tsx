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
            <div className="min-h-screen relative overflow-hidden">
            {/* Tropical Ocean Background */}
            <div className="absolute inset-0" style={{background: 'var(--bg-gradient)'}}>
              {/* Ocean waves effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/10"></div>
              </div>
              {/* Palm leaf shadows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-transparent via-emerald-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-transparent via-teal-800/15 to-transparent"></div>
            </div>
            
            {/* Golden hour glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}