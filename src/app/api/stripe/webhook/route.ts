import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata) {
          await handleSuccessfulPayment(session)
        }
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { songId, userId, amount } = session.metadata!
  const amountNumber = parseFloat(amount)

  // Get current song data to calculate new royalty percentage
  const song = await db.song.findUnique({
    where: { id: songId },
    include: { investments: true }
  })

  if (!song) {
    throw new Error(`Song ${songId} not found`)
  }

  // Calculate new total pool and user's percentage
  const newTotalPool = Number(song.totalRoyaltyPool) + amountNumber
  const userPercentage = (amountNumber / newTotalPool) * 100

  // Update or create investment record
  await db.investment.upsert({
    where: {
      songId_userId: {
        songId,
        userId,
      },
    },
    update: {
      amountInvested: {
        increment: amountNumber,
      },
      // Recalculate percentage based on new total
      royaltyPercentage: userPercentage,
    },
    create: {
      songId,
      userId,
      amountInvested: amountNumber,
      royaltyPercentage: userPercentage,
    },
  })

  // Update song's total royalty pool
  await db.song.update({
    where: { id: songId },
    data: {
      totalRoyaltyPool: newTotalPool,
    },
  })

  // Recalculate all other investors' percentages
  await recalculateRoyaltyPercentages(songId, newTotalPool)

  console.log(`Investment processed: $${amount} in song ${songId} by user ${userId}`)
}

async function recalculateRoyaltyPercentages(songId: string, newTotalPool: number) {
  const investments = await db.investment.findMany({
    where: { songId },
  })

  for (const investment of investments) {
    const newPercentage = (Number(investment.amountInvested) / newTotalPool) * 100
    
    await db.investment.update({
      where: { id: investment.id },
      data: { royaltyPercentage: newPercentage },
    })
  }
}