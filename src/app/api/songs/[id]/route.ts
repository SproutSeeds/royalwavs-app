import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/songs/[id] - Get individual song
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const song = await db.song.findUnique({
      where: { 
        id: params.id,
        isActive: true 
      },
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
      }
    })

    if (!song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(song)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 }
    )
  }
}