import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { z } from "zod"

const createInvestmentSchema = z.object({
  songId: z.string(),
  amount: z.number().min(1), // Minimum $1
})

// GET /api/investments - Get user's investments
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investments = await db.investment.findMany({
      where: { userId: session.user.id },
      include: {
        song: {
          select: {
            id: true,
            title: true,
            artistName: true,
            albumArtUrl: true,
            monthlyRevenue: true,
          }
        },
        payouts: {
          orderBy: { paidAt: 'desc' },
          take: 5, // Last 5 payouts
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(investments)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    )
  }
}

// POST /api/investments - Create/update investment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { songId, amount } = createInvestmentSchema.parse(body)

    // Get the song and check if it exists
    const song = await db.song.findUnique({
      where: { id: songId },
      include: { investments: true }
    })

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      )
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Investment in "${song.title}"`,
              description: `Royalty investment in ${song.title} by ${song.artistName}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/song/${songId}?canceled=true`,
      metadata: {
        songId,
        userId: session.user.id,
        amount: amount.toString(),
      },
    })

    return NextResponse.json({ checkoutUrl: checkoutSession.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    )
  }
}