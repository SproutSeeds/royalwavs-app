/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/investments/route'
import { getServerSession } from 'next-auth/next'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

// Mock dependencies
jest.mock('next-auth/next')
jest.mock('@/lib/db', () => ({
  db: {
    investment: {
      findMany: jest.fn(),
    },
    song: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockDb = db as jest.Mocked<typeof db>
const mockStripe = stripe as jest.Mocked<typeof stripe>

describe('/api/investments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/investments', () => {
    it('should return user investments when authenticated', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const mockInvestments = [
        {
          id: 'inv1',
          amountInvested: 100,
          royaltyPercentage: 10,
          createdAt: '2024-01-01T00:00:00.000Z',
          song: {
            id: 'song1',
            title: 'Test Song',
            artistName: 'Test Artist',
            albumArtUrl: 'https://example.com/art.jpg',
            monthlyRevenue: 50,
          },
          payouts: [
            {
              id: 'payout1',
              amount: 5,
              period: '2024-01',
              paidAt: '2024-02-01T00:00:00.000Z'
            }
          ]
        }
      ]

      mockDb.investment.findMany.mockResolvedValue(mockInvestments)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockInvestments)
      expect(mockDb.investment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
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
            take: 5,
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should reject unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('POST /api/investments', () => {
    it('should create Stripe checkout session for valid investment', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const mockSong = {
        id: 'song1',
        title: 'Test Song',
        artistName: 'Test Artist',
        investments: []
      }
      mockDb.song.findUnique.mockResolvedValue(mockSong)

      const mockCheckoutSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123'
      }
      mockStripe.checkout.sessions.create.mockResolvedValue(mockCheckoutSession as any)

      const { req } = createMocks({
        method: 'POST',
        body: {
          songId: 'song1',
          amount: 100,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.checkoutUrl).toBe(mockCheckoutSession.url)
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Investment in "Test Song"',
                description: 'Royalty investment in Test Song by Test Artist',
              },
              unit_amount: 10000, // $100 in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/song/song1?canceled=true`,
        metadata: {
          songId: 'song1',
          userId: 'user1',
          amount: '100',
        },
      })
    })

    it('should reject investment in non-existent song', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      mockDb.song.findUnique.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {
          songId: 'nonexistent',
          amount: 100,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Song not found')
    })

    it('should validate minimum investment amount', async () => {
      const mockSession = {
        user: { id: 'user1', email: 'test@example.com' }
      }
      mockGetServerSession.mockResolvedValue(mockSession)

      const { req } = createMocks({
        method: 'POST',
        body: {
          songId: 'song1',
          amount: 0.50, // Below minimum
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
    })

    it('should reject unauthenticated investment attempts', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const { req } = createMocks({
        method: 'POST',
        body: {
          songId: 'song1',
          amount: 100,
        },
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})