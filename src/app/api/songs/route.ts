import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSongSchema = z.object({
  title: z.string().min(1).max(100),
  artistName: z.string().min(1).max(100),
  albumArtUrl: z.string().url().optional(),
  totalRoyaltyPool: z.number().min(0),
})

// GET /api/songs - Get all songs
export async function GET() {
  try {
    const songs = await db.song.findMany({
      where: { isActive: true },
      include: {
        artist: {
          select: { id: true, name: true }
        },
        investments: {
          select: {
            amountInvested: true,
            royaltyPercentage: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Error fetching songs:", error)
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    )
  }
}

// POST /api/songs - Create a new song (artists only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSongSchema.parse(body)

    const song = await db.song.create({
      data: {
        ...validatedData,
        artistId: session.user.id,
      },
    })

    return NextResponse.json(song)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    )
  }
}