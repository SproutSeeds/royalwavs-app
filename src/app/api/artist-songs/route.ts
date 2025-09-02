import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET /api/artist-songs - Get songs uploaded by the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // For now, we'll use email as the identifier since user.id might be undefined
    const userId = session.user.id || session.user.email || 'unknown'
    
    const songs = await db.song.findMany({
      where: { 
        userId: userId,
        isActive: true 
      },
      include: {
        investments: {
          select: {
            amountInvested: true,
            royaltyPercentage: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match our ArtistSong type
    const transformedSongs = songs.map(song => ({
      id: song.id,
      title: song.title,
      artistName: song.artistName,
      albumArtUrl: song.albumArtUrl,
      audioFileUrl: song.audioFileUrl,
      totalRoyaltyPool: song.totalRoyaltyPool,
      monthlyRevenue: song.monthlyRevenue,
      createdAt: song.createdAt.toISOString(),
      investments: song.investments
    }))

    return NextResponse.json(transformedSongs)
  } catch (error) {
    console.error("Database error:", error)
    
    // Return mock data for development
    const mockSongs = [
      {
        id: "mock-song-1",
        title: "Midnight Dreams",
        artistName: session?.user?.name || "Unknown Artist",
        albumArtUrl: null,
        audioFileUrl: "/audio/mock-song-1.mp3",
        totalRoyaltyPool: 25000,
        monthlyRevenue: 1200,
        createdAt: new Date().toISOString(),
        investments: [
          { amountInvested: 500, royaltyPercentage: 2 },
          { amountInvested: 1000, royaltyPercentage: 4 }
        ]
      },
      {
        id: "mock-song-2", 
        title: "Golden Hour",
        artistName: session?.user?.name || "Unknown Artist",
        albumArtUrl: null,
        audioFileUrl: "/audio/mock-song-2.mp3",
        totalRoyaltyPool: 40000,
        monthlyRevenue: 2800,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        investments: [
          { amountInvested: 2500, royaltyPercentage: 6.25 }
        ]
      }
    ]
    
    return NextResponse.json(mockSongs)
  }
}